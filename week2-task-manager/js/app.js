/**
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
  // Set default due date to today in the input field
  elements.dueDateInput.value = getOffsetDateString(0);
}

// Map priorities to numerical scale for sorting
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
    deleteTask(id); // Empty title deletes the task
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
  // Filter array method used to produce a list of non-deleted items
  tasksState = tasksState.filter(t => t.id !== id);
  
  // Repair order indexes
  tasksState.forEach((task, idx) => {
    task.order = idx;
  });
  
  saveTasks();
  render();
}

// --- Rendering Logic & DOM Manipulation ---
function render() {
  // 1. Process tasks using array filtering
  let filteredTasks = tasksState.filter(task => {
    // Search Filter
    const matchesSearch = task.title.toLowerCase().includes(viewState.searchQuery.toLowerCase());
    
    // Status Filter
    let matchesStatus = true;
    if (viewState.status === 'active') matchesStatus = !task.completed;
    if (viewState.status === 'completed') matchesStatus = task.completed;
    
    // Category Filter
    let matchesCategory = true;
    if (viewState.category !== 'all') matchesCategory = task.category === viewState.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 2. Sort processed tasks
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
    
    // Default 'custom' drag-reordered array order
    return a.order - b.order;
  });

  // 3. Clear container
  elements.tasksContainer.innerHTML = '';

  // 4. Handle empty state
  if (filteredTasks.length === 0) {
    elements.emptyState.style.display = 'block';
  } else {
    elements.emptyState.style.display = 'none';
    
    // 5. Build DOM dynamically to demonstrate absolute vanilla JS mechanics
    filteredTasks.forEach((task, index) => {
      const taskLI = document.createElement('li');
      taskLI.className = `task-item ${task.priority}-priority ${task.completed ? 'completed-task' : ''}`;
      taskLI.id = task.id;
      
      // Make list items draggable only under "custom" sorting view
      if (viewState.sortBy === 'custom') {
        taskLI.setAttribute('draggable', 'true');
        setupDragAndDropEvents(taskLI, task.id);
      }
      
      // Drag handle visual indicator
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-ellipsis-vertical"></i>';
      if (viewState.sortBy !== 'custom') {
        dragHandle.style.visibility = 'hidden';
      }
      taskLI.appendChild(dragHandle);

      // Checkbox container & elements
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

      // Task text info block
      const infoBlock = document.createElement('div');
      infoBlock.className = 'task-info-block';

      // Title element
      const titleSpan = document.createElement('span');
      titleSpan.className = 'task-title';
      titleSpan.textContent = task.title;
      titleSpan.title = 'Double click to edit task text';
      
      // Add Double Click Event for editing text
      titleSpan.addEventListener('dblclick', () => {
        enterEditMode(titleSpan, infoBlock, task.id);
      });
      
      infoBlock.appendChild(titleSpan);

      // Metadata Row
      const metadataRow = document.createElement('div');
      metadataRow.className = 'task-metadata-row';

      // Category badge
      const catBadge = document.createElement('span');
      catBadge.className = `badge badge-${task.category.toLowerCase()}`;
      catBadge.textContent = task.category;
      metadataRow.appendChild(catBadge);

      // Due date element
      if (task.dueDate) {
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-due';
        
        // Format date string beautifully (e.g. "Jun 12")
        const formattedDate = formatDueDate(task.dueDate);
        dateSpan.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${formattedDate}`;
        
        // Check overdue items
        if (!task.completed) {
          const todayStr = getOffsetDateString(0);
          if (task.dueDate < todayStr) {
            dateSpan.classList.add('overdue');
            dateSpan.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Overdue (${formattedDate})`;
          }
        }
        
        metadataRow.appendChild(dateSpan);
      }

      infoBlock.appendChild(metadataRow);
      taskLI.appendChild(infoBlock);

      // Actions Column
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';

      // Edit visual button
      const editBtn = document.createElement('button');
      editBtn.className = 'delete-btn';
      editBtn.title = 'Click task text to edit';
      editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      editBtn.addEventListener('click', () => {
        enterEditMode(titleSpan, infoBlock, task.id);
      });
      actionsDiv.appendChild(editBtn);

      // Delete visual button
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

  // 6. Update task analytics and progress indicators
  updateAnalytics();
}

// --- Inline Editing Functionality ---
function enterEditMode(titleSpan, infoBlock, id) {
  // Prevent duplicate edits
  if (infoBlock.querySelector('.task-edit-input')) return;
  
  const currentText = titleSpan.textContent;
  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.className = 'task-edit-input';
  inputEl.value = currentText;
  
  // Replace span with input temporarily
  infoBlock.replaceChild(inputEl, titleSpan);
  inputEl.focus();
  inputEl.select();

  // Commit editing changes
  const commitChange = () => {
    const newValue = inputEl.value;
    editTaskTitle(id, newValue);
  };

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      commitChange();
    } else if (e.key === 'Escape') {
      // Restore normal rendering and cancel
      render();
    }
  });

  inputEl.addEventListener('blur', () => {
    commitChange();
  });
}

// --- Date Formatter ---
function formatDueDate(dateString) {
  if (!dateString) return '';
  const dateObj = new Date(dateString + 'T00:00:00');
  // Returns localized preview e.g. "Jun 10, 2026"
  return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Analytics Calculations & SVG Update ---
function updateAnalytics() {
  const total = tasksState.length;
  // Reduce array method utilized to count completed elements
  const completed = tasksState.reduce((acc, task) => acc + (task.completed ? 1 : 0), 0);
  const active = total - completed;

  // Render Stats
  elements.statTotal.textContent = total;
  elements.statActive.textContent = active;
  elements.statCompleted.textContent = completed;

  // Calculate Progress Percent
  const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;
  elements.progressFill.style.width = `${percentCompleted}%`;
  elements.progressPercent.textContent = `${percentCompleted}% Completed`;
  elements.progressRatio.textContent = `${completed}/${total} Tasks`;

  // Calculate Priority chart breakdowns using reduce
  const priorityDistribution = tasksState.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  elements.countHigh.textContent = priorityDistribution.high;
  elements.countMedium.textContent = priorityDistribution.medium;
  elements.countLow.textContent = priorityDistribution.low;

  // Set visual bar widths proportional to max count inside prioritised lists
  const maxCategoryCount = Math.max(priorityDistribution.high, priorityDistribution.medium, priorityDistribution.low) || 1;
  
  elements.barHigh.style.width = `${(priorityDistribution.high / maxCategoryCount) * 100}%`;
  elements.barMedium.style.width = `${(priorityDistribution.medium / maxCategoryCount) * 100}%`;
  elements.barLow.style.width = `${(priorityDistribution.low / maxCategoryCount) * 100}%`;
}

// --- Drag & Drop Reordering (HTML5 API Specification) ---
function setupDragAndDropEvents(liElement, id) {
  liElement.addEventListener('dragstart', (e) => {
    draggingIndex = tasksState.findIndex(t => t.id === id);
    liElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  });

  liElement.addEventListener('dragend', () => {
    liElement.classList.remove('dragging');
    // Clear drop guides from all rows
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
      // Reorder element in array source
      const draggedTask = tasksState[draggingIndex];
      tasksState.splice(draggingIndex, 1); // delete from original location
      tasksState.splice(overIndex, 0, draggedTask); // insert in new target destination
      
      // Rebuild indexing sequence
      tasksState.forEach((task, idx) => {
        task.order = idx;
      });
      
      saveTasks();
      render();
    }
  });
}

// --- Setup Event Listeners (Universal interaction delegation) ---
function setupEventListeners() {
  // Theme Toggle Button
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Task Submit Creation
  elements.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = elements.titleInput.value;
    const priorityVal = elements.prioritySelect.value;
    const categoryVal = elements.categorySelect.value;
    const dueVal = elements.dueDateInput.value;

    if (titleVal.trim()) {
      createTask(titleVal, priorityVal, categoryVal, dueVal);
      
      // Reset input form
      elements.titleInput.value = '';
      setDefaultDueDate();
      elements.titleInput.focus();
    }
  });

  // Task Live Search
  elements.searchInput.addEventListener('input', (e) => {
    viewState.searchQuery = e.target.value;
    render();
  });

  // Status Filtering Button Clicking
  elements.statusFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    
    // Toggle active classes
    elements.statusFilters.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    viewState.status = btn.dataset.filter;
    render();
  });

  // Category Filtering Pills Clicking
  elements.categoryFiltersContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;

    elements.categoryFiltersContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    viewState.category = pill.dataset.category;
    render();
  });

  // Sorting Selected Box Selection
  elements.sortSelect.addEventListener('change', (e) => {
    viewState.sortBy = e.target.value;
    render();
  });

  // Keyboard shortcut Ctrl + / to focus input
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      elements.titleInput.focus();
    }
  });
}
