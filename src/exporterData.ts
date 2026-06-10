export const EXPORTER_FILES = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Task Manager</title>
  <!-- Google Fonts: Inter for elegant typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Styles stylesheet -->
  <link rel="stylesheet" href="css/style.css">
  <!-- FontAwesome for standard icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="app-container" id="app">
    <!-- Header Section -->
    <header class="app-header">
      <div class="header-logo">
        <i class="fa-solid fa-list-check logo-icon"></i>
        <h1>TaskCraft</h1>
      </div>
      <div class="header-actions">
        <!-- Theme Toggle -->
        <button id="theme-toggle" class="icon-btn" title="Toggle Dark Mode" aria-label="Toggle dark mode">
          <i class="fa-solid fa-moon"></i>
        </button>
      </div>
    </header>

    <!-- Main Content Grid -->
    <main class="app-main">
      <!-- Sidebar / Insights Section -->
      <section class="insights-panel" id="insights">
        <div class="card stats-card">
          <h2>Task Analytics</h2>
          <div class="progress-container">
            <div class="progress-bar-bg">
              <div id="completion-progress" class="progress-bar-fill" style="width: 0%"></div>
            </div>
            <div class="progress-labels">
              <span id="progress-percent">0% Completed</span>
              <span id="progress-ratio">0/0 Tasks</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value text-primary" id="total-stats-count">0</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
              <span class="stat-value text-warn" id="active-stats-count">0</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat-item">
              <span class="stat-value text-success" id="completed-stats-count">0</span>
              <span class="stat-label">Done</span>
            </div>
          </div>
          
          <div class="priority-breakdown">
            <h3>Priority Distribution</h3>
            <div class="priority-chart">
              <div class="chart-bar-container">
                <div class="chart-bar-label">High</div>
                <div class="chart-bar-wrapper">
                  <div id="bar-high" class="chart-bar-fill high-fill" style="width: 0%"></div>
                </div>
                <span id="count-high">0</span>
              </div>
              <div class="chart-bar-container">
                <div class="chart-bar-label">Med</div>
                <div class="chart-bar-wrapper">
                  <div id="bar-medium" class="chart-bar-fill medium-fill" style="width: 0%"></div>
                </div>
                <span id="count-medium">0</span>
              </div>
              <div class="chart-bar-container">
                <div class="chart-bar-label">Low</div>
                <div class="chart-bar-wrapper">
                  <div id="bar-low" class="chart-bar-fill low-fill" style="width: 0%"></div>
                </div>
                <span id="count-low">0</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card tags-card">
          <h2>Categories</h2>
          <div class="category-filters" id="category-filter-container">
            <button class="category-pill active" data-category="all">
              <span class="category-color all-color"></span> All
            </button>
            <button class="category-pill" data-category="Work">
              <span class="category-color work-color"></span> Work
            </button>
            <button class="category-pill" data-category="Personal">
              <span class="category-color personal-color"></span> Personal
            </button>
            <button class="category-pill" data-category="Shopping">
              <span class="category-color shopping-color"></span> Shopping
            </button>
            <button class="category-pill" data-category="Health">
              <span class="category-color health-color"></span> Health
            </button>
          </div>
        </div>

        <!-- Mini Help / Instruction Card -->
        <div class="card help-card">
          <h3>Quick Tips</h3>
          <ul>
            <li>Double-click any task title to edit.</li>
            <li>Drag &amp; drop tasks to change priority.</li>
            <li>Press <kbd>Ctrl</kbd> + <kbd>/</kbd> to focus input.</li>
          </ul>
        </div>
      </section>

      <!-- Task Manager Panel -->
      <section class="tasks-panel">
        <!-- New Task Form -->
        <form class="card task-form" id="task-creation-form">
          <div class="form-row">
            <input 
              type="text" 
              id="task-title-input" 
              placeholder="What needs to be done?" 
              required 
              autocomplete="off"
            >
            <button type="submit" class="primary-btn" id="add-task-btn">
              <i class="fa-solid fa-plus"></i> Add Task
            </button>
          </div>
          
          <div class="form-advanced-controls">
            <div class="control-group">
              <label for="task-priority-select">Priority</label>
              <select id="task-priority-select">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div class="control-group">
              <label for="task-category-select">Category</label>
              <select id="task-category-select">
                <option value="Work">Work</option>
                <option value="Personal" selected>Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div class="control-group">
              <label for="task-due-date">Due Date</label>
              <input type="date" id="task-due-date">
            </div>
          </div>
        </form>

        <!-- Tasks Feed Filtering and Search -->
        <div class="feed-controls card">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="search-tasks-input" placeholder="Search tasks...">
          </div>
          
          <div class="filter-tabs" id="status-filter-tabs">
            <button class="tab-btn active" data-filter="all">All</button>
            <button class="tab-btn" data-filter="active">Active</button>
            <button class="tab-btn" data-filter="completed">Completed</button>
          </div>

          <div class="sorting-controls">
            <select id="sort-tasks-select">
              <option value="custom" selected>My Order (Drag)</option>
              <option value="due-asc">Due Date (Soonest)</option>
              <option value="priority-desc">Priority (High-Low)</option>
              <option value="title-asc">Alphabetical</option>
            </select>
          </div>
        </div>

        <!-- Task List Container -->
        <div class="task-list-wrapper">
          <ul class="task-list" id="tasks-list-container">
            <!-- Dynamically populated via Vanilla JavaScript -->
          </ul>
          
          <!-- Empty State -->
          <div class="empty-state" id="empty-state-view">
            <div class="empty-icon-wrapper">
              <i class="fa-solid fa-clipboard-list"></i>
            </div>
            <h3>No tasks found</h3>
            <p>Ready to start? Create a task or adjust your active filters!</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer Description -->
    <footer class="app-footer">
      <p>&copy; 2026 TaskCraft Task Manager. Built with semantic HTML5, modern CSS3, and modern Vanilla JavaScript.</p>
    </footer>
  </div>

  <!-- Main scripts -->
  <script src="js/app.js"></script>
