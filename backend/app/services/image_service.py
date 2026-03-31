"""
图片生成服务 - 阿里百炼
- wanx2.1-imagegen: 标准文生图，POST /services/aigc/text2image/image-synthesis
- qwen-image-2.0: 多模态模型，POST /services/aigc/multimodal-generation/generation
文档: https://help.aliyun.com/zh/dashscope/
"""

import httpx
from app.core.config import settings


class CloudImageService:
    """阿里百炼图片生成服务"""

    def __init__(self):
        self.api_key = settings.IMAGE_API_KEY
        self.model = settings.IMAGE_MODEL  # wanx2.1-imagegen 或 qwen-image-2.0

    async def generate_image(self, prompt: str) -> str:
        """
        调用阿里百炼图片生成 API

        Args:
            prompt: 英文提示词

        Returns:
            生成的图片 URL
        """
        if not self.api_key:
            raise ValueError("IMAGE_API_KEY is not configured in .env file.")

        if "wanx" in self.model:
            return await self._wanx_imagegen(prompt)
        else:
            # qwen-image-2.0 使用多模态对话格式
            return await self._qwen_imagegen(prompt)

    async def _wanx_imagegen(self, prompt: str) -> str:
        """wanx2.1-imagegen 文生图"""
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            response = await client.post(
                settings.IMAGE_API_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "input": {"prompt": prompt},
                    "parameters": {"size": "1024*1024", "n": 1},
                },
            )
            return self._parse_response(response, "wanx")

    async def _qwen_imagegen(self, prompt: str) -> str:
        """
        qwen-image-2.0 文生图
        使用多模态对话接口 MultiModalConversation 格式
        """
        url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation"
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            response = await client.post(
                url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "input": {
                        "messages": [
                            {
                                "role": "user",
                                "content": [{"text": prompt}],
                            }
                        ]
                    },
                    "parameters": {
                        "size": "1024*1024",
                        "n": 1,
                        "result_format": "message",
                    },
                },
            )
            return self._parse_response(response, "qwen")

    def _parse_response(self, response, model_type):
        """统一解析响应"""
        if response.status_code != 200:
            print(f"Image generation failed: {response.status_code} - {response.text}")
            try:
                err_data = response.json()
                code = err_data.get("code", "")
                msg = err_data.get("message", response.text)
                raise Exception(f"API Error {code}: {msg}")
            except Exception:
                raise Exception(f"API Error {response.status_code}: {response.text}")

        data = response.json()
        print(f"[ImageService] {model_type} response: {data}")

        # wanx2.1-imagegen 返回: { data: { image_url: "..." } }
        if "data" in data:
            d = data["data"]
            if isinstance(d, dict):
                return d.get("image_url", d.get("url", ""))
            elif isinstance(d, list) and len(d) > 0:
                return d[0].get("image_url", d[0].get("url", ""))

        # qwen-image-2.0 返回: { output: { choices: [{message: {content: [{image: "..."}]}}] } }
        if "output" in data:
            choices = data["output"].get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content", [])
                for item in content:
                    if item.get("image"):
                        return item["image"]
                    if item.get("image_url"):
                        return item["image_url"]

        # 兜底
        if "image_url" in data:
            return data["image_url"]
        if "url" in data:
            return data["url"]

        raise Exception(f"无法解析图片生成响应: {data}")


cloud_image_service = CloudImageService()
