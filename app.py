from rag_chain import get_rag_chain
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
chain = get_rag_chain()

chat_history = []

class Query(BaseModel):
    question: str

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
