chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'copy-path-to-view' || tab?.id == null) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [info.frameId ?? 0] },
      func: copyPathToView,
    });
  } catch (err) {
    console.error('Copy path to view:', err);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: 'copy-path-to-view',
    title: 'Copy path to view',
    contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
  });
});

async function copyPathToView() {
  function showToast(message) {
    const root = document.documentElement;
    if (!root) return;
    document.querySelector('copy-path-to-view')?.remove();

    const host = document.createElement('copy-path-to-view');
    host.style.cssText = 'position:fixed;z-index:2147483647;left:16px;bottom:16px;pointer-events:none';
    const shadow = host.attachShadow({ mode: 'closed' });
    const el = document.createElement('div');
    el.textContent = message.replace(/^```\n/, '').replace(/\n```$/, '');
    el.style.cssText = 'max-width:70vw;padding:8px 12px;background:#fff;color:#000;font:13px/1.4 ui-monospace,monospace;border:1px solid #ddd;border-radius:6px;white-space:pre-wrap;overflow-wrap:anywhere';
    shadow.append(el);
    root.append(host);
    setTimeout(() => host.remove(), 2500);
  }

  async function writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.documentElement.append(area);
      area.focus();
      area.select();

      const onCopy = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.clipboardData.setData('text/plain', text);
      };
      document.addEventListener('copy', onCopy, true);
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } finally {
        document.removeEventListener('copy', onCopy, true);
        area.remove();
      }
      return ok;
    }
  }

  if (!Object.hasOwn(globalThis, '__copyPathToView')) {
    showToast('Refresh this page, then use Copy path to view again.');
    return;
  }

  const path = globalThis.__copyPathToView;
  if (!path) {
    showToast('No view path here');
    return;
  }

  const ok = await writeClipboard(path);
  showToast(ok ? path : 'Could not copy');
}
