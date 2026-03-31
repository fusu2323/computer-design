import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ArtifactCard from '../components/ArtifactCard';
import PromptOptimizerModal from '../components/PromptOptimizerModal';
import axios from 'axios';

const CreativeWorkshop = () => {
  const [idea, setIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [masterReply, setMasterReply] = useState('');
  const [artifactData, setArtifactData] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(false);

  const handleImageUpload = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handleOptimizerAdopt = (optimizedPrompt) => {
    setIdea(optimizedPrompt);
    setAiOptimizationEnabled(false);
  };

  const handleGenerate = async () => {
    if (!idea.trim() && !uploadedImage) {
      setError('请输入描述文字或上传图片');
      return;
    }

    try {
      setError('');
      setArtifactData(null);
      setGeneratedContent(null);
      setMasterReply('');
      
      let imageUrl = null;
      
      // Step 1: Upload image if provided
      if (uploadedImage) {
        setLoadingStep(1);
        const formData = new FormData();
        formData.append('file', uploadedImage);
        
        const uploadRes = await axios.post('http://localhost:8002/api/v1/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        imageUrl = uploadRes.data.image_url;
      }
      
      // Step 2: Enrich prompt + Create artwork
      setLoadingStep(2);

      // 2a: 先优化提示词（走 DeepSeek）
      const enrichRes = await axios.post('http://localhost:8002/api/v1/creative/enrich-prompt', {
        idea: idea || '创意作品',
        style: '数字文创'
      });
      const { optimized_prompt } = enrichRes.data.data;

      // 2b: 再调用图片生成
      const createRes = await axios.post('http://localhost:8002/api/v1/creative/generate-image', {
        optimized_prompt: optimized_prompt
      });

      imageUrl = createRes.data.image_url;
      console.log('Generated image URL:', imageUrl);
      console.log('Image URL starts with localhost:', imageUrl?.startsWith('http://localhost:8002'));
      
      // Step 3: Generate story
      setLoadingStep(3);
      const storyRes = await axios.post('http://localhost:8002/api/v1/creative/generate-story', {
        idea: idea || "创意作品",
        style: "数字文创",
        image_url: imageUrl
      });
      
      const { title, poem, description } = storyRes.data.data;

      setArtifactData({
        imageUrl,
        title,
        poem,
        description,
      });

      setGeneratedContent({
        poem,
        description,
      });
      setLoadingStep(0);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || '生成过程中发生错误，请稍后重试。');
      setLoadingStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-rice-paper font-sans">
      <Navbar />
      
      <main className="pt-24 px-8 pb-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-xiaowei text-4xl text-ink-black mb-4">云端非遗数字文创工坊</h1>
          <p className="text-charcoal/80 max-w-2xl mx-auto">
            输入创意文字或上传图片，AI 将为您创作独一无二的数字藏品。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Input & Interaction */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-ink-black/5 flex flex-col gap-6 h-fit">
            
            <div>
              <label className="block font-xiaowei text-xl text-ink-black mb-3">1. 上传图片</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-vermilion bg-vermilion/5' 
                    : imagePreview 
                      ? 'border-vermilion/50 bg-vermilion/5' 
                      : 'border-ink-black/20 hover:border-ink-black/40'
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="预览" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-vermilion text-white rounded-full hover:bg-vermilion/80 transition-colors flex items-center justify-center"
                      title="删除图片"
                    >
                      ✕
                    </button>
                    <p className="mt-3 text-sm text-charcoal/60">
                      {uploadedImage?.name}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-3">📤</div>
                    <p className="text-charcoal font-medium">
                      拖拽图片到这里，或点击选择文件
                    </p>
                    <p className="text-xs text-charcoal/40 mt-2">
                      支持 JPG、PNG，最大 10MB（不上传则使用纯文字生成）
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block font-xiaowei text-xl text-ink-black">2. 描述您的创意灵感</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-charcoal/60">AI 优化</span>
                  <button
                    onClick={() => setAiOptimizationEnabled(!aiOptimizationEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      aiOptimizationEnabled ? 'bg-vermilion' : 'bg-ink-black/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      aiOptimizationEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="例如：画一只可爱的熊猫在竹林中玩耍...（不输入则使用默认提示词进行图片转换）"
                className="w-full h-32 p-4 border border-ink-black/20 rounded focus:outline-none focus:border-vermilion focus:ring-1 focus:ring-vermilion resize-none"
              />
              <p className="mt-2 text-xs text-charcoal/60">
                💡 开启上方「AI 优化」开关，通过实时对话完善您的创意描述
              </p>
            </div>

            {error && (
              <div className="text-vermilion text-sm bg-vermilion/10 p-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loadingStep !== 0}
              className={`w-full py-4 rounded font-xiaowei text-lg transition-all ${
                loadingStep === 0 
                ? 'bg-ink-black text-rice-paper hover:bg-vermilion shadow-lg' 
                : 'bg-ink-black/50 text-rice-paper cursor-not-allowed'
              }`}
            >
              {loadingStep === 0 ? '开始创作' : '正在创作中...'}
            </button>

            {/* Status Area */}
            {loadingStep > 0 && (
              <div className="mt-4 p-5 bg-ink-black/5 rounded border border-ink-black/10 relative">
                <div className="absolute -top-3 left-4 bg-rice-paper px-2 font-xiaowei text-vermilion text-sm">
                  生成状态
                </div>
                {loadingStep === 1 && <p className="text-charcoal animate-pulse">正在上传图片...</p>}
                {loadingStep === 2 && <p className="text-charcoal animate-pulse">正在生成作品，请稍候（可能需要 10-30 秒）...</p>}
                {loadingStep === 3 && <p className="text-charcoal animate-pulse">正在为作品赋诗作词，生成数字藏品卡片...</p>}
              </div>
            )}

            {/* Generated Content Area - Poem and Description */}
            {generatedContent && (
              <div className="mt-4 p-5 bg-ink-black/5 rounded border border-ink-black/10">
                <div className="mb-3">
                  <div className="font-xiaowei text-vermilion text-sm mb-2">AI 赋诗</div>
                  <p className="text-charcoal font-medium text-lg leading-relaxed">
                    {generatedContent.poem}
                  </p>
                </div>
                <div>
                  <div className="font-xiaowei text-vermilion text-sm mb-2">创作说明</div>
                  <p className="text-charcoal/80 text-sm leading-relaxed">
                    {generatedContent.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Result / Artifact Card */}
          <div className="flex items-center justify-center min-h-[600px] bg-ink-black/5 rounded-lg border border-ink-black/10 p-8 relative">
            {loadingStep > 0 && !artifactData && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-vermilion/30 border-t-vermilion rounded-full animate-spin"></div>
                <div className="font-xiaowei text-ink-black">
                  {loadingStep === 1 && "上传图片中..."}
                  {loadingStep === 2 && "AI 创作中 (可能需要 10-30 秒)..."}
                  {loadingStep === 3 && "文化赋能中..."}
                </div>
              </div>
            )}

            {!loadingStep && !artifactData && (
              <div className="text-center text-charcoal/40 font-xiaowei text-xl">
                您的专属数字藏品将在此展示
              </div>
            )}

            {artifactData && (
              <ArtifactCard data={artifactData} />
            )}
          </div>
        </div>
      </main>

      {aiOptimizationEnabled && (
        <PromptOptimizerModal
          isOpen={aiOptimizationEnabled}
          onClose={() => setAiOptimizationEnabled(false)}
          onAdopt={handleOptimizerAdopt}
          projectCoreTheme={idea || '非遗创意主题'}
        />
      )}
    </div>
  );
};

export default CreativeWorkshop;
