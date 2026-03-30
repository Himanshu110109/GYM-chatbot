from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from bs4 import SoupStrainer
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
import os
# from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from embeddigns import CloudFlareEmbeddings
load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

links = [
    "https://www.anytimefitness.com/",
    "https://www.anytimefitness.com/training",
    "https://www.anytimefitness.com/blog",
    "https://www.anytimefitness.com/membership",
    "https://franchise.anytimefitness.com/"
]

documents = []
for link in links:
    loader = WebBaseLoader(
    web_path=(link,),
    bs_kwargs={
        "parse_only": SoupStrainer([
            "main",
            "article",
            "section",
            "h1",
            "h2",
            "h3",
            "h4",
            "p",
            "li"
        ])
    }
)
    data = loader.load()[0]
    documents.append(data)

splitted = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150).split_documents(documents)
embedder = CloudFlareEmbeddings()

vectorstore = Chroma.from_documents(
    documents=splitted,
    embedding=embedder,
    persist_directory="./chroma_db"
)

vectorstore.persist()
