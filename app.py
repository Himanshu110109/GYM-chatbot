print("🚀 STEP 0: Starting file execution")

# 🔥 BEFORE import
print("📦 STEP 1: About to import rag_chain")

from rag_chain import get_rag_chain

print("✅ STEP 2: rag_chain imported successfully")

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.middleware.cors import CORSMiddleware
import os

print("⚙️ STEP 3: Creating FastAPI app")

app = FastAPI()

print("📁 STEP 4: Checking DB")
print("DB exists:", os.path.exists("./chroma_db"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chain = None
chat_history = []

def get_chain():
    global chain
    print("🔁 STEP 5: get_chain called")

    if chain is None:
        print("🧠 STEP 6: Initializing RAG chain...")
        chain = get_rag_chain()
        print("✅ STEP 7: RAG chain initialized")

    return chain


class Query(BaseModel):
    question: str


@app.get("/")
def root():
    print("🌐 STEP 8: Root endpoint hit")
    return "server is running"


@app.post("/chat")
def chat(query: Query):
    print("📩 STEP 9: /chat endpoint hit")

    try:
        current_chain = get_chain()

        print("⚡ STEP 10: Invoking chain")

        response = current_chain.invoke({
            "input": query.question,
            "chat_history": chat_history
        })

        print("✅ STEP 11: Chain response received")

        chat_history.append(HumanMessage(content=query.question))
        chat_history.append(AIMessage(content=response.get("answer", "")))

        return {"answer": response.get("answer", "No answer")}

    except Exception as e:
        print("🔥 ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
