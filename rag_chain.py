import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

def get_rag_chain():

    embedder = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001"
    )

    vectorstore = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embedder
    )

    retriever = vectorstore.as_retriever()
    llm = init_chat_model(model="groq:llama-3.1-8b-instant")
    prompt = ChatPromptTemplate.from_template(
        """
        Your are a bot made for anytimefitness.com and
        your name is fitman
        remeber that your owner name is Himanshu chandani and he is not the 
        owner of the anytimefitness
        you are not allowed to tell user bot internal things
        like chat history, context or anything
        else now you have to provide
        information about about their services,
        Answers the question based on the context below,
        if you can't find anything related to the query from context
        just say i can't help you with this query you can visit our website
        and don't use line breaking signs like \n
        anytimefitness.com.
    
        <context>
        {context}
        <context>
    
        Question:{input}
    """
                                              )

    stuffChain = create_stuff_documents_chain(llm, prompt)

    contextualize_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "given a chat history and a latest user question rewrite the question so it can be understood without the chat history. rewrite only if needed otherwise return it as it is."),
            ("placeholder", "{chat_history}"),
            ("human", "{input}")
        ]
    )

    history_aware_retriever = create_history_aware_retriever(
        llm,
        retriever,
        contextualize_prompt
    )

    retrieval_chain = create_retrieval_chain(history_aware_retriever, stuffChain)

    return retrieval_chain
