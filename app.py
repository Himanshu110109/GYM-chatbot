from rag_chain import get_rag_chain
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chain = None
chat_history = []


class Query(BaseModel):
    question: str


@app.on_event("startup")
def load_chain():
    global chain
    chain = get_rag_chain()


@app.get("/")
def root():
    return {"message": "Gym AI Chatbot API is running"}


@app.post("/chat")
def chat(query: Query):
    response = chain.invoke({
        "input": query.question,
        "chat_history": chat_history
    })

    chat_history.append(HumanMessage(content=query.question))
    chat_history.append(AIMessage(content=response["answer"]))

    return {"answer": response["answer"]}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
