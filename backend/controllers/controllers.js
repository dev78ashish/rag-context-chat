import { index } from "../config/pinecone.js";
import { chunkText } from "../utils/chunk.js";
import { client } from "../config/groq.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const healthCheck = (req, res) => {
    res.json({
        success: true,
        data: "Server working fine!!"
    });
};


export const createSession = (req, res) => {
    try {
        if (!process.env.SESSION_SECRET) {
            throw new Error("SESSION_SECRET is not configured");
        }

        const sessionId = crypto.randomUUID();

        const token = jwt.sign(
            { sessionId },
            process.env.SESSION_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            success: true,
            sessionToken: token
        });

    } catch (error) {
        console.error("Error creating session:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create session"
        });
    }
};


export const setContext = async (req, res) => {
    try {

        const sessionId = req.sessionId;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Invalid session"
            });
        }


        const context = req.body?.context;

        if (
            !context ||
            typeof context !== "string" ||
            !context.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Context is required and must be a non-empty string"
            });
        }


        if (context.length > 1_000_000) {
            return res.status(400).json({
                success: false,
                message: "Context is too large"
            });
        }


        console.log(
            `Context received for session: ${sessionId}`
        );


        console.log(
            "Context received, now converting it into chunks..."
        );

        const chunks = chunkText(context.trim());


        if (!chunks.length) {
            return res.status(400).json({
                success: false,
                message: "Could not create chunks from context"
            });
        }


        console.log(
            `${chunks.length} chunks created, now uploading to Pinecone...`
        );


        const namespace = index.namespace(sessionId);


        const records = chunks.map((chunk, i) => ({
            _id: `chunk_${i}`,
            text: chunk
        }));


        await namespace.upsertRecords({
            records
        });


        res.json({
            success: true,
            message: "Context received and stored successfully",
            chunks: chunks.length
        });

    } catch (error) {

        console.error(
            "Error storing context:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to store context"
        });
    }
};


export const queryContext = async (req, res) => {
    try {

        const sessionId = req.sessionId;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Invalid session"
            });
        }


        const question = req.body?.question;

        if (
            !question ||
            typeof question !== "string" ||
            !question.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Question is required and must be a non-empty string"
            });
        }


        if (question.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Question is too long"
            });
        }


        console.log(
            `Searching Pinecone for session ${sessionId}:`,
            question
        );


        const namespace = index.namespace(sessionId);


        const results = await namespace.searchRecords({
            query: {
                topK: 5,
                inputs: {
                    text: question.trim()
                }
            }
        });


        const hits = results?.result?.hits || [];


        if (!hits.length) {
            return res.json({
                success: true,
                answer: "I don't have enough information in the provided context."
            });
        }


        const chunks = hits
            .map((hit) => hit.fields?.text)
            .filter(Boolean);


        if (!chunks.length) {
            return res.json({
                success: true,
                answer: "I don't have enough information in the provided context."
            });
        }


        const context = chunks.join("\n\n");


        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",

            input: `
                You are a helpful assistant.

                Answer the user's question using ONLY the provided context.

                Rules:
                - Do not use outside knowledge.
                - Do not make up information.
                - If the answer cannot be found in the context, say:
                "I don't have enough information in the provided context."

                Context:
                ${context}

                Question:
                ${question.trim()}
            `,
        });


        res.json({
            success: true,
            answer: response.output_text
        });

    } catch (error) {

        console.error(
            "Error searching context:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to search context"
        });
    }
};