import fitz  # PyMuPDF
import openai
import time
from .rag import RAGPipeline
import os
from dotenv import load_dotenv
import os

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=openai_api_key)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text



def extract_formulas_with_llm(text: str) -> str:
    results = []
    chunks = RAGPipeline().chunk_document(text, chunk_size=2000)  # or 1000
    for i, chunk in enumerate(chunks):
        print(f"Processing chunk {i+1}/{len(chunks)}")
        prompt = (
            "Extract all mathematical formulas from the following text and convert them to Python code:\n\n"
            f"{chunk}\n\n"
            "Python code:"
        )
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0
        )
        results.append(response.choices[0].message.content.strip())
        time.sleep(1)  # Add delay to avoid rate limit
    return "\n".join(results)





# def extract_formulas_with_llm(text: str) -> str:
#     results = []
#     chunks = rag.chunk_document(text, chunk_size=2000)
#     print(f"Number of chunks: {len(chunks)}")
#     for i, chunk in enumerate(chunks):
#         print(f"Processing chunk {i+1}/{len(chunks)} (length: {len(chunk)})")
#         prompt = (
#             "Extract all mathematical formulas from the following text and convert them to Python code:\n\n"
#             f"{page_text}\n\n"
#             "Python code:"
#         )
#         response = client.chat.completions.create(
#             model="gpt-4-turbo",
#             messages=[{"role": "user", "content": prompt}],
#             max_tokens=1000,
#             temperature=0
#         )
#         result = response.choices[0].message.content.strip()
#         results.append(result)
#     return "\n".join(results)