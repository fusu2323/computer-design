"""
DeepSeek Chat Completions 代理端点
提供 SSE 流式输出，前端直接消费 /api/deepseek/v1/chat/completions
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Literal
import httpx
from app.core.config import settings

router = APIRouter()


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatCompletionRequest(BaseModel):
    model: str = settings.DEEPSEEK_MODEL
    messages: List[Message]
    temperature: float = 0.7
    max_tokens: int = 512
    stream: bool = True


async def _stream_deepseek(request: ChatCompletionRequest):
    """代理 DeepSeek 流式响应，yield SSE 格式数据"""
    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        payload = {
            "model": request.model,
            "messages": [m.model_dump() for m in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": True,
        }
        try:
            async with client.stream(
                "POST",
                f"{settings.DEEPSEEK_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            ) as resp:
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        yield f"{line}\n\n"
                    elif line == "data: [DONE]":
                        yield "data: [DONE]\n\n"
        except httpx.TimeoutException:
            yield "data: {\"error\": \"请求超时，请稍后再试\"}\n\n"
        except Exception as e:
            yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"


@router.post("/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    """
    DeepSeek Chat Completions 端点

    请求体:
    {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "..."},
            {"role": "user", "content": "..."}
        ],
        "temperature": 0.7,
        "max_tokens": 512,
        "stream": true
    }

    响应: SSE 流式数据，前端通过 ReadableStream 消费
    """
    if request.stream:
        return StreamingResponse(
            _stream_deepseek(request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    # 非流式兜底（实际业务只用流式）
    raise HTTPException(status_code=501, detail="Non-streaming not implemented")
