import requests
import os
from dotenv import load_dotenv
from langchain_core.embeddings import Embeddings

load_dotenv()

class CloudFlareEmbeddings(Embeddings):
  def __init__(self):
        self.account_id = os.getenv("CF_ACCOUNT_ID")
        self.api_token = os.getenv("CF_API_TOKEN")

        self.url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/@cf/baai/bge-small-en-v1.5"

        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }

  def embed_documents(self, texts):
        response = requests.post(
            self.url,
            headers=self.headers,
            json={"text": texts},
            timeout=10
        )
        result = response.json()

        if "result" not in result:
            raise Exception(f"Cloudflare error: {result}")

        return result["result"]["data"]

  def embed_query(self, text):
        response = requests.post(
            self.url,
            headers=self.headers,
            json={"text": [text]},
            timeout=10
        )
        result = response.json()

        if "result" not in result:
            raise Exception(f"Cloudflare error: {result}")

        return result["result"]["data"][0]