</body>
</html>`,
  css: `/* ==========================================
   TaskCraft Style Specification
   Theme variables, responsive layout, animations
   ========================================== */

:root {
  /* Core Theme Colors (Light Theme Defaults) */
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --bg-input: #f1f5f9;
  --border-color: #e2e8f0;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --accent-primary: #3b82f6;
  --accent-primary-hover: #2563eb;
  
  --color-success: #10b981;
  --color-success-bg: #ecfdf5;
  --color-warn: #f59e0b;
  --color-warn-bg: #fffbeb;
  --color-danger: #ef4444;
  --color-danger-bg: #fef2f2;
  
  /* Constant values */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Theme Overrides */
body.dark-theme {
  --bg-app: #090d16;
  --bg-card: #111827;
  --bg-input: #1f2937;
  --border-color: #374151;
  
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  --accent-primary: #3b82f6;
  --accent-primary-hover: #60a5fa;
  
  --color-success: #10b981;
  --color-success-bg: #064e3b;
  --color-warn: #f59e0b;
  --color-warn-bg: #78350f;
  --color-danger: #ef4444;
  --color-danger-bg: #7f1d1d;
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-primary);
  line-height: 1.5;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

input, select, button, textarea {
  font-family: inherit;
  color: inherit;
}

/* App Containers */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

/* Header Styling */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.8rem;
  color: var(--accent-primary);
}

.header-logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.icon-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  width: 42px;
  height: 42px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background: var(--bg-input);
  border-color: var(--text-muted);
}

/* Card Styling */
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all var(--transition-normal);
}

/* Main Content Grid Layout - Bento/Sidebar combo */
.app-main {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  flex: 1;
}

