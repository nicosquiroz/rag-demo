from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from .rag import process_pdf, RAGPipeline
from .pdf_utils import extract_text_from_pdf, extract_formulas_with_llm

router = APIRouter()
rag = RAGPipeline()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):

    contents = await file.read()
    text = extract_text_from_pdf(contents)
    # query = "Extract all the parts from the pdf that contain formulas"
    # top_chunks = rag.process(text, query)
    # python_code = process_pdf(file)
    # python_code = "\n".join(chunk for chunk, score in top_chunks)
    python_code = extract_formulas_with_llm(contents)
    return JSONResponse(content={"code": python_code})