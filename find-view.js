(function () {
const COMMENT_NODE = 8;
const ELEMENT_NODE = 1;
const BEGIN_PATH = /^\s*BEGIN\s+(\S+)/;
const END_PATH = /^\s*END\s+\S+/;

function previousNode(node) {
  if (node.previousSibling) {
    let prev = node.previousSibling;
    while (prev.lastChild) prev = prev.lastChild;
    return prev;
  }
  return node.parentNode || node.host || null;
}

function viewPaths(start) {
  const paths = [];
  let node = start;
  let skip = 0;
  const seen = new Set();

  while (node && !seen.has(node) && paths.length < 3) {
    seen.add(node);
    if (node.nodeType === COMMENT_NODE && typeof node.nodeValue === 'string') {
      if (END_PATH.test(node.nodeValue)) {
        skip += 1;
      } else {
        const begin = BEGIN_PATH.exec(node.nodeValue);
        if (begin) {
          if (skip === 0) paths.push(begin[1]);
          else skip -= 1;
        }
      }
    }
    node = previousNode(node);
  }

  return paths;
}

function parentEl(el) {
  if (el.parentElement) return el.parentElement;
  const root = el.getRootNode?.();
  return root?.host || null;
}

function isRoot(el) {
  return el.tagName === 'HTML' || el === el.ownerDocument?.documentElement;
}

function escapeId(id) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(id);
  return id;
}

function segment(el) {
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${escapeId(el.id)}`;
  const parent = el.parentElement || el.parentNode;
  const children = parent?.children;
  if (children) {
    let count = 0;
    let index = -1;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName !== el.tagName) continue;
      if (children[i] === el) index = count;
      count += 1;
    }
    if (count > 1 && index >= 0) return `${tag}[${index}]`;
  }
  return tag;
}

function targetEl(start) {
  const el = start?.nodeType === ELEMENT_NODE ? start : start?.parentElement;
  if (!el || isRoot(el)) return null;
  return el;
}

function elementPath(el) {
  const parts = [];
  for (let i = 0; el && i < 4 && !isRoot(el); i++) {
    parts.unshift(segment(el));
    if (el.id) break;
    el = parentEl(el);
  }
  return parts.join(' > ');
}

// ponytail: content capped at 80 chars; raise the cap if agents need more of the subtree text
function visibleText(el) {
  const raw = el.innerText ?? el.textContent ?? '';
  return String(raw).replace(/\s+/g, ' ').trim().slice(0, 80);
}

function elemAttributes(el) {
  const names = el.getAttributeNames?.() || [];
  const parts = [];
  for (const name of names) {
    const value = el.getAttribute(name);
    if (value == null) continue;
    parts.push(value === '' ? name : `${name}="${String(value).replaceAll('"', '\\"')}"`);
  }
  return parts.join(' ');
}

function describeTarget(node) {
  const el = targetEl(node);
  const views = viewPaths(node);
  const path = el ? elementPath(el) : '';
  const attrs = el ? elemAttributes(el) : '';
  const content = el ? visibleText(el) : '';
  if (!views.length && !path && !attrs && !content) return '';
  return [
    `view: ${views[0] || ''}`,
    `parent_views: ${views.slice(1).reverse().join(', ')}`,
    `elem_path: ${path}`,
    `elem_attributes: ${attrs}`,
    `elem_content: ${content}`,
  ].join('\n');
}

globalThis.CopyPathToView = { describeTarget };
})();
