import json
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any
from fastapi import UploadFile, HTTPException
from app.schemas.contracts import KnowledgeDocument

DATA_DIR = Path(__file__).parent.parent.parent / "data"
KNOWLEDGE_DIR = DATA_DIR / "knowledge"
FILES_DIR = KNOWLEDGE_DIR / "files"
DOCUMENTS_FILE = KNOWLEDGE_DIR / "documents.json"

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md", ".docx"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

DEFAULT_DEMO_DOCUMENTS = [
    {
        "document_id": "doc_demo_001",
        "filename": "Survey_Sampling_Methods.pdf",
        "file_type": "PDF",
        "size_bytes": 2457600,
        "uploaded_at": "2026-08-02T10:00:00Z",
        "status": "ready"
    },
    {
        "document_id": "doc_demo_002",
        "filename": "National_Accounts_Handbook.docx",
        "file_type": "DOCX",
        "size_bytes": 1420000,
        "uploaded_at": "2026-08-30T09:15:00Z",
        "status": "ready"
    },
    {
        "document_id": "doc_demo_003",
        "filename": "Data_Quality_Assurance_Standards.md",
        "file_type": "MD",
        "size_bytes": 384000,
        "uploaded_at": "2026-08-30T14:30:00Z",
        "status": "ready"
    }
]

class DocumentService:

    @classmethod
    def _ensure_directories(cls):
        KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
        FILES_DIR.mkdir(parents=True, exist_ok=True)
        if not DOCUMENTS_FILE.exists():
            with open(DOCUMENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_DEMO_DOCUMENTS, f, indent=2)

    @classmethod
    def _sanitize_filename(cls, filename: str) -> str:
        # Strip directories and keep safe characters only
        base = Path(filename).name
        sanitized = re.sub(r"[^a-zA-Z0-9_.-]", "_", base)
        return sanitized or "document.txt"

    @classmethod
    async def upload_document(cls, file: UploadFile) -> KnowledgeDocument:
        cls._ensure_directories()

        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")

        sanitized_name = cls._sanitize_filename(file.filename)
        ext = Path(sanitized_name).suffix.lower()

        if ext not in ALLOWED_EXTENSIONS:
            allowed_str = ", ".join(ALLOWED_EXTENSIONS)
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file extension '{ext}'. Allowed formats: {allowed_str}"
            )

        content = await file.read()

        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes)")

        if len(content) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024*1024)}MB"
            )

        document_id = f"doc_{uuid.uuid4().hex[:8]}"
        saved_filename = f"{document_id}_{sanitized_name}"
        destination_path = FILES_DIR / saved_filename

        try:
            with open(destination_path, "wb") as f:
                f.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to persist file: {str(e)}")

        new_doc: Dict[str, Any] = {
            "document_id": document_id,
            "filename": sanitized_name,
            "file_type": ext.replace(".", "").upper(),
            "size_bytes": len(content),
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
            "status": "ready"
        }

        # Persist metadata
        existing_docs = cls._load_documents_metadata()
        existing_docs.insert(0, new_doc)
        cls._save_documents_metadata(existing_docs)

        return KnowledgeDocument(**new_doc)

    @classmethod
    def list_documents(cls) -> List[KnowledgeDocument]:
        cls._ensure_directories()
        docs = cls._load_documents_metadata()
        return [KnowledgeDocument(**d) for d in docs]

    @classmethod
    def _load_documents_metadata(cls) -> List[Dict[str, Any]]:
        cls._ensure_directories()
        try:
            with open(DOCUMENTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return list(DEFAULT_DEMO_DOCUMENTS)

    @classmethod
    def _save_documents_metadata(cls, docs: List[Dict[str, Any]]):
        try:
            with open(DOCUMENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(docs, f, indent=2)
        except Exception as e:
            print(f"[DocumentService] Failed to save documents metadata: {e}")
