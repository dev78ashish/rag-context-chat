import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSession from "../store/session";

const InputScreen: React.FC = () => {
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { sessionToken } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${apiBaseUrl}/set-context`,
        {
          context: context.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }
      );

      if (response.data.success) {
        navigate("/chat");
      } else {
        setError("Could not save context. Please try again.");
      }
    } catch (error) {
      console.error("API error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-900">
          Enter your context to get started
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Provide some context before starting the chat.
        </p>

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Enter your context..."
          rows={8}
          className="mt-6 w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{error && <span className="text-red-500">{error}</span>}</span>
          <span>{context.length} characters</span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading || !context.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Get Started"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputScreen;