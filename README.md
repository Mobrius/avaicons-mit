# Avaicons MIT 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://www.avaicons.com/)

**Avaicons** is a lightweight JavaScript avatar generator.  
Generate SVG avatars from a simple `seed` in one line of code.

This repo is the **MIT-licensed** version of Avaicons (client-side library only).  
If you want **premium styles, CDN, PNG/WebP formats, and a ready-to-use Cloud API**, check out 👉 **https://www.avaicons.com/**

---

## 🚀 Quick Start

Clone and run a local server (opening the HTML file directly won’t work due to browser CORS):

```bash
git clone https://github.com/Mobrius/avaicons-mit.git
cd avaicons-mit
````

For consistent look with `initials`, load Inter 700 in your page:

```html
<!-- Add this in your HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
```

Fonts are not embedded in the MIT build; external tools may render a different font unless you load one in the page.

### Option A — Python (no setup)

```bash
# Windows
py -m http.server 5173
# macOS/Linux
python3 -m http.server 5173
```

Open: [http://localhost:5173/](http://localhost:5173/)

### Option B — Node (no install)

```bash
npx serve -l 5173 .
# or
npx http-server -p 5173 .
```

Open: [http://localhost:5173/](http://localhost:5173/)

### Option C — Vite (dev server with HMR)

```bash
npm init -y
npm i -D vite
# package.json → "scripts": { "dev": "vite" }
npm run dev
```

Open the printed local URL (default: [http://localhost:5173/](http://localhost:5173/)).

---

## 🧩 Use in Node.js / Frontend

```js
import { generateAvatarSVG } from './src/avatarGen.js'

// Identicon example
const svg = generateAvatarSVG('john', { variant: 'identicon', size: 128 })
console.log(svg) // → <svg ...>...</svg>
```

---

## 🎨 Available Styles (MIT)

✅ `initials`
✅ `identicon`
✅ `pixel`

> Looking for `face`, `emoji`, or `punk`? See the Cloud API below.

---

## ☁️ Cloud API (avaicons.com)

**What you get**

* 7 styles: `shapes`, `identicon`, `initials`, `face`, `emoji`, `pixel`, `punk`
* **Formats:** SVG, PNG, WebP
* **Edge CDN** delivery & long-lived caching
* **Rate limits & monthly quota** per plan
* Email support: **[support@avaicons.com](mailto:support@avaicons.com)**
* Playground & docs: [https://www.avaicons.com/](https://www.avaicons.com/) · [https://www.avaicons.com/docs](https://www.avaicons.com/docs)

**Plans & Limits**

* **Starter — €4.99/mo** → **50 req/min**, **25k req/month**
* **Developer — €9.99/mo** → **100 req/min**, **100k req/month**
* **Pro — €19.99/mo** → **300 req/min**, **200k req/month**

> Quota resets on the **1st of each month (UTC)**. Each successful avatar response counts as one request.

**Security note**
Do **not** expose your API key in public client code. Call the API from your backend or use a server-side proxy.

---

## 📊 MIT vs Cloud API

| Feature                            | MIT (Free) | Cloud API (Starter/Dev/Pro) |
| ---------------------------------- | ---------- | --------------------------- |
| `initials` / `identicon` / `pixel` | ✅          | ✅                           |
| `face` / `emoji` / `punk`          | ❌          | ✅                           |
| SVG output                         | ✅          | ✅                           |
| PNG / WebP output                  | ❌          | ✅                           |
| CDN + caching                      | ❌          | ✅                           |
| Rate limits & quota                | ❌          | ✅                           |
| Uptime & support                   | ❌          | ✅                           |

---

## 📂 Project Structure

```
avaicons-mit/
├─ index.html        # demo (serve via HTTP, don’t open as file://)
├─ src/
│  └─ avatarGen.js   # core generator
├─ package.json
├─ .gitignore
└─ README.md
```

* `src/avatarGen.js` → core generator
* `index.html` → simple demo (requires local server; see Quick Start)

---

## 📜 License

MIT License – free to use, modify, and distribute.
For commercial reliability and premium features, upgrade at **[https://www.avaicons.com/](https://www.avaicons.com/)**
