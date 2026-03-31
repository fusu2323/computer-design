from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from app.services.llm_service import LangChainService

router = APIRouter()
llm_service = LangChainService()

class Landmark(BaseModel):
    x: float
    y: float
    z: float

class PoseRequest(BaseModel):
    landmarks: List[List[Landmark]]  # Support multiple hands
    scenario: str  # 'shadow' only
    need_feedback: bool = False

def _calculate_angle(p1, p2, p3):
    """Calculate angle at vertex p2 (p1-p2-p3), returns degrees."""
    a = np.array([p1.x, p1.y])
    b = np.array([p2.x, p2.y])
    c = np.array([p3.x, p3.y])
    ba = a - b
    bc = c - b
    dot = np.dot(ba, bc)
    mag_a = np.linalg.norm(ba)
    mag_b = np.linalg.norm(bc)
    cos_angle = dot / (mag_a * mag_b + 1e-6)
    angle = np.arccos(np.clip(cos_angle, -1.0, 1.0))
    return np.degrees(angle)

def evaluate_shadow(hand: List[Landmark]) -> Dict[str, Any]:
    """
    Shadow Puppet: Rabbit hand (兔子)
    Index (8) and Middle (12) extended UP.
    Thumb (4), Ring (16), Pinky (20) pinched together.
    Uses MCP joint angles for camera-distance invariant detection.
    """
    wrist = hand[0]
    index_mcp = hand[5]
    index_pip = hand[6]
    middle_mcp = hand[9]
    middle_pip = hand[10]
    ring_mcp = hand[13]
    ring_pip = hand[14]
    pinky_mcp = hand[17]
    pinky_pip = hand[18]
    thumb_mcp = hand[2]
    thumb_ip = hand[3]

    # Calculate MCP angles
    index_angle = _calculate_angle(wrist, index_mcp, index_pip)
    middle_angle = _calculate_angle(wrist, middle_mcp, middle_pip)
    ring_angle = _calculate_angle(wrist, ring_mcp, ring_pip)
    pinky_angle = _calculate_angle(wrist, pinky_mcp, pinky_pip)
    thumb_angle = _calculate_angle(wrist, thumb_mcp, thumb_ip)

    score = 0
    # Extended fingers (should be ~180 degrees)
    if index_angle > 150:
        score += 25
    if middle_angle > 150:
        score += 25
    # Curled fingers (should be < 110 degrees)
    if ring_angle < 110:
        score += 20
    if pinky_angle < 110:
        score += 20
    # Thumb tucked across palm (reduced angle)
    if thumb_angle < 120:
        score += 10

    if score >= 85:
        msg = "完美的兔子手影！姿势非常标准！"
    elif score >= 60:
        if index_angle <= 150 and middle_angle <= 150:
            msg = "请把食指和中指竖直，像兔子的耳朵。"
        else:
            msg = "请把拇指、无名指和小指捏在一起。"
    else:
        msg = "请调整手势，竖起食指和中指，捏合其他三指。"

    return {"score": min(100, max(0, int(score))), "hint": msg}

@router.post("/analyze-pose")
async def analyze_pose(request: PoseRequest):
    """
    Analyze user pose for craft learning.
    Input: Skeleton data (MediaPipe)
    Output: Feedback and correction
    """
    if not request.landmarks or len(request.landmarks) == 0:
        return {"status": "waiting", "score": 0, "hint": "未检测到手部", "feedback": None}
        
    hand = request.landmarks[0] # Use the first hand detected
    
    if request.scenario == 'shadow':
        result = evaluate_shadow(hand)
    else:
        result = {"score": 0, "hint": "未知场景"}
        
    feedback_text = None
    if request.need_feedback and result["score"] >= 85:
        # Generate AI Feedback
        prompt = f"""你是一个非遗文化导师。用户正在体验【{request.scenario}】的动作挑战。
他们做出了非常标准的手势，获得了 {result["score"]} 分的高分！
请用1-2句话（不超过50字）给他们一句带有该非遗文化特色的夸奖。语言要生动、有趣、有文化底蕴。"""
        feedback_text = llm_service.chat([{"role": "user", "content": prompt}])
        
    return {
        "status": "success",
        "score": result["score"],
        "hint": result["hint"],
        "feedback": feedback_text
    }

@router.get("/history")
async def get_practice_history():
    """
    Get user practice history.
    """
    return {"history": []}

