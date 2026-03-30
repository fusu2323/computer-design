from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.orchestrator_service import orchestrator_service

router = APIRouter()

class OrchestratorRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = None

class OrchestratorResponse(BaseModel):
    intent: Dict[str, Any]
    tasks: List[Dict[str, Any]]
    results: Dict[str, Any]
    final_answer: str
    suggested_actions: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = ""

@router.post("/process", response_model=OrchestratorResponse)
async def process_request(request: OrchestratorRequest):
    """
    接收用户自然语言输入，经过主协调器处理：
    1. 意图识别
    2. 直接分流执行
    3. 返回结果
    """
    try:
        result = await orchestrator_service.process_request(
            query=request.query,
            session_id=request.session_id,
            history=request.history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
