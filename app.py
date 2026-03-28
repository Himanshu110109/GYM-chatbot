from rag_chain import get_rag_chain
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
print("app starting")
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
    if chain is None:
        print("Initializing RAG chain...")
        chain = get_rag_chain()
    return chain

class Query(BaseModel):
    question: str

@app.get("/")
def root():
    print("app started")
    return "server is running"


@app.post("/chat")
def chat(query: Query):
    try:
        current_chain = get_chain()

        response = current_chain.invoke({
            "input": query.question,
            "chat_history": chat_history
        })

        chat_history.append(HumanMessage(content=query.question))
        chat_history.append(AIMessage(content=response["answer"]))

        return {"answer": response["answer"]}

    except Exception as e:
        print("FULL ERROR:", repr(e))  # logs in Render
        raise HTTPException(status_code=500, detail=str(e))
