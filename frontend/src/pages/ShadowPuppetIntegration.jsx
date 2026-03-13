import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ShadowPuppetApp from '../utils/ShadowPuppetSDK';

const ShadowPuppetIntegration = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        // 确保 MediaPipe 脚本已加载
        if (!window.Hands || !window.Camera) {
            console.error('请在 index.html 中引入 MediaPipe 脚本');
            return;
        }

        if (containerRef.current && !appRef.current) {
            appRef.current = new ShadowPuppetApp(containerRef.current.id, {
                assetsPath: '/assets/images/', // 确保图片资源在此路径下
                width: 1400,
                height: 1100,
                debug: true // 开启调试模式以便查看手势识别情况
            });
            
            appRef.current.start().catch(err => {
                console.error('Failed to start puppet:', err);
            });
        }

        // 清理函数
        return () => {
            if (appRef.current) {
                appRef.current.stop();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-rice-paper flex flex-col">
            <Navbar />
            
            <div className="flex-grow flex flex-col items-center justify-center p-8 pt-24">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-calligraphy text-ink-black mb-2">皮影戏 - 互动体验</h1>
                    <p className="text-charcoal/60 font-serif">请开启摄像头，使用双手手势控制皮影人物</p>
                </div>

                <div className="relative p-4 bg-white shadow-xl rounded-lg border-2 border-ink-black/10">
                    <div 
                        id="puppet-stage" 
                        ref={containerRef} 
                        style={{ 
                            width: '800px', 
                            height: '600px', 
                            background: '#1a1a1a',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}
                    />
                    
                    {/* 装饰性元素 */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-vermilion -translate-x-1 -translate-y-1 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-vermilion translate-x-1 -translate-y-1 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-vermilion -translate-x-1 translate-y-1 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-vermilion translate-x-1 translate-y-1 rounded-br-lg"></div>
                </div>

                <div className="mt-6 text-sm text-charcoal/50 max-w-2xl text-center font-serif">
                    <p>提示：确保环境光线充足，将双手置于摄像头视野内。</p>
                </div>
            </div>
        </div>
    );
};

export default ShadowPuppetIntegration;
