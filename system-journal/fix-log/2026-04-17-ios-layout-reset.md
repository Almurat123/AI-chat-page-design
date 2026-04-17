# Fix Log: iOS Layout Reset & Keyboard Adaptation

## Date: 2026-04-17
## Author: Antigravity

### Problem
In iOS mobile browsers (Safari), clicking "Cancel" or dismissing the software keyboard would sometimes leave the entire webpage shifted upwards. This was caused by:
1. `position: fixed` on the `body` tag, which prevented the browser from naturally scrolling the view back to the top when the keyboard was dismissed.
2. Relying solely on `visualViewport` events which might not fire or might be inconsistent during the dismissal animation.
3. Using `100vh` which is unstable on mobile browsers with dynamic toolbars.

### Solution
1. **Unlocking Body**: Removed `position: fixed` from `html, body` in `index.css`. Switched to a more standard `height: 100%; overflow: hidden;` on the root container.
2. **Dynamic Units**: Replaced `h-screen` (100vh) with `h-[100dvh]` (Dynamic Viewport Height) in `App.tsx`.
3. **Robust Reset**: Added an `onBlur` listener to the chat input in `ChatInterface.tsx` that forces `viewportOffset` to `0` and calls `window.scrollTo(0, 0)` after a short delay.
4. **Visual Viewport Refinement**: The `handleResize` function now gracefully toggles between `100dvh` and pixel-based height depending on whether the viewport is actually offset.

### Verification
- [x] Removed `position: fixed` from body.
- [x] Implemented `onBlur` reset logic.
- [x] Switched to `dvh` units.

### See Also
- [index.css](file:///Users/almurat/Downloads/gpt-10-theme-demo/src/index.css)
- [App.tsx](file:///Users/almurat/Downloads/gpt-10-theme-demo/src/App.tsx)
- [ChatInterface.tsx](file:///Users/almurat/Downloads/gpt-10-theme-demo/src/components/ChatInterface.tsx)