@media (max-width: 968px) {
  .app-main {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Elements */
.insights-panel {
  display: flex;
  flex-direction: column;
}

.insights-panel h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

/* Progress Indicator styling */
.progress-container {
  margin-bottom: 1.5rem;
}

.progress-bar-bg {
  height: 8px;
  background-color: var(--bg-input);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-success);
  border-radius: 4px;
  width: 0%;
  transition: width var(--transition-normal);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Quick Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.stat-item {
  background-color: var(--bg-input);
  padding: 0.75rem 0.5rem;
  border-radius: var(--border-radius-sm);
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.text-primary { color: var(--accent-primary); }
.text-warn { color: var(--color-warn); }
.text-success { color: var(--color-success); }

/* SVG Dynamic/Simple chart bars for distribution */
.priority-breakdown h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.priority-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart-bar-container {
  display: grid;
  grid-template-columns: 45px 1fr 20px;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.chart-bar-label {
  color: var(--text-secondary);
}

.chart-bar-wrapper {
  height: 6px;
  background-color: var(--bg-input);
  border-radius: 3px;
  overflow: hidden;
}

.chart-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition-normal);
}

.high-fill { background-color: var(--color-danger); }
.medium-fill { background-color: var(--color-warn); }
.low-fill { background-color: var(--accent-primary); }

/* Category Tags styling */
.category-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-pill {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-pill:hover {
  background: var(--bg-input);
  color: var(--text-primary);
}

.category-pill.active {
  background: var(--bg-input);
  border-color: var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
}

.category-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.all-color { background-color: var(--text-muted); }
.work-color { background-color: #8b5cf6; }
.personal-color { background-color: #3b82f6; }
.shopping-color { background-color: #f59e0b; }
.health-color { background-color: #10b981; }

/* Instructions Card */
.help-card h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.help-card ul {
  padding-left: 1.1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.help-card li {
  margin-bottom: 0.4rem;
}

kbd {
  background-color: var(--bg-input);
  border: 1px solid var(--text-muted);
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  color: var(--text-primary);
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}

/* ==========================================
   Tasks Panel Content
   ========================================== */

.task-form h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-row input[type="text"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  font-size: 0.95rem;
  transition: all var(--transition-fast);
}

.form-row input[type="text"]:focus {
  outline: none;
  border-color: var(--accent-primary);
  background-color: var(--bg-card);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.primary-btn {
  background-color: var(--accent-primary);
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-fast);
}

.primary-btn:hover {
  background-color: var(--accent-primary-hover);
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
}

.form-advanced-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-advanced-controls {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .form-row {
    flex-direction: column;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control-group label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.control-group select,
.control-group input[type="date"] {
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  font-size: 0.85rem;
}

.control-group select:focus,
.control-group input[type="date"]:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-card);
}

/* Feed Controls, search & filtering */
.feed-controls {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
}

@media (max-width: 768px) {
  .feed-controls {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  font-size: 0.85rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--accent-primary);
  background-color: var(--bg-card);
}

.filter-tabs {
  display: flex;
  background-color: var(--bg-input);
  padding: 0.25rem;
  border-radius: var(--border-radius-md);
  gap: 0.15rem;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.35rem 0.85rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn.active {
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.sorting-controls select {
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  font-size: 0.8rem;
  cursor: pointer;
}

/* ==========================================
   Task Feed / List Layouts
   ========================================== */

.task-list-wrapper {
  position: relative;
  min-height: 200px;
}

.task-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Beautiful task items */
.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast), opacity 0.2s ease;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.task-item:hover {
  border-color: var(--text-muted);
  box-shadow: var(--shadow-md);
}

/* Custom left edge status color */
.task-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.task-item.high-priority::before { background-color: var(--color-danger); }
.task-item.medium-priority::before { background-color: var(--color-warn); }
.task-item.low-priority::before { background-color: var(--accent-primary); }

/* Drag interaction state styles */
.task-item[draggable="true"] {
  cursor: grab;
}

.task-item.dragging {
  opacity: 0.4;
  cursor: grabbing;
  border: 1px dashed var(--accent-primary);
  transform: scale(0.98);
}

.task-item.drag-over {
  border-top: 2px solid var(--accent-primary);
}

/* Checkbox styling */
.checkbox-container {
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: var(--bg-input);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--text-muted);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-success);
  border-color: var(--color-success);
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark::after {
  display: block;
}

.checkbox-container .checkmark::after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Info container block */
.task-info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

/* Inline edit element swap */
.task-edit-input {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--accent-primary);
  background-color: var(--bg-input);
  font-size: 0.95rem;
  font-weight: 500;
}

.task-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: color var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: text;
}

.task-item.completed-task .task-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-metadata-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  text-transform: uppercase;
}

.badge-work { background-color: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.badge-personal { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.badge-shopping { background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.badge-health { background-color: rgba(16, 185, 129, 0.15); color: #10b981; }

.task-due {
  font-size: 0.7rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.task-due.overdue {
  color: var(--color-danger);
  font-weight: 600;
}

/* Actions panel per task */
.task-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn {
  background: transparent;
  color: var(--text-muted);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

/* Empty State component */
.empty-state {
  display: none;
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
  margin-top: 1rem;
}

.empty-icon-wrapper {
  font-size: 2.5rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.empty-state p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  max-width: 300px;
  margin: 0 auto;
}

/* Drag indicator handle */
.drag-handle {
  color: var(--text-muted);
  cursor: grab;
  padding: 0.25rem;
  font-size: 0.85rem;
}

.drag-handle:hover {
  color: var(--text-secondary);
}

/* Keyboard shortcut drawer styles */
.app-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-muted);
}`,
  js: `/**
 * TaskCraft: Vanilla JavaScript Interactive Task Manager
 * Fulfills Week 2 Task Manager Requirements:
 * - DOM manipulation
 * - Event handling
 * - Array methods (filter, map, reduce, find, findIndex)
 * - localStorage persistence
 * - Double-click editing
 * - Native Drag-and-drop
 * - Interactive analytics & Dark mode
 */

// --- Application State ---
let tasksState = [];
let draggingIndex = null;

// --- DOM Cache ---
const elements = {
  app: document.getElementById('app'),
  themeToggle: document.getElementById('theme-toggle'),
  taskForm: document.getElementById('task-creation-form'),
  titleInput: document.getElementById('task-title-input'),
  prioritySelect: document.getElementById('task-priority-select'),
  categorySelect: document.getElementById('task-category-select'),
  dueDateInput: document.getElementById('task-due-date'),
  searchInput: document.getElementById('search-tasks-input'),
  statusFilters: document.getElementById('status-filter-tabs'),
  categoryFiltersContainer: document.getElementById('category-filter-container'),
  sortSelect: document.getElementById('sort-tasks-select'),
  tasksContainer: document.getElementById('tasks-list-container'),
  emptyState: document.getElementById('empty-state-view'),
  
  // Stats DOM
  progressFill: document.getElementById('completion-progress'),
  progressPercent: document.getElementById('progress-percent'),
  progressRatio: document.getElementById('progress-ratio'),
  statTotal: document.getElementById('total-stats-count'),
  statActive: document.getElementById('active-stats-count'),
  statCompleted: document.getElementById('completed-stats-count'),
  
  // Priority chart bars
  barHigh: document.getElementById('bar-high'),
  countHigh: document.getElementById('count-high'),
  barMedium: document.getElementById('bar-medium'),
  countMedium: document.getElementById('count-medium'),
  barLow: document.getElementById('bar-low'),
  countLow: document.getElementById('count-low'),
};

// --- Filters & Sorting State ---
const viewState = {
  status: 'all',     // 'all' | 'active' | 'completed'
  category: 'all',   // 'all' | 'Work' | 'Personal' | 'Shopping' | 'Health'
  searchQuery: '',
  sortBy: 'custom',  // 'custom' | 'due-asc' | 'priority-desc' | 'title-asc'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadTasks();
  setupEventListeners();
  setDefaultDueDate();
  render();
});

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem('taskcraft-theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-sun text-warn"></i>';
  } else {
    document.body.classList.remove('dark-theme');
    elements.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('taskcraft-theme', isDark ? 'dark' : 'light');
  elements.themeToggle.innerHTML = isDark 
    ? '<i class="fa-solid fa-sun text-warn"></i>' 
    : '<i class="fa-solid fa-moon"></i>';
}

// --- Data Loading & Storage ---
function loadTasks() {
  const rawTasks = localStorage.getItem('taskcraft-tasks');
  if (rawTasks) {
    try {
      tasksState = JSON.parse(rawTasks);
    } catch (e) {
      console.error("Error parsing tasks from local storage", e);
      tasksState = [];
    }
  } else {
    // Seed with high-quality initial tasks for gorgeous default visuals
    tasksState = [
      {
        id: 'seed-1',
        title: 'Draft weekly marketing metrics review',
        completed: false,
        priority: 'high',
        category: 'Work',
        dueDate: getOffsetDateString(0), // Today
        order: 0
      },
      {
        id: 'seed-2',
        title: 'Plan monthly groceries list & meal prep',
        completed: false,
        priority: 'medium',
        category: 'Shopping',
        dueDate: getOffsetDateString(1), // Tomorrow
        order: 1
      },
      {
        id: 'seed-3',
        title: 'Book dental clean-up session',
        completed: true,
        priority: 'low',
        category: 'Health',
        dueDate: getOffsetDateString(3),
        order: 2
      },
      {
        id: 'seed-4',
        title: 'Complete vanilla JS task manager documentation',
        completed: false,
        priority: 'high',
        category: 'Personal',
        dueDate: getOffsetDateString(0),
        order: 3
      }
    ];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem('taskcraft-tasks', JSON.stringify(tasksState));
}

// --- Helper Utilities ---
function getOffsetDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

function setDefaultDueDate() {
  elements.dueDateInput.value = getOffsetDateString(0);
}

const priorityWeight = { high: 3, medium: 2, low: 1 };

// --- CRUD Operations ---
function createTask(title, priority, category, dueDate) {
  const newTask = {
    id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    title: title.trim(),
    completed: false,
    priority: priority,
    category: category,
    dueDate: dueDate || null,
    order: tasksState.length
  };
  
  tasksState.push(newTask);
  saveTasks();
  render();
}

function toggleTaskComplete(id) {
  const taskIndex = tasksState.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    tasksState[taskIndex].completed = !tasksState[taskIndex].completed;
    saveTasks();
    render();
  }
}

function editTaskTitle(id, newTitle) {
  const trimmed = newTitle.trim();
  if (!trimmed) {
    deleteTask(id);
    return;
  }
  
  const taskIndex = tasksState.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    tasksState[taskIndex].title = trimmed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasksState = tasksState.filter(t => t.id !== id);
  tasksState.forEach((task, idx) => {
    task.order = idx;
  });
  saveTasks();
  render();
}

// --- Rendering Logic & DOM Manipulation ---
function render() {
  let filteredTasks = tasksState.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(viewState.searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (viewState.status === 'active') matchesStatus = !task.completed;
    if (viewState.status === 'completed') matchesStatus = task.completed;
    
    let matchesCategory = true;
    if (viewState.category !== 'all') matchesCategory = task.category === viewState.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  filteredTasks.sort((a, b) => {
    if (viewState.sortBy === 'due-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    
    if (viewState.sortBy === 'priority-desc') {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    
    if (viewState.sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    
    return a.order - b.order;
  });

  elements.tasksContainer.innerHTML = '';

  if (filteredTasks.length === 0) {
    elements.emptyState.style.display = 'block';
  } else {
    elements.emptyState.style.display = 'none';
    
    filteredTasks.forEach((task, index) => {
      const taskLI = document.createElement('li');
      taskLI.className = \`task-item \${task.priority}-priority \${task.completed ? 'completed-task' : ''}\`;
      taskLI.id = task.id;
      
      if (viewState.sortBy === 'custom') {
        taskLI.setAttribute('draggable', 'true');
        setupDragAndDropEvents(taskLI, task.id);
      }
      
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-ellipsis-vertical"></i>';
      if (viewState.sortBy !== 'custom') {
        dragHandle.style.visibility = 'hidden';
      }
      taskLI.appendChild(dragHandle);

      const checkLabel = document.createElement('label');
      checkLabel.className = 'checkbox-container';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
      
      const checkmark = document.createElement('span');
      checkmark.className = 'checkmark';
      
      checkLabel.appendChild(checkbox);
      checkLabel.appendChild(checkmark);
      taskLI.appendChild(checkLabel);

      const infoBlock = document.createElement('div');
      infoBlock.className = 'task-info-block';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'task-title';
      titleSpan.textContent = task.title;
      titleSpan.title = 'Double click to edit task text';
      
      titleSpan.addEventListener('dblclick', () => {
        enterEditMode(titleSpan, infoBlock, task.id);
      });
      
      infoBlock.appendChild(titleSpan);

      const metadataRow = document.createElement('div');
      metadataRow.className = 'task-metadata-row';

      const catBadge = document.createElement('span');
      catBadge.className = \`badge badge-\${task.category.toLowerCase()}\`;
      catBadge.textContent = task.category;
      metadataRow.appendChild(catBadge);

      if (task.dueDate) {
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-due';
        const formattedDate = formatDueDate(task.dueDate);
        dateSpan.innerHTML = \`<i class="fa-regular fa-calendar-days"></i> \${formattedDate}\`;
        
        if (!task.completed) {
          const todayStr = getOffsetDateString(0);
          if (task.dueDate < todayStr) {
            dateSpan.classList.add('overdue');
            dateSpan.innerHTML = \`<i class="fa-solid fa-triangle-exclamation"></i> Overdue (\${formattedDate})\`;
          }
        }
        
        metadataRow.appendChild(dateSpan);
      }

      infoBlock.appendChild(metadataRow);
      taskLI.appendChild(infoBlock);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'delete-btn';
      editBtn.title = 'Click task text to edit';
      editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      editBtn.addEventListener('click', () => {
        enterEditMode(titleSpan, infoBlock, task.id);
      });
      actionsDiv.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.title = 'Delete Task';
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
      });
      actionsDiv.appendChild(deleteBtn);

      taskLI.appendChild(actionsDiv);
      elements.tasksContainer.appendChild(taskLI);
    });
  }

  updateAnalytics();
}

function enterEditMode(titleSpan, infoBlock, id) {
  if (infoBlock.querySelector('.task-edit-input')) return;
  
  const currentText = titleSpan.textContent;
  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.className = 'task-edit-input';
  inputEl.value = currentText;
  
  infoBlock.replaceChild(inputEl, titleSpan);
  inputEl.focus();
  inputEl.select();

  const commitChange = () => {
    const newValue = inputEl.value;
    editTaskTitle(id, newValue);
  };

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      commitChange();
    } else if (e.key === 'Escape') {
      render();
    }
  });

  inputEl.addEventListener('blur', () => {
    commitChange();
  });
}

function formatDueDate(dateString) {
  if (!dateString) return '';
  const dateObj = new Date(dateString + 'T00:00:00');
  return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function updateAnalytics() {
  const total = tasksState.length;
  const completed = tasksState.reduce((acc, task) => acc + (task.completed ? 1 : 0), 0);
  const active = total - completed;

  elements.statTotal.textContent = total;
  elements.statActive.textContent = active;
  elements.statCompleted.textContent = completed;

  const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;
  elements.progressFill.style.width = \`\${percentCompleted}%\`;
  elements.progressPercent.textContent = \`\${percentCompleted}% Completed\`;
  elements.progressRatio.textContent = \`\${completed}/\${total} Tasks\`;

  const priorityDistribution = tasksState.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  elements.countHigh.textContent = priorityDistribution.high;
  elements.countMedium.textContent = priorityDistribution.medium;
  elements.countLow.textContent = priorityDistribution.low;

  const maxCategoryCount = Math.max(priorityDistribution.high, priorityDistribution.medium, priorityDistribution.low) || 1;
  
  elements.barHigh.style.width = \`\${(priorityDistribution.high / maxCategoryCount) * 100}%\`;
  elements.barMedium.style.width = \`\${(priorityDistribution.medium / maxCategoryCount) * 100}%\`;
  elements.barLow.style.width = \`\${(priorityDistribution.low / maxCategoryCount) * 100}%\`;
}

function setupDragAndDropEvents(liElement, id) {
  liElement.addEventListener('dragstart', (e) => {
    draggingIndex = tasksState.findIndex(t => t.id === id);
    liElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  });

  liElement.addEventListener('dragend', () => {
    liElement.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(item => {
      item.classList.remove('drag-over');
    });
    draggingIndex = null;
  });

  liElement.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggingIndex === null) return;
    
    const overItem = e.currentTarget;
    const overId = overItem.id;
    const overIndex = tasksState.findIndex(t => t.id === overId);
    
    if (overIndex !== draggingIndex) {
      overItem.classList.add('drag-over');
    }
  });

  liElement.addEventListener('dragleave', (e) => {
    e.currentTarget.classList.remove('drag-over');
  });

  liElement.addEventListener('drop', (e) => {
    e.preventDefault();
    const overId = e.currentTarget.id;
    const overIndex = tasksState.findIndex(t => t.id === overId);
    
    if (draggingIndex !== null && overIndex !== -1 && draggingIndex !== overIndex) {
      const draggedTask = tasksState[draggingIndex];
      tasksState.splice(draggingIndex, 1);
      tasksState.splice(overIndex, 0, draggedTask);
      
      tasksState.forEach((task, idx) => {
        task.order = idx;
      });
      
      saveTasks();
      render();
    }
  });
}

function setupEventListeners() {
  elements.themeToggle.addEventListener('click', toggleTheme);

  elements.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = elements.titleInput.value;
    const priorityVal = elements.prioritySelect.value;
    const categoryVal = elements.categorySelect.value;
    const dueVal = elements.dueDateInput.value;

    if (titleVal.trim()) {
      createTask(titleVal, priorityVal, categoryVal, dueVal);
      elements.titleInput.value = '';
      setDefaultDueDate();
      elements.titleInput.focus();
    }
  });

  elements.searchInput.addEventListener('input', (e) => {
    viewState.searchQuery = e.target.value;
    render();
  });

  elements.statusFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    
    elements.statusFilters.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    viewState.status = btn.dataset.filter;
    render();
  });

  elements.categoryFiltersContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;

    elements.categoryFiltersContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    viewState.category = pill.dataset.category;
    render();
  });

  elements.sortSelect.addEventListener('change', (e) => {
    viewState.sortBy = e.target.value;
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      elements.titleInput.focus();
    }
  });
}`,
  readme: `# Interactive Task Manager (TaskCraft) - Week 2 Submission

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

\`\`\`text
week2-task-manager/
│
├── index.html          # Declarative layout structure & semantic page elements
│
├── css/
│   └── style.css       # Layout variables, animations, dark-overrides, & responsive grids
│
└── js/
    └── app.js          # Core script with data state, event controllers, & DOM renderers
\`\`\`

### 1. \`index.html\`
Contains structurally separate, isolated modules:
- **Logo and Branding Rail**: Standard and semantic accessibility containers.
- **Analytics Dashboard Card**: Real-time progress bars, completion ratios, and visual priority charts.
- **Form Controls Panel**: Validation inputs for creating tasks, with drop-down modifiers for priority, category tags, and due date selections.
- **Toolbar and Sorting Segment**: Modular layout selectors for status queries, search indexing, and order preferences.
- **Interactive UL Area**: Mount container for dynamically produced list nodes managed by Javascript.

### 2. \`css/style.css\`
Defines layout visual patterns:
- **Modular Variables (\`:root\` / \`body.dark-theme\`)**: Centralizes theme values, transitions, and shadows into CSS Custom Properties for immediate fluid theme-switching.
- **Bento Columns**: Controls desktop side-by-side bento card setups and scales to single-column blocks on mobile.
- **Cues & Interactions**: Provides custom rounding, elevation hover shadows, focus rings, custom checkmarks, and drag transparency indicators.

### 3. \`js/app.js\`
Underpins the application logic:
- **State Controller**: Standardized \`tasksState\` arrays containing individual records: \`{ id, title, completed, priority, category, dueDate, order }\`.
- **Render Engine**: Completely resets and builds tasks from scratch using pristine \`document.createElement\` nodes to protect against XSS injection.
- **Dnd Mechanics**: Integrates native HTML5 dragging listeners (\`dragstart\`, \`dragover\`, \`drop\`) to smoothly modify array index values.

---

## ⚙️ Setup and Installation Instructions
The application runs locally out-of-the-box in any standard browser environment without compilation steps:

### Method A: Quick Local Launch
1. Download or clone this project repository folder (\`week2-task-manager/\`) locally.
2. Navigate inside the folder and double-click the \`index.html\` file to open it in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Method B: Live Python Server (Recommended for local relative scripts)
If deploying or serving with typical HTTP-ready assets, initiate a local server:
\`\`\`bash
# Navigate to project director
cd week2-task-manager

# Start an instant server
python3 -m http.server 8000
\`\`\`
Open your browser of choice and go to: \`http://localhost:8000\`

---

## ⚡ Technical Requirements Checklist

| Technical Requirement | Implementation Path in Codebase |
| :--- | :--- |
| **DOM Manipulation with JS** | Accomplished in \`js/app.js\` inside \`render()\`. Utilizes standard APIs (\`document.createElement()\`, \`appendChild()\`, class list manipulation) to draw list nodes dynamically and avoid vulnerable \`innerHTML\` templates. |
| **Event Handling** | Integrated in \`setupEventListeners()\` and individual elements: handles \`submit\` for creation, \`change\` for checkboxes, \`input\` for search tracking, and custom double-click triggers. |
| **Array Methods** | • **\`.filter()\`** is utilized to weed out completed/active elements and category divisions during search queries.<br>• **\`.reduce()\`** counts active/completed items and counts priorities inside \`updateAnalytics()\`.<br>• **\`.sort()\`** sets standard list orders.<br>• **\`.findIndex()\`** and **\`.forEach()\`** handle array updates. |
| **Data Persistence** | Initialized inside \`loadTasks()\` and saved via \`saveTasks()\`. Uses standard \`localStorage.setItem()\` and \`JSON.stringify()\` serialization to secure state. |
| **Double-Click Editing** | Added on the title span via \`addEventListener('dblclick')\`. Swaps the textual span for a dynamic input, automatically selecting text and listening for \`Enter\` (commit) or \`Escape\` (cancel). |
| **Drag & Drop Reordering** | Implemented in \`setupDragAndDropEvents()\` with native HTML5 drag handlers. Exchanges index sequence locations inside the real source arrays and updates custom orders. |
| **Dark/Light Mode** | Managed through CSS custom color parameters in \`css/style.css\` matching specific \`.dark-theme\` classes toggled on \`document.body\` via theme switch. |
| **Analytics Controls** | Calculations performed dynamically in \`updateAnalytics()\`, which adjusts completion percentages, ratio numbers, and heights of priority layout bars. |
`
};
