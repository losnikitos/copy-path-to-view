const assert = require('node:assert');

require('./find-view.js');
const { describeTarget } = globalThis.CopyPathToView;

function link(parent, children) {
  children.forEach((child, index) => {
    child.parentNode = parent;
    child.previousSibling = children[index - 1] || null;
    child.nextSibling = children[index + 1] || null;
  });
  parent.lastChild = children[children.length - 1] || null;
  return parent;
}

function el(...children) {
  return link({ nodeType: 1 }, children);
}

function comment(value) {
  return { nodeType: 8, nodeValue: value, lastChild: null };
}

function text(value) {
  return { nodeType: 3, nodeValue: value, lastChild: null };
}

function els(tag, props, kids = []) {
  const node = {
    nodeType: 1,
    tagName: tag.toUpperCase(),
    id: props?.id || '',
    textContent: props?.text || '',
    parentElement: null,
    parentNode: null,
    children: kids,
    getAttribute(name) { return props?.attrs?.[name] ?? null; },
    getAttributeNames() { return Object.keys(props?.attrs || {}); },
  };
  for (const kid of kids) {
    kid.parentElement = node;
    kid.parentNode = node;
  }
  return node;
}

function locator({ view = '', parents = '', path = '', attrs = '', content = '' } = {}) {
  return [
    `view: ${view}`,
    `parent_views: ${parents}`,
    `elem_path: ${path}`,
    `elem_attributes: ${attrs}`,
    `elem_content: ${content}`,
  ].join('\n');
}

const tabs = 'app/views/monitors/orders/_index_tabs.html.erb';
const layout = 'app/views/layouts/application.html.erb';
const tabText = text('tabs');
const layoutText = text('layout');

el(
  comment(` BEGIN ${layout}\n`),
  el(
    comment(` BEGIN ${tabs}\n`),
    tabText,
    comment(` END ${tabs}`),
    layoutText,
  ),
  comment(` END ${layout}`),
);

assert.equal(describeTarget(tabText), locator({ view: tabs, parents: layout }));
assert.equal(describeTarget(layoutText), locator({ view: layout }));
assert.equal(describeTarget(null), '');
assert.equal(describeTarget(text('loose')), '');

const after = text('after');
el(
  comment(` BEGIN ${tabs}\n`),
  text('inside'),
  comment(` END ${tabs}`),
  after,
);
assert.equal(describeTarget(after), '');

const deep = text('deep');
const afterInner = text('after inner');
el(el(comment(` BEGIN ${tabs}\n`), deep), afterInner);
assert.equal(describeTarget(deep), locator({ view: tabs }));
assert.equal(describeTarget(afterInner), locator({ view: tabs }));

const b = text('b');
el(
  comment(' BEGIN a.html.erb'),
  text('a'),
  comment(' END a.html.erb'),
  comment(' BEGIN b.html.erb'),
  b,
);
assert.equal(describeTarget(b), locator({ view: 'b.html.erb' }));

const nope = text('nope');
el(comment(' rendered BEGIN app/views/nope.html.erb'), nope);
assert.equal(describeTarget(nope), '');

const ended = text('ended');
el(comment(' END app/views/foo.html.erb'), ended);
assert.equal(describeTarget(ended), '');

const four = text('four');
let nested = four;
for (const name of ['d.html.erb', 'c.html.erb', 'b.html.erb', 'a.html.erb']) {
  nested = el(comment(` BEGIN ${name}`), nested);
}
assert.equal(describeTarget(four), locator({
  view: 'd.html.erb',
  parents: 'b.html.erb, c.html.erb',
}));

const firstP = els('p', { text: 'a' });
const secondP = els('p', { text: '  hello   world  ' });
const firstSection = els('section');
const secondSection = els('section', {}, [firstP, secondP]);
els('div', {}, [firstSection, secondSection]);
assert.equal(describeTarget(secondP), locator({
  path: 'div > section[1] > p[1]',
  content: 'hello world',
}));

const save = els('button', {
  text: 'x'.repeat(90),
  id: 'go',
  attrs: { class: 'inline-flex rounded-full', type: 'button' },
});
const box = els('div', { id: 'box' }, [save]);
const outer = els('section', {}, [box]);
els('main', {}, [outer]);
assert.equal(describeTarget(save), locator({
  path: 'button#go',
  attrs: 'class="inline-flex rounded-full" type="button"',
  content: 'x'.repeat(80),
}));

const inner = els('span', { text: 'in' });
inner.parentElement = null;
inner.getRootNode = () => ({ host: els('div', { id: 'host' }) });
assert.equal(describeTarget(inner), locator({
  path: 'div#host > span',
  content: 'in',
}));

console.log('ok');
