# Chrome Web Store Listing — Copy path to view

> Last Updated: 2026-10-30

## Store Listing

**Extension Name**
Copy path to view

**Short Description**
Right-click a page and copy the nearest view path from its HTML comments.

**Detailed Description**
Copy path to view copies the nearest view path from HTML comments around the element you right-click.

FEATURES
• Finds the closest <!-- BEGIN path --> comment above the element under the cursor
• Includes parent view paths, a short element path, attributes, and a snippet of visible text
• Copies the result to the clipboard and shows it in a small toast

HOW TO USE
1. Open a page whose HTML contains BEGIN and END view comments.
2. Right-click the element you care about.
3. Choose Copy path to view.
4. Paste. The clipboard text includes the page URL, the view path, parent views, and a short description of the element.

The extension does nothing until you choose that menu item. It does not change the page except to show a toast confirming the copy.

PRIVACY
The path and element description stay on your device. They are written to the clipboard and are not stored or sent to a server. There is no account and no analytics.

PERMISSIONS
Read and change data on sites you visit: the extension has to be on the page before the right-click so it can see which element was under the cursor. It reads HTML comments and a short description of that element only.
Clipboard: writes the copied path.

SUPPORT
https://github.com/losnikitos/copy-path-to-view/issues

Version 1.0.0

**Category**
Developer Tools

**Single Purpose**
Copies the nearest HTML-comment view path for the element under the cursor.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | icons/icon-128.png |
| Screenshot 1 | 1280×800 | ✅ Ready | store-assets/screenshot-1280x800.png |
| Small Promo Tile | 440×280 | ⬜ Not created | |

### Screenshot Notes
Show demo.html in Chrome with the context menu open on "Copy path to view", or the toast after a successful copy. The page must be one that contains BEGIN/END comments, otherwise the shot does not show the feature.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| contextMenus | permissions | Adds the "Copy path to view" item so the user can ask for the path of the element they right-clicked. |
| scripting | permissions | Runs the copy function in the frame that was right-clicked. The path has to come from that frame, including iframes. |
| activeTab | permissions | Allows that copy to run on the current tab only after the user chooses the menu item. |
| clipboardWrite | permissions | Writes the view path to the clipboard. If the page blocks the async clipboard API, the same user gesture falls back to a copy command. |
| content_scripts matches `<all_urls>` | host access | The script must already be on the page when the menu opens, because Chrome does not pass the clicked element to the menu handler. It records the element under the cursor on right-click. It copies only if the user then chooses the menu item. The extension is a developer tool used on whatever app is open, so the host cannot be limited to one site. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** It handles website content on the device. It does not store it and does not transmit it.

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | | No |
| Health info | No | No | | No |
| Financial info | No | No | | No |
| Authentication info | No | No | | No |
| Personal communications | No | No | | No |
| Location | No | No | | No |
| Web history | No | No | The current page URL is included in the clipboard text. Browsing history is not read. | No |
| User activity | No | No | | No |
| Website content | Yes, on the device only | No | On right-click, read nearby BEGIN/END comments, the element path, attributes, and up to 80 characters of visible text, then copy that to the clipboard if the user chooses the menu item. | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
Not live yet. Draft is `PRIVACY.md`. After it is pushed, use:
https://github.com/losnikitos/copy-path-to-view/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

## Developer Info

**Publisher Name**
Nikita Popov

**Contact Email**
Confirm before submit. GitHub profile email is losnikitos@gmail.com. The dashboard email cannot be changed later.

**Support URL**
https://github.com/losnikitos/copy-path-to-view/issues

**Homepage URL**
https://github.com/losnikitos/copy-path-to-view

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-30 | First release. Right-click copies the nearest BEGIN view path. | Draft |

## Review Notes

### Test instructions
Open a page that contains `<!-- BEGIN some/view.html.erb -->` comments. `demo.html` in the repository is a fixture: right-click the first paragraph and the copied view is `app/views/monitors/orders/_index_tabs.html.erb`. Right-click the last paragraph and the toast says there is no view path. Reviewers need that file served as a real HTML page. A GitHub blob URL will not run it.

### Known Issues / Limitations
The content script matches every http(s) page because the clicked element is only available at right-click time. That broad host access is the main review risk. The justification above is the one to paste into the dashboard.
