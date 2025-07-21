from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from datetime import datetime
import sqlite3
import uuid
from .rag import process_pdf, RAGPipeline
from .pdf_utils import extract_text_from_pdf, extract_formulas_with_llm

router = APIRouter()
rag = RAGPipeline()

DB_FILE = "indices.db"

# ---------- MODELOS ----------
class IndexCreate(BaseModel):
    name: str

class VersionCreate(BaseModel):
    version_name: str
    content: str

class VersionCompare(BaseModel):
    version_a: str
    version_b: str

# ---------- DB SETUP ----------
def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS indices (
            id TEXT PRIMARY KEY,
            name TEXT
        )''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS versions (
            id TEXT PRIMARY KEY,
            index_id TEXT,
            version_name TEXT,
            content TEXT,
            timestamp TEXT
        )''')

init_db()

# ---------- ENDPOINTS ----------
@router.post("/indices")
def create_index(index: IndexCreate):
    index_id = str(uuid.uuid4())
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO indices (id, name) VALUES (?, ?)", (index_id, index.name))
    return {"id": index_id, "name": index.name}

@router.get("/indices")
def list_indices():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM indices")
        return [
            {"id": row[0], "name": row[1]}
            for row in cursor.fetchall()
        ]

@router.post("/indices/{index_id}/versions")
def add_version(index_id: str, version: VersionCreate):
    version_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO versions (id, index_id, version_name, content, timestamp) VALUES (?, ?, ?, ?, ?)",
                       (version_id, index_id, version.version_name, version.content, timestamp))
    return {"id": version_id, "version_name": version.version_name}

@router.get("/indices/{index_id}/versions")
def list_versions(index_id: str):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, version_name, timestamp FROM versions WHERE index_id = ? ORDER BY timestamp DESC", (index_id,))
        return [
            {"id": row[0], "version_name": row[1], "timestamp": row[2]}
            for row in cursor.fetchall()
        ]

@router.get("/versions/{version_id}")
def get_version(version_id: str):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT content FROM versions WHERE id = ?", (version_id,))
        row = cursor.fetchone()
        if row:
            return {"content": row[0]}
        else:
            raise HTTPException(status_code=404, detail="Version not found")

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