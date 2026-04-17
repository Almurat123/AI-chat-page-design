# UX 修复: 移动端侧边栏删除按钮可见性

## 背景
在移动端（触屏设备）上，侧边栏中的会话记录删除按钮原先仅在 Hover 时显示。由于移动端缺乏悬停状态，用户难以发现或触发删除操作。

## 变更说明
- **文件**: [Sidebar.tsx](file:///Users/almurat/Downloads/gpt-10-theme-demo/src/components/Sidebar.tsx)
- **修改内容**: 修改了删除按钮的 Tailwind 类名，将其从 `opacity-0 group-hover:opacity-100` 改为 `opacity-100 lg:opacity-0 lg:group-hover:opacity-100`。
- **效果**: 
  - 在移动端（< 1024px）常驻显示。
  - 在桌面端（>= 1024px）保持原来的 Hover 逻辑。

## 验证
- **代码层面验证**: 使用了 Tailwind 的响应式前缀 `lg:`，符合既有的设计模式。
- **运行时观察**: 待用户在移动模拟器或实机上验证。

---
**Document Provenance**:
- Source: User Request
- Kind: Product Requirement
- Retrieved: 2026-04-17
- Applied To: Sidebar session item interaction
- Verification: verified in code
