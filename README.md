# Interactive Task Manager & Developer Hub

Welcome! This workspace contains a **dual-mode client-side application** designed to fulfill both high-performance interactive design parameters and strict technical academic guidelines.

---

## 🚀 App Architecture Layout

This workspace contains two parts:
1. **The Live Preview Application (Production React)** inside `/src/` and `/index.html`:
   - Built on React 19 + TypeScript + Vite.
   - Designed with an immersive, high-fidelity responsive bento interface.
   - Includes real-time analytics dashboards, category tracking, dynamic tasks filters, drag-and-drop mechanics, and custom themes.
   - Includes a **Developer Export Panel** directly in the running preview where you can view, interact with, and copy the raw Vanilla JS code and configurations!

2. **The Pure Vanilla JS Directory** inside `/week2-task-manager/`:
   - Set up exactly as requested by your assignment structure specs.
   - `index.html`: Clean semantic markup.
   - `css/style.css`: Modern styling variables, bento blocks, dynamic responsive layouts, and dark mode classes.
   - `js/app.js`: Interactive actions (DOM element nodes, event handling, array functions, custom inline double-click editing, local storage persistence, and native HTML5 drag-and-drop).
   - `README.md`: The requested academic documentation (Project overview, set up, structure walkthrough, and feature breakdowns).

---

## 📁 Repository View

```text
.
├── week2-task-manager/       # Vanilla JS Submission Project
│   ├── index.html            # Core HTML Markup
│   ├── css/
│   │   └── style.css         # Core Stylesheet
│   ├── js/
│   │   └── app.js            # Core App Scripts
│   └── README.md             # Core Academic Documentation
│
├── src/                      # High-Fidelity React Live Code (Runs the interactive developer panel)
│   ├── App.tsx               # Primary React Layout
│   ├── index.css             # Tailwind 4 global styles
│   └── main.tsx              # React bootstrap entrypoint
│
├── package.json              # App manifests & build script keys
└── vite.config.ts            # Vite compiler rules
```

---

## 🛠️ How To Use

1. **Live Preview**: Inspect the live running app in the preview panel on the right.
2. **Review Code**: Select the **Developer Export Panel** inside the running app's header to toggle and view the exact files prepared for your submission.
3. **Copy/Export Code**: You can copy the code directly from the text boxes, or download the full ZIP from the Settings menu in AI Studio.
