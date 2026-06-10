# Interactive Task Manager (TaskCraft) - Week 2 Submission

## Project Description
A feature-rich, high-performance task management application built with pure **semantic HTML5**, **modern modular CSS3 variables**, and **ES6+ Vanilla JavaScript**. It contains no bulky external libraries, prioritizing raw load speeds, accessible typography, fluid interactivity, and device responsiveness. 

It implements task CRUD operations, flexible multi-layer filtering (status and categories), custom user-sorting, persistent localized state, native keyboard hotkeys, analytics gauges, and native drag-and-drop task reordering.

---

## 🎯 Project Overview & Objectives
The primary objective of this project is to model a professional-grade productivity container utilizing raw browser APIs. Key aims include:
1. **Visual Sophistication**: Eliminating generic cookie-cutter grids by using fluid responsive bento layouts, high-contrast dark/light options, responsive spacing, and micro-interactions.
2. **Technical Mastery of Browser Runtime**: Proving state manipulation directly via native DOM nodes, preventing rendering flicker, and using efficient event delegation.
3. **Data Security**: Integrating local, self-contained persistence without leaky intermediate databases.

---

## 📂 Code Structure Explanation
The submission is structured cleanly following standard client-side project templates:

```text
week2-task-manager/
│
├── index.html          # Declarative layout structure & semantic page elements
│
├── css/
│   └── style.css       # Layout variables, animations, dark-overrides, & responsive grids
│
└── js/
    └── app.js          # Core script with data state, event controllers, & DOM renderers
```

### 1. `index.html`
Contains structurally separate, isolated modules:
- **Logo and Branding Rail**: Standard and semantic accessibility containers.
- **Analytics Dashboard Card**: Real-time progress bars, completion ratios, and visual priority charts.
- **Form Controls Panel**: Validation inputs for creating tasks, with drop-down modifiers for priority, category tags, and due date selections.
- **Toolbar and Sorting Segment**: Modular layout selectors for status queries, search indexing, and order preferences.
- **Interactive UL Area**: Mount container for dynamically produced list nodes managed by Javascript.

### 2. `css/style.css`
Defines layout visual patterns:
- **Modular Variables (`:root` / `body.dark-theme`)**: Centralizes theme values, transitions, and shadows into CSS Custom Properties for immediate fluid theme-switching.
- **Bento Columns**: Controls desktop side-by-side bento card setups and scales to single-column blocks on mobile.
- **Cues & Interactions**: Provides custom rounding, elevation hover shadows, focus rings, custom checkmarks, and drag transparency indicators.

### 3. `js/app.js`
Underpins the application logic:
- **State Controller**: Standardized `tasksState` arrays containing individual records: `{ id, title, completed, priority, category, dueDate, order }`.
- **Render Engine**: Completely resets and builds tasks from scratch using pristine `document.createElement` nodes to protect against XSS injection.
- **Dnd Mechanics**: Integrates native HTML5 dragging listeners (`dragstart`, `dragover`, `drop`) to smoothly modify array index values.

---

## ⚙️ Setup and Installation Instructions
The application runs locally out-of-the-box in any standard browser environment without compilation steps:

### Method A: Quick Local Launch
1. Download or clone this project repository folder (`week2-task-manager/`) locally.
2. Navigate inside the folder and double-click the `index.html` file to open it in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Method B: Live Python Server (Recommended for local relative scripts)
If deploying or serving with typical HTTP-ready assets, initiate a local server:
```bash
# Navigate to project director
cd week2-task-manager

# Start an instant server
python3 -m http.server 8000
```
Open your browser of choice and go to: `http://localhost:8000`

---

## ⚡ Technical Requirements Checklist

| Technical Requirement | Implementation Path in Codebase |
| :--- | :--- |
| **DOM Manipulation with JS** | Accomplished in `js/app.js` inside `render()`. Utilizes standard APIs (`document.createElement()`, `appendChild()`, class list manipulation) to draw list nodes dynamically and avoid vulnerable `innerHTML` templates. |
| **Event Handling** | Integrated in `setupEventListeners()` and individual elements: handles `submit` for creation, `change` for checkboxes, `input` for search tracking, and custom double-click triggers. |
| **Array Methods** | • **`.filter()`** is utilized to weed out completed/active elements and category divisions during search queries.<br>• **`.reduce()`** counts active/completed items and counts priorities inside `updateAnalytics()`.<br>• **`.sort()`** sets standard list orders.<br>• **`.findIndex()`** and **`.forEach()`** handle array updates. |
| **Data Persistence** | Initialized inside `loadTasks()` and saved via `saveTasks()`. Uses standard `localStorage.setItem()` and `JSON.stringify()` serialization to secure state. |
| **Double-Click Editing** | Added on the title span via `addEventListener('dblclick')`. Swaps the textual span for a dynamic input, automatically selecting text and listening for `Enter` (commit) or `Escape` (cancel). |
| **Drag & Drop Reordering** | Implemented in `setupDragAndDropEvents()` with native HTML5 drag handlers. Exchanges index sequence locations inside the real source arrays and updates custom orders. |
| **Dark/Light Mode** | Managed through CSS custom color parameters in `css/style.css` matching specific `.dark-theme` classes toggled on `document.body` via the theme toggle button. |
| **Analytics Controls** | Calculations performed dynamically in `updateAnalytics()`, which adjusts completion percentages, ratio numbers, and heights of priority layout bars. |

---

## 📷 Screenshots & Visual Overviews
Operating visuals display:
- **Home View (Light theme)**: Pristine minimalist white bento-grid showing list indicators, charts, active tasks, category pills, and advanced forms.
- **Obsidian Theme (Dark mode)**: High-contrast midnight-blue visual container designed for screen safety and eye relief.
- **Drag Reordering**: Hover indicators and dashed outline boxes showing real-time slot swaps.
- **Search Queries**: Instantly shrinking task elements matches query letters live.
