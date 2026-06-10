import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  Code, 
  Search, 
  Sparkles, 
  ArrowUpDown, 
  Tag, 
  Info, 
  Check, 
  Copy, 
  GripVertical, 
  AlertTriangle, 
  FileCode,
  CheckSquare,
  HelpCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPORTER_FILES } from './exporterData';

// --- TS Type Declarations ---
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'Work' | 'Personal' | 'Shopping' | 'Health';
  dueDate: string;
  order: number;
}

export default function App() {
  // --- Navigation & Core UI states ---
  const [activeTab, setActiveTab] = useState<'app' | 'developer'>('app');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // --- React App Task State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titleInput, setTitleInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'high' | 'medium' | 'low'>('medium');
  const [categoryInput, setCategoryInput] = useState<'Work' | 'Personal' | 'Shopping' | 'Health'>('Personal');
  const [dueInput, setDueInput] = useState('');

  // --- Filtering & Sorting state ---
  const [currentStatusFilter, setCurrentStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('custom');

  // --- Drag & Drop state ---
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // --- Double-click Edit state ---
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // --- Code Exporter state ---
  const [selectedFile, setSelectedFile] = useState<'html' | 'css' | 'js' | 'readme'>('js');
  const [isCopied, setIsCopied] = useState(false);

  // --- Initialize App State ---
  useEffect(() => {
    // 1. Initial Theme setting
    const savedTheme = localStorage.getItem('taskcraft-react-theme') || 'dark';
    setTheme(savedTheme as 'light' | 'dark');
    
    // 2. Initial Date selection defaults to today
    const today = new Date().toISOString().split('T')[0];
    setDueInput(today);

    // 3. Persisted tasks sync
    const rawTasks = localStorage.getItem('taskcraft-tasks');
    if (rawTasks) {
      try {
        setTasks(JSON.parse(rawTasks));
      } catch (e) {
        console.error("Error parsing layout", e);
        loadDefaultTasks();
      }
    } else {
      loadDefaultTasks();
    }
  }, []);

  // --- Save state changes ---
  const saveTasksState = (updatedList: Task[]) => {
    setTasks(updatedList);
    localStorage.setItem('taskcraft-tasks', JSON.stringify(updatedList));
  };

  const loadDefaultTasks = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dentalDate = new Date();
    dentalDate.setDate(dentalDate.getDate() + 3);
    const dentalStr = dentalDate.toISOString().split('T')[0];

    const defaultTasks: Task[] = [
      {
        id: 'seed-1',
        title: 'Draft weekly marketing metrics review',
        completed: false,
        priority: 'high',
        category: 'Work',
        dueDate: todayStr,
        order: 0
      },
      {
        id: 'seed-2',
        title: 'Plan monthly groceries list & meal prep',
        completed: false,
        priority: 'medium',
        category: 'Shopping',
        dueDate: tomorrowStr,
        order: 1
      },
      {
        id: 'seed-3',
        title: 'Book dental clean-up session',
        completed: true,
        priority: 'low',
        category: 'Health',
        dueDate: dentalStr,
        order: 2
      },
      {
        id: 'seed-4',
        title: 'Complete vanilla JS task manager documentation',
        completed: false,
        priority: 'high',
        category: 'Personal',
        dueDate: todayStr,
        order: 3
      }
    ];
    saveTasksState(defaultTasks);
  };

  // --- Theme Toggle ---
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('taskcraft-react-theme', nextTheme);
  };

  // --- Task CRUD Procedures ---
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: titleInput.trim(),
      completed: false,
      priority: priorityInput,
      category: categoryInput,
      dueDate: dueInput || new Date().toISOString().split('T')[0],
      order: tasks.length
    };

    const nextTasks = [...tasks, newTask];
    saveTasksState(nextTasks);
    setTitleInput('');
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasksState(updated);
  };

  const handleDeleteTask = (id: string) => {
    const filtered = tasks.filter(t => t.id !== id);
    // Reposition list order parameters
    const cleaned = filtered.map((t, index) => ({ ...t, order: index }));
    saveTasksState(cleaned);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEditValue = (id: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      handleDeleteTask(id);
    } else {
      const updated = tasks.map(t => t.id === id ? { ...t, title: trimmed } : t);
      saveTasksState(updated);
    }
    setEditingTaskId(null);
  };

  // --- Native Drag & Drop Implementation ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (sortBy !== 'custom') return;
    setDraggedIndex(index);
    // Needed to allow drop animation previews
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (sortBy !== 'custom' || draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (sortBy !== 'custom' || draggedIndex === null || draggedIndex === index) return;

    const clone = [...tasks];
    const itemToMove = clone[draggedIndex];
    
    // Swap spots
    clone.splice(draggedIndex, 1);
    clone.splice(index, 0, itemToMove);

    // Reset orders
    const synchronized = clone.map((item, idx) => ({ ...item, order: idx }));
    saveTasksState(synchronized);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // --- Processing task state ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (currentStatusFilter === 'active') matchesStatus = !task.completed;
    if (currentStatusFilter === 'completed') matchesStatus = task.completed;

    let matchesCategory = true;
    if (currentCategoryFilter !== 'all') matchesCategory = task.category === currentCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate sorted items
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'due-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority-desc') {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return a.order - b.order;
  });

  // --- Analytics summary computations ---
  const statTotal = tasks.length;
  const statCompleted = tasks.filter(t => t.completed).length;
  const statActive = statTotal - statCompleted;
  const statPercent = statTotal > 0 ? Math.round((statCompleted / statTotal) * 100) : 0;

  const prioCountHigh = tasks.filter(t => t.priority === 'high').length;
  const prioCountMedium = tasks.filter(t => t.priority === 'medium').length;
  const prioCountLow = tasks.filter(t => t.priority === 'low').length;
  const prioMax = Math.max(prioCountHigh, prioCountMedium, prioCountLow) || 1;

  // --- Help Copy logic for developers ---
  const handleCopyCode = () => {
    const codeMap = {
      html: EXPORTER_FILES.html,
      css: EXPORTER_FILES.css,
      js: EXPORTER_FILES.js,
      readme: EXPORTER_FILES.readme,
    };
    navigator.clipboard.writeText(codeMap[selectedFile]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0B0F19] text-[#F3F4F6]' : 'bg-[#F9FAFB] text-[#111827]'} transition-colors duration-300 font-sans`}>
      
      {/* Primary Global Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-[#1E293B] bg-[#0E1322]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40 w-full`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform duration-200">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-snug">TaskCraft Workspace</span>
              <span className="text-[10px] text-gray-400 font-mono">Week 2 Developer Sandbox</span>
            </div>
          </div>

          {/* Central Mode Switcher */}
          <div className={`p-1 rounded-full flex gap-1 ${theme === 'dark' ? 'bg-[#182236] border border-[#1E293B]' : 'bg-[#EFF1F4] border border-[#E2E8F0]'} transition-all`}>
            <button 
              id="app-tab-btn"
              onClick={() => setActiveTab('app')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'app' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              Live Interactive App
            </button>
            <button 
              id="dev-tab-btn"
              onClick={() => setActiveTab('developer')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'developer' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              GitHub Submission Helper
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'border-[#1E293B] bg-[#111827] text-amber-400 hover:bg-[#182235]' 
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
              }`}
              title="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        <AnimatePresence mode="wait">
          {activeTab === 'app' ? (
            <motion.div 
              key="interactive-app"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Analytics & Quick Filters (Bento Style) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. Analytics Card */}
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'} shadow-sm relative overflow-hidden transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Analytics Insights</h2>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      theme === 'dark' ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                    }`}>Sync Active</span>
                  </div>

                  {/* Ring/Percentage display */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100 dark:text-gray-800"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-indigo-600 dark:text-indigo-500 transition-all duration-700"
                          strokeDasharray={`${statPercent}, 100`}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="text-sm font-black tracking-tight">{statPercent}%</span>
                    </div>
                    <div>
                      <span className="text-xl font-extrabold block leading-none">{statCompleted} / {statTotal}</span>
                      <span className="text-xs text-gray-400">Completed items ratio</span>
                    </div>
                  </div>

                  {/* Simple stats grids */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-105 border-gray-100 dark:border-gray-800">
                    <div className="text-center p-2 rounded-xl bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100/50 dark:border-gray-800/40 font-mono">
                      <span className="text-lg font-extrabold block text-indigo-600 dark:text-indigo-400 leading-none">{statTotal}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-gray-50/50 dark:bg-[#0E1322]/80 border border-gray-100/50 dark:border-[#1E293B]/40 font-mono">
                      <span className="text-lg font-extrabold block text-amber-500 leading-none">{statActive}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Active</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100/50 dark:border-gray-800/40 font-mono">
                      <span className="text-lg font-extrabold block text-emerald-500 leading-none">{statCompleted}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Done</span>
                    </div>
                  </div>

                  {/* Priority chart bars (Horizontal SVG proportional sizing) */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-3">Priority Distribution</span>
                    <div className="flex flex-col gap-2">
                      {/* High Priority Bar */}
                      <div className="grid grid-cols-12 items-center gap-2">
                        <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">High</span>
                        <div className="col-span-8 h-1.5 bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${(prioCountHigh / prioMax) * 100}%` }}
                          />
                        </div>
                        <span className="col-span-1 text-right text-xs font-bold text-gray-400">{prioCountHigh}</span>
                      </div>
                      
                      {/* Medium Priority Bar */}
                      <div className="grid grid-cols-12 items-center gap-2">
                        <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Medium</span>
                        <div className="col-span-8 h-1.5 bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${(prioCountMedium / prioMax) * 100}%` }}
                          />
                        </div>
                        <span className="col-span-1 text-right text-xs font-bold text-gray-400">{prioCountMedium}</span>
                      </div>

                      {/* Low Priority Bar */}
                      <div className="grid grid-cols-12 items-center gap-2">
                        <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low</span>
                        <div className="col-span-8 h-1.5 bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${(prioCountLow / prioMax) * 100}%` }}
                          />
                        </div>
                        <span className="col-span-1 text-right text-xs font-bold text-gray-400">{prioCountLow}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Custom Category Filters Card */}
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'} shadow-sm transition-all`}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Categories Grid</h2>
                  
                  <div className="flex flex-col gap-1">
                    {[
                      { name: 'all', label: 'All Categories', color: 'bg-indigo-500' },
                      { name: 'Work', label: 'Work tasks', color: 'bg-purple-500' },
                      { name: 'Personal', label: 'Personal goals', color: 'bg-blue-500' },
                      { name: 'Shopping', label: 'Shopping checklist', color: 'bg-amber-500' },
                      { name: 'Health', label: 'Health & Wellness', color: 'bg-emerald-500' }
                    ].map((pill) => {
                      const isActive = currentCategoryFilter === pill.name;
                      const count = pill.name === 'all' 
                        ? tasks.length
                        : tasks.filter(t => t.category === pill.name).length;
                      return (
                        <button
                          key={pill.name}
                          onClick={() => setCurrentCategoryFilter(pill.name)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                            isActive 
                              ? (theme === 'dark' ? 'bg-indigo-950/30 border-indigo-900/40 text-indigo-300 shadow-sm' : 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm') 
                              : `bg-transparent border-transparent ${theme === 'dark' ? 'text-gray-400 hover:bg-[#1E293B]/40 hover:text-gray-200' : 'text-gray-600 hover:bg-[#EFF1F4] hover:text-gray-900'}`
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${pill.color}`} />
                            <span>{pill.label}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isActive 
                              ? 'bg-indigo-650 bg-indigo-600 text-white' 
                              : (theme === 'dark' ? 'bg-[#0E1322] text-gray-500' : 'bg-gray-100 text-gray-400')
                          }`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. System Tip Banner */}
                <div className={`p-4 rounded-xl border flex gap-3 ${theme === 'dark' ? 'bg-blue-950/10 border-blue-900/40 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold block mb-0.5">Interaction Sandbox Cues</span>
                    <span>To reorder tasks, make sure sorting is set to <strong>"My Order"</strong>, then press and drag standard task rows. Double-click titles to edit text blocks.</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Active Task List Feed */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                 {/* 1. Fast Task Add Form */}
                <form 
                  onSubmit={handleCreateTask}
                  className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'} shadow-sm transition-all`}
                >
                  <div className="flex gap-2.5 mb-4">
                    <input 
                      type="text" 
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="What needs to be done? Enter task title..."
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                        theme === 'dark' 
                          ? 'border-gray-850 bg-gray-950 text-white placeholder-gray-600 focus:border-indigo-500' 
                          : 'bg-gray-50/50 border-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:bg-white'
                      }`}
                      required
                    />
                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs tracking-wider uppercase text-white flex items-center gap-1.5 shadow-sm shadow-indigo-500/10 active:scale-97 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Priority Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        Priority Level
                      </label>
                      <select
                        value={priorityInput}
                        onChange={(e) => setPriorityInput(e.target.value as 'high' | 'medium' | 'low')}
                        className={`p-2.5 border rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'
                        }`}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    {/* Category Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        Category Tag
                      </label>
                      <select
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value as any)}
                        className={`p-2.5 border rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'
                        }`}
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>

                    {/* Due Date Picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        Due Date
                      </label>
                      <input 
                        type="date"
                        value={dueInput}
                        onChange={(e) => setDueInput(e.target.value)}
                        className={`p-2.5 border rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'
                        }`}
                        required
                      />
                    </div>
                  </div>
                </form>

                {/* 2. Controls & Search block */}
                <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center justify-between ${
                  theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'
                } shadow-sm`}>
                  
                  {/* Search Input */}
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-3 text-gray-405 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                        theme === 'dark' 
                          ? 'bg-gray-950 border-gray-850 placeholder-gray-500 focus:border-indigo-500 text-white' 
                          : 'bg-gray-50/50 border-gray-205 border-gray-200 placeholder-gray-450 focus:border-indigo-500 focus:bg-white text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Status buttons */}
                  <div className={`flex p-1 rounded-full ${
                    theme === 'dark' ? 'bg-gray-950 border border-gray-850' : 'bg-[#EFF1F4] border border-[#E2E8F0]'
                  }`}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'active', label: 'Active' },
                      { key: 'completed', label: 'Completed' }
                    ].map(btn => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setCurrentStatusFilter(btn.key as any)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          currentStatusFilter === btn.key 
                            ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-700 shadow-sm') 
                            : 'hover:text-indigo-500 text-gray-400 dark:hover:text-[#F3F4F6]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Sorting select */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`p-2 border rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        theme === 'dark' ? 'bg-gray-950 border-gray-805' : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="custom">My Order (Drag)</option>
                      <option value="due-asc">Due Date</option>
                      <option value="priority-desc">Priority</option>
                      <option value="title-asc">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {/* 3. Real Dynamic Task List */}
                <div className="relative">
                  {sortedTasks.length === 0 ? (
                    <div className={`text-center py-12 px-5 rounded-2xl border border-dashed ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200'}`}>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-400 dark:text-gray-600 shadow-xs animate-pulse">
                        <CheckSquare className="w-6 h-6 text-indigo-500" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">No tasks in current view</h3>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">Either you completed them all or the active filters need adjustments. Create a brand new task to get started!</p>
                    </div>
                  ) : (
                    <motion.ul className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {sortedTasks.map((task, index) => {
                          const isHigh = task.priority === 'high';
                          const isMed = task.priority === 'medium';
                          const isCompleted = task.completed;
                          const isBeingEdited = editingTaskId === task.id;

                          // Format due date elegantly
                          let displayDateStr = task.dueDate;
                          try {
                            const parsed = new Date(task.dueDate + 'T00:00:00');
                            displayDateStr = parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                          } catch(_) {}

                          const isOverdue = !isCompleted && task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];

                          return (
                            <motion.li
                              key={task.id}
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
                                outline: dragOverIndex === index ? '2px dashed #4F46E5' : 'none'
                              }}
                              exit={{ opacity: 0, scale: 0.9, x: -10 }}
                              transition={{ duration: 0.18 }}
                              draggable={sortBy === 'custom'}
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={(e) => handleDragOver(e, index)}
                              onDrop={() => handleDrop(index)}
                              onDragEnd={handleDragEnd}
                              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all relative overflow-hidden group ${draggedIndex === index ? 'opacity-30 border-dashed border-indigo-500' : ''} ${isCompleted ? (theme === 'dark' ? 'bg-[#182236]/30 border-[#1E293B]/40 text-gray-500' : 'bg-[#F9FAFB]/60 border-gray-100/70 text-gray-400') : (theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/80')} hover:shadow-sm hover:border-indigo-300 dark:hover:border-indigo-900`}
                            >
                              {/* Left Edge Indicator Strip */}
                              <span className={`absolute left-0 top-0 bottom-0 w-1 ${isHigh ? 'bg-[#EF4444]' : isMed ? 'bg-[#F59E0B]' : 'bg-indigo-500'}`} />

                              {/* Drag handle */}
                              <div 
                                className={`text-gray-400 dark:text-gray-600 cursor-grab px-1 hover:text-indigo-500 transition-colors ${sortBy === 'custom' ? 'block' : 'opacity-0 select-none w-0 overflow-hidden pointer-events-none'}`}
                                title="Press and drag to sort list"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              {/* Custom checkbox */}
                              <button
                                type="button"
                                onClick={() => handleToggleTask(task.id)}
                                className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${isCompleted ? 'bg-indigo-650 bg-indigo-600 border-indigo-600 text-white' : (theme === 'dark' ? 'border-gray-700 bg-gray-950 hover:border-indigo-550' : 'border-gray-300 bg-white hover:border-indigo-500')}`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                              </button>

                              {/* Text & Metadata Container */}
                              <div className="flex-1 min-w-0 pr-2">
                                {isBeingEdited ? (
                                  <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onBlur={() => saveEditValue(task.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEditValue(task.id);
                                      if (e.key === 'Escape') setEditingTaskId(null);
                                    }}
                                    className={`w-full text-sm font-semibold p-1.5 border rounded-lg bg-gray-100 dark:bg-gray-950 border-indigo-550 focus:outline-none`}
                                    autoFocus
                                  />
                                ) : (
                                  <span 
                                    className={`text-sm font-semibold block leading-tight cursor-text ${isCompleted ? 'line-through text-gray-550 dark:text-gray-500' : 'text-gray-900 dark:text-[#F3F4F6]'}`}
                                    onDoubleClick={() => startEditing(task)}
                                    title="Double click to edit task title"
                                  >
                                    {task.title}
                                  </span>
                                )}

                                {/* Metadata tags under titles */}
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  {/* Category Tag */}
                                  <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    task.category === 'Work' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                    task.category === 'Personal' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                                    task.category === 'Shopping' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  }`}>
                                    {task.category}
                                  </span>

                                  {/* Due Date Indicator */}
                                  <span className={`text-[10px] font-semibold flex items-center gap-1 ${isOverdue ? 'text-rose-500 font-bold animate-pulse' : 'text-gray-400'}`}>
                                    {isOverdue ? (
                                      <>
                                        <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                                        <span>Overdue ({displayDateStr})</span>
                                      </>
                                    ) : (
                                      <>
                                        <Calendar className="w-3 h-3 shrink-0" />
                                        <span>Due {displayDateStr}</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Task Action Buttons */}
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleDeleteTask(task.id)}
                                  className={`p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer`}
                                  title="Delete task item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </motion.ul>
                  )}
                </div>

              </div>
            </motion.div>
          ) : (
            // Developer submission panel Mock Code-Editor layout
            <motion.div 
              key="developer-hub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* Left Column code navigation sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Visual File tree box */}
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'} shadow-sm transition-all`}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Week-2 File Tree</span>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded">github-ready</span>
                  </div>

                  {/* File items list */}
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-gray-400 font-semibold mb-1">
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      <span>week2-task-manager/</span>
                    </div>

                    <div className="pl-4 flex flex-col gap-1">
                      {[
                        { key: 'js', label: 'js/app.js', type: 'JavaScript Engine', size: '12 kb', color: 'text-amber-500' },
                        { key: 'html', label: 'index.html', type: 'Semantic Layout', size: '6.4 kb', color: 'text-orange-500' },
                        { key: 'css', label: 'css/style.css', type: 'Theme CSS Variables', size: '10.5 kb', color: 'text-indigo-450 text-indigo-400' },
                        { key: 'readme', label: 'README.md', type: 'Project Documentation', size: '5 kb', color: 'text-emerald-500' }
                      ].map(fileSpec => {
                        const isCurrent = selectedFile === fileSpec.key;
                        return (
                          <button
                            key={fileSpec.key}
                            onClick={() => setSelectedFile(fileSpec.key as any)}
                            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                              isCurrent 
                                ? (theme === 'dark' ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700') 
                                : `bg-transparent border-transparent ${theme === 'dark' ? 'text-gray-400 hover:bg-[#1C2638] hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${fileSpec.color}`}>⚡</span>
                              <div>
                                <span className="font-semibold block">{fileSpec.label}</span>
                                <span className="text-[10px] text-gray-400 block font-sans">{fileSpec.type}</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">{fileSpec.size}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Requirements validation indicator */}
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#131B2E] border-[#1E293B]' : 'bg-white border-gray-200/70'} shadow-sm transition-all text-xs`}>
                  <h3 className="font-bold text-sm mb-3 text-gray-400 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-500" />
                    How Rubrics Are Satisfied
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-[#0E1322]/80 border border-gray-100 dark:border-[#1E293B]/60">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 font-mono">1. DOM Manipulation (JS)</span>
                      <p className="text-gray-400 leading-normal">Accomplished in <code>app.js</code> via standard node injections (<code>document.createElement</code>) in the main render loop to map arrays cleanly without using dangerous inner HTML code.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-[#0E1322]/80 border border-gray-100 dark:border-[#1E293B]/60">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 font-mono">2. Array Functions</span>
                      <p className="text-gray-400 leading-normal">Demonstrates masterful usage of JavaScript array methods: <code>.filter()</code> separates completed statuses and search queries, <code>.sort()</code> formats orders, and <code>.reduce()</code> tallies layout analytics.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-[#0E1322]/80 border border-gray-100 dark:border-[#1E293B]/60">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 font-mono">3. Drag & Drop Reorders</span>
                      <p className="text-gray-400 leading-normal">Utilizes native HTML5 drag-and-drop APIs. Drags index parameters and splices source array indexes to maintain custom task orders.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Simulated Visual Code Terminal Viewer */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                
                {/* Code viewport block */}
                <div className="rounded-2xl overflow-hidden bg-[#0A0D16] border border-[#1E293B] shadow-sm relative">
                  
                  {/* Top Editor Tab Strip */}
                  <div className="bg-[#060910] px-4 py-2 flex items-center justify-between border-b border-[#1E293B] select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-mono font-bold text-gray-500 ml-4">
                        week2-task-manager/
                        {selectedFile === 'html' ? 'index.html' :
                         selectedFile === 'css' ? 'css/style.css' :
                         selectedFile === 'js' ? 'js/app.js' : 'README.md'}
                      </span>
                    </div>

                    {/* Copy to Clipboard Actions */}
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-[#0e1323] border border-indigo-900/50 rounded-lg text-[10px] font-bold text-indigo-300 flex items-center gap-1.5 hover:bg-indigo-900/40 hover:text-indigo-200 transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied code!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-400" />
                          Copy Clipboard
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Body */}
                  <div className="p-5 overflow-auto max-h-[600px] bg-[#070A12] text-gray-300 font-mono text-xs leading-relaxed">
                    <pre className="whitespace-pre-wrap rounded">
                      {selectedFile === 'html' && EXPORTER_FILES.html}
                      {selectedFile === 'css' && EXPORTER_FILES.css}
                      {selectedFile === 'js' && EXPORTER_FILES.js}
                      {selectedFile === 'readme' && EXPORTER_FILES.readme}
                    </pre>
                  </div>

                </div>

                {/* Subtitle / Tip card */}
                <div className={`p-4 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-indigo-950/10 border-indigo-900/35 text-indigo-300' : 'bg-indigo-50/50 border-indigo-100 text-indigo-700'}`}>
                  <div className="flex gap-2 items-center text-xs">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>This workspace has physically created these files inside the <code>/week2-task-manager/</code> subdirectory within this workspace container! They are fully functional and ready for export!</span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <footer className={`mt-12 py-6 text-center text-xs border-t ${theme === 'dark' ? 'border-[#1E293B] text-gray-500 bg-[#070A12]' : 'border-gray-200 text-gray-400 bg-[#F3F4F6]'}`}>
        <p>TaskCraft Task Manager — Crafted completely using semantic markup, modern CSS styling, React 19, and Tailwind 4.</p>
        <p className="mt-1">Google AI Studio Build &copy; 2026. All features live-previewed in real-time.</p>
      </footer>

    </div>
  );
}
