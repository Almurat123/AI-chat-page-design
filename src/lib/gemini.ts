// import { GoogleGenAI, ThinkingLevel } from "@google/genai"; // Commented out for mock demo

// CONTEXT MEMORY
// Updated: 2026-04-17
// Author: Antigravity
// Reason: Mocking Gemini response for a no-key demo.
// Goal: Simulate streaming typing effect.

export async function* streamChatResponse(
  prompt: string, 
  history: any[],
  modelInfo: any
) {
  const fullText = `探索下一代交互设计的无限可能。这套原型系统采用了深度演化的 **Liquid Glass** 设计语言，致力于打破数字界面与现实世界的感知边界。

针对您刚才提出的创意点：“${prompt}”，我们的后台逻辑正在进行多维度的推演与重构。在全功能运行环境下，每一个交互节点都将根据语境实时生成。

目前您所感受到的视觉质感，来源于对物理光影规律的模拟。通过高频模糊与动态折射算法，系统确保了在任何层级下都拥有极致的通透感。

请继续自由探索侧边栏的各项组件，感受设计与技术优雅融合带来的极致丝滑体验。`;

  // 恢复逐字输出
  const chars = fullText.split('');
  for (const char of chars) {
    yield char;
    // 极短的随机延迟，模拟真实流式感
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 5));
  }
}
