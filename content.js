(function () {
  if (globalThis.__copyPathToViewReady) return;
  globalThis.__copyPathToViewReady = true;

  document.addEventListener('contextmenu', (event) => {
    const described = globalThis.CopyPathToView.describeTarget(nodeFromEvent(event));
    globalThis.__copyPathToView = described ? `\`\`\`\nurl: ${location.href}\n${described}\n\`\`\`` : null;
  }, true);

  function nodeFromEvent(event) {
    const pos = document.caretPositionFromPoint?.(event.clientX, event.clientY);
    if (pos?.offsetNode) return pos.offsetNode;
    const range = document.caretRangeFromPoint?.(event.clientX, event.clientY);
    if (range?.startContainer) return range.startContainer;
    const path = event.composedPath?.();
    return path?.[0] || event.target;
  }
})();
