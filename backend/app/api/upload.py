from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import os
import uuid
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image and return the URL.
    
    Returns:
        {
            "status": "success",
            "image_url": "http://localhost:8002/uploads/{filename}"
        }
    """
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            return {
                "status": "error",
                "message": "Invalid file type. Please upload an image."
            }
        
        ext = os.path.splitext(file.filename)[1].lower() if file.filename else '.png'
        if ext not in ALLOWED_EXTENSIONS:
            ext = '.png'
        
        filename = f"{uuid.uuid4()}{ext}"
        filepath = UPLOAD_DIR / filename
        
        content = await file.read()
        
        if len(content) > 10 * 1024 * 1024:
            return {
                "status": "error",
                "message": "File too large. Maximum size is 10MB."
            }
        
        with open(filepath, "wb") as f:
            f.write(content)
        
        image_url = f"http://localhost:8002/uploads/{filename}"
        
        return {
            "status": "success",
            "image_url": image_url,
            "filename": filename
        }
        
    except Exception as e:
        print(f"Upload error: {e}")
        return {
            "status": "error",
            "message": f"Failed to upload image: {str(e)}"
        }

@router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded files"""
    filepath = UPLOAD_DIR / filename
    if filepath.exists():
        return FileResponse(filepath)
    return {"error": "File not found"}
