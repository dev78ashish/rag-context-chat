# RAG Context Chat 🤖💬

A full-stack context-aware AI chat application powered by **React 19**, **Vite**, **Tailwind CSS**, **Node.js/Express**, **Groq / OpenAI**, and **Pinecone Vector Database**.

Users can provide custom knowledge/context per session, which is chunked, vectorized, and stored in Pinecone namespaces. The AI assistant then answers questions strictly based on the provided context using Retrieval-Augmented Generation (RAG).

---

## 🌟 Features

- **Dynamic Context Injection**: Upload and vectorize custom text context on the fly.
- **Session-Based Isolation**: Each session generates a unique JWT token and an isolated Pinecone namespace.
- **Vector Search & RAG**: Accurate retrieval using Pinecone vector search and LLM completion.
- **Modern UI**: Built with React 19, TypeScript, Tailwind CSS, and Zustand.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Pinecone](https://www.pinecone.io/) account and API key
- [Groq](https://groq.com/) account and API key

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (refer to `backend/.env.example`):

```env
PORT=3000
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=default
GROQ_API_KEY=your_groq_api_key
SESSION_SECRET=your_jwt_secret_key
```

Run the backend server:

```bash
npm run dev
# Server will run on http://localhost:3000
```

---

### 2. Frontend Setup

In the root directory:

```bash
npm install
```

Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Groq & Pinecone configurations
│   ├── controllers/     # Session, context indexing, and RAG query handlers
│   ├── middleware/      # JWT session authentication
│   ├── routes/          # API routes
│   └── utils/           # Text chunking utilities
├── src/
│   ├── components/      # InputScreen and ChatScreen UI
│   ├── routes/          # App routing
│   ├── store/           # Zustand session store
│   ├── App.tsx
│   └── main.tsx
├── .env.example
└── README.md
```
