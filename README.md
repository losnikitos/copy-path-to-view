# Copy path to view

Chrome extension. Right-click a page that has `<!-- BEGIN path -->` / `<!-- END path -->` comments and copy the nearest view path, plus a short description of the element under the cursor.

The clipboard text looks like this:

```
url: https://example.com/orders
view: app/views/monitors/orders/_index_tabs.html.erb
parent_views: app/views/layouts/application.html.erb
elem_path: main > p
elem_attributes:
elem_content: Right-click here.
```

## Install

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Choose **Load unpacked** and select this folder.

Open `demo.html` and right-click the paragraphs to try it.

## Test

```
node test-find-view.js
```

## License

MIT
