import React, { useState, useEffect, useRef } from 'react';

const UltimateTodoApp = () => {
  // ==================== STATE MANAGEMENT ====================
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('ultimate-todos');
    return savedTodos ? JSON.parse(savedTodos) : [
      { id: 1, text: 'Learn React', completed: true, priority: 'high', category: 'learning', createdAt: new Date().toISOString() },
      { id: 2, text: 'Build Todo App', completed: false, priority: 'medium', category: 'work', createdAt: new Date().toISOString() },
      { id: 3, text: 'Buy groceries', completed: false, priority: 'low', category: 'personal', createdAt: new Date().toISOString() }
    ];
  });

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState('priority');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved ? JSON.parse(saved) : 'en'; // English by default
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isDragging, setIsDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animateAdd, setAnimateAdd] = useState(false);
  const [themeColor, setThemeColor] = useState('#6366f1');

  const inputRef = useRef(null);
  const audioRef = useRef(null);

  // ==================== TRANSLATIONS ====================
  const translations = {
    en: {
      title: '✨ Ultimate Todo List',
      subtitle: 'Organize your life, one task at a time',
      placeholder: 'What do you want to do today?',
      addButton: '➕ Add Task',
      highPriority: 'High',
      mediumPriority: 'Medium',
      lowPriority: 'Low',
      personal: 'Personal',
      work: 'Work',
      learning: 'Learning',
      home: 'Home',
      other: 'Other',
      searchPlaceholder: '🔍 Search tasks...',
      all: 'All',
      active: 'Active',
      completed: 'Completed',
      showCompleted: 'Show Completed',
      sortBy: 'Sort by',
      sortPriority: 'Priority',
      sortDate: 'Date',
      sortName: 'Name',
      stats: '📊 Statistics',
      total: 'Total',
      activeTasks: 'Active',
      completedTasks: 'Completed',
      highPriorityTasks: 'High Priority',
      categoryDistribution: 'Category Distribution',
      tasks: '📋 Tasks',
      markAll: '✔️ Mark All Complete',
      clearCompleted: '🗑️ Clear Completed',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      emptyState: '🎉 No tasks yet!',
      emptyMessage: 'Start by adding a new task above',
      tip: '💡 Tip: Focus on high priority tasks first!',
      footer: '© Ultimate Todo App',
      saved: 'Tasks auto-saved in browser',
      dragDrop: '📥 Drag and drop to reorder',
      sound: '🔊 Sound',
      light: '☀️ Light',
      dark: '🌙 Dark',
      arabic: 'العربية',
      english: 'English',
      editTask: 'Edit Task',
      newTask: 'New Task Added',
      taskCompleted: 'Task Completed!',
      taskDeleted: 'Task Deleted',
      allCompleted: 'All Tasks Completed!',
      cleared: 'Completed Tasks Cleared'
    },
    ar: {
      title: '✨ قائمة المهام المتطورة',
      subtitle: 'نظم حياتك، مهمة واحدة في كل مرة',
      placeholder: 'ماذا تريد أن تفعل اليوم؟',
      addButton: '➕ إضافة مهمة',
      highPriority: 'عالي',
      mediumPriority: 'متوسط',
      lowPriority: 'منخفض',
      personal: 'شخصي',
      work: 'عمل',
      learning: 'تعلم',
      home: 'منزل',
      other: 'أخرى',
      searchPlaceholder: '🔍 بحث في المهام...',
      all: 'الكل',
      active: 'النشطة',
      completed: 'المكتملة',
      showCompleted: 'إظهار المكتملة',
      sortBy: 'ترتيب حسب',
      sortPriority: 'الأولوية',
      sortDate: 'التاريخ',
      sortName: 'الاسم',
      stats: '📊 إحصائيات',
      total: 'المجموع',
      activeTasks: 'النشطة',
      completedTasks: 'المكتملة',
      highPriorityTasks: 'عالية الأولوية',
      categoryDistribution: 'التوزيع حسب الفئة',
      tasks: '📋 المهام',
      markAll: '✔️ تكميل الكل',
      clearCompleted: '🗑️ حذف المكتملة',
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      emptyState: '🎉 لا توجد مهام!',
      emptyMessage: 'ابدأ بإضافة مهمة جديدة باستخدام الحقل أعلاه',
      tip: '💡 نصيحة: ركز على المهام عالية الأولوية أولاً!',
      footer: '© تطبيق قائمة المهام المتطور',
      saved: 'المهام محفوظة تلقائياً في المتصفح',
      dragDrop: '📥 اسحب وأفلت لإعادة الترتيب',
      sound: '🔊 صوت',
      light: '☀️ فاتح',
      dark: '🌙 داكن',
      arabic: 'العربية',
      english: 'English',
      editTask: 'تعديل المهمة',
      newTask: 'تم إضافة مهمة جديدة',
      taskCompleted: 'تم إكمال المهمة!',
      taskDeleted: 'تم حذف المهمة',
      allCompleted: 'تم إكمال جميع المهام!',
      cleared: 'تم مسح المهام المكتملة'
    }
  };

  const t = translations[language];

  // ==================== SAVE TO LOCALSTORAGE ====================
  useEffect(() => {
    localStorage.setItem('ultimate-todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('language', JSON.stringify(language));
  }, [todos, darkMode, language]);

  // ==================== SOUND EFFECTS ====================
  const playSound = (soundType) => {
    if (!soundEnabled) return;
    
    const sounds = {
      add: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
      complete: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
      delete: 'https://assets.mixkit.co/sfx/preview/mixkit-click-error-1110.mp3',
      notification: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'
    };

    if (audioRef.current) {
      audioRef.current.src = sounds[soundType];
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  // ==================== ANIMATIONS & EFFECTS ====================
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    playSound('notification');
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  // ==================== TODO OPERATIONS ====================
  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo = {
      id: generateId(),
      text: input.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString()
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setAnimateAdd(true);
    playSound('add');
    showNotificationMessage(t.newTask);
    
    setTimeout(() => setAnimateAdd(false), 300);
    inputRef.current?.focus();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    
    const todo = todos.find(t => t.id === id);
    if (!todo.completed) {
      playSound('complete');
      showNotificationMessage(t.taskCompleted);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    playSound('delete');
    showNotificationMessage(t.taskDeleted);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setPriority(todo.priority);
    setCategory(todo.category);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTodos(todos.map(todo =>
      todo.id === editingId
        ? { ...todo, text: editText.trim(), priority, category }
        : todo
    ));
    setEditingId(null);
    setEditText('');
    showNotificationMessage(t.editTask);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount > 0) {
      setTodos(todos.filter(todo => !todo.completed));
      showNotificationMessage(t.cleared);
    }
  };

  const markAllAs = (completed) => {
    setTodos(todos.map(todo => ({ ...todo, completed })));
    if (completed && todos.length > 0) {
      triggerConfetti();
      showNotificationMessage(t.allCompleted);
    }
  };

  // ==================== DRAG & DROP ====================
  const handleDragStart = (e, index) => {
    setIsDragging(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOver(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (isDragging === null || isDragging === dropIndex) return;
    
    const newTodos = [...todos];
    const draggedTodo = newTodos[isDragging];
    newTodos.splice(isDragging, 1);
    newTodos.splice(dropIndex, 0, draggedTodo);
    
    setTodos(newTodos);
    setIsDragging(null);
    setDragOver(null);
  };

  // ==================== FILTERING & SORTING ====================
  const filteredAndSortedTodos = () => {
    let result = [...todos];

    // Filtering
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // Search
    if (searchTerm) {
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Show completed filter
    if (!showCompleted) {
      result = result.filter(todo => !todo.completed);
    }

    // Sorting
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'date':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name':
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      default:
        break;
    }

    return result;
  };

  // ==================== STATISTICS ====================
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high').length,
    byCategory: todos.reduce((acc, todo) => {
      acc[todo.category] = (acc[todo.category] || 0) + 1;
      return acc;
    }, {})
  };

  // ==================== MODERN STYLES ====================
  const theme = {
    primary: themeColor,
    secondary: darkMode ? '#8b5cf6' : '#7c3aed',
    background: darkMode ? '#0f172a' : '#ffffff',
    surface: darkMode ? '#1e293b' : '#f8fafc',
    surfaceHover: darkMode ? '#334155' : '#f1f5f9',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: theme.background,
      minHeight: '100vh',
      color: theme.text,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode 
        ? `linear-gradient(45deg, ${theme.background} 25%, transparent 25%),
           linear-gradient(-45deg, ${theme.background} 25%, transparent 25%),
           linear-gradient(45deg, transparent 75%, ${theme.background} 75%),
           linear-gradient(-45deg, transparent 75%, ${theme.background} 75%)`
        : `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%),
           radial-gradient(circle at 90% 80%, rgba(99,102,241,0.1) 0%, transparent 20%)`,
      backgroundSize: darkMode ? '20px 20px' : 'cover',
      opacity: 0.3,
      zIndex: 0
    },
    content: {
      position: 'relative',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
      paddingTop: '20px'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '15px',
      fontWeight: 900,
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
      color: theme.textSecondary,
      marginBottom: '30px',
      opacity: 0.8
    },
    controlsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: theme.surface,
      borderRadius: '20px',
      marginBottom: '30px',
      boxShadow: darkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.1)'
        : '0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme.border}`,
      flexWrap: 'wrap',
      gap: '15px'
    },
    controlGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    inputSection: {
      display: 'flex',
      gap: '15px',
      marginBottom: '40px',
      flexWrap: 'wrap'
    },
    input: {
      flex: 1,
      padding: '18px 20px',
      fontSize: '16px',
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      backgroundColor: theme.surface,
      color: theme.text,
      minWidth: '250px',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: theme.primary,
        boxShadow: `0 0 0 3px ${theme.primary}20`,
        transform: 'translateY(-2px)'
      }
    },
    select: {
      padding: '15px 20px',
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      backgroundColor: theme.surface,
      color: theme.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: theme.primary,
        transform: 'translateY(-2px)'
      }
    },
    button: {
      padding: '15px 30px',
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '&:hover': {
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: `0 10px 25px ${theme.primary}40`,
        backgroundColor: theme.secondary
      },
      '&:active': {
        transform: 'translateY(-1px)'
      }
    },
    iconButton: {
      padding: '12px',
      borderRadius: '50%',
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: theme.primary,
        backgroundColor: theme.primary,
        color: 'white',
        transform: 'rotate(15deg) scale(1.1)'
      }
    },
    todoItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '25px',
      marginBottom: '15px',
      backgroundColor: theme.surface,
      borderRadius: '16px',
      borderLeft: `6px solid ${theme.primary}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateX(0)',
      boxShadow: darkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        transform: 'translateX(10px) translateY(-5px)',
        boxShadow: darkMode 
          ? '0 15px 40px rgba(0, 0, 0, 0.4)'
          : '0 15px 40px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.surfaceHover
      },
      opacity: 1
    },
    todoItemDragging: {
      transform: 'scale(0.95) rotate(3deg)',
      opacity: 0.6,
      boxShadow: `0 20px 60px ${theme.primary}40`
    },
    todoItemDragOver: {
      transform: 'translateY(10px)',
      borderTop: `3px dashed ${theme.primary}`
    },
    priorityBadge: {
      padding: '6px 15px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginRight: '12px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    categoryBadge: {
      padding: '6px 15px',
      backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
      borderRadius: '20px',
      fontSize: '12px',
      marginRight: '12px',
      color: darkMode ? '#cbd5e0' : '#4a5568',
      fontWeight: '500'
    },
    checkbox: {
      width: '24px',
      height: '24px',
      marginRight: '20px',
      cursor: 'pointer',
      accentColor: theme.primary,
      transform: 'scale(1.2)'
    },
    statsCard: {
      backgroundColor: theme.surface,
      padding: '30px',
      borderRadius: '20px',
      marginBottom: '40px',
      boxShadow: darkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.3)'
        : '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${theme.border}`,
      transition: 'all 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '25px',
      marginTop: '20px'
    },
    statItem: {
      textAlign: 'center',
      padding: '20px',
      backgroundColor: theme.surfaceHover,
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 20px ${theme.primary}20`
      }
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '5px'
    },
    statLabel: {
      fontSize: '14px',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    filterButton: {
      padding: '12px 25px',
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      cursor: 'pointer',
      color: theme.textSecondary,
      transition: 'all 0.3s ease',
      fontWeight: '500',
      '&:hover': {
        borderColor: theme.primary,
        color: theme.primary,
        transform: 'translateY(-2px)'
      }
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      color: 'white',
      boxShadow: `0 5px 15px ${theme.primary}40`
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginLeft: 'auto'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.textSecondary
    },
    emptyIcon: {
      fontSize: '5rem',
      marginBottom: '20px',
      opacity: 0.5
    },
    notification: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '20px 30px',
      backgroundColor: theme.surface,
      color: theme.text,
      borderRadius: '16px',
      boxShadow: darkMode 
        ? '0 20px 60px rgba(0, 0, 0, 0.5)'
        : '0 20px 60px rgba(0, 0, 0, 0.1)',
      borderLeft: `6px solid ${theme.success}`,
      transform: 'translateX(0)',
      transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      maxWidth: '400px'
    },
    notificationHide: {
      transform: 'translateX(500px)'
    },
    colorPicker: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    colorOption: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '3px solid transparent',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.2)'
      }
    },
    colorOptionActive: {
      borderColor: 'white',
      boxShadow: '0 0 0 2px currentColor'
    },
    languageSwitch: {
      display: 'flex',
      backgroundColor: theme.surfaceHover,
      borderRadius: '12px',
      padding: '4px',
      border: `2px solid ${theme.border}`
    },
    languageOption: {
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    languageOptionActive: {
      backgroundColor: theme.primary,
      color: 'white'
    },
    confetti: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 999
    }
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderTodoItem = (todo, index) => {
    const isDraggingItem = isDragging === index;
    const isDragOverItem = dragOver === index;

    if (editingId === todo.id) {
      return (
        <div style={styles.todoItem}>
          <div style={{ flex: 1, display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
              autoFocus
              placeholder={t.editTask}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.select}
            >
              <option value="high">{t.highPriority}</option>
              <option value="medium">{t.mediumPriority}</option>
              <option value="low">{t.lowPriority}</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="personal">{t.personal}</option>
              <option value="work">{t.work}</option>
              <option value="learning">{t.learning}</option>
              <option value="home">{t.home}</option>
              <option value="other">{t.other}</option>
            </select>
          </div>
          <div style={styles.actionButtons}>
            <button
              onClick={saveEdit}
              style={{ ...styles.button, backgroundColor: theme.success }}
            >
              💾 {t.save}
            </button>
            <button
              onClick={cancelEdit}
              style={{ ...styles.button, backgroundColor: theme.danger }}
            >
              ✕ {t.cancel}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={() => {
          setIsDragging(null);
          setDragOver(null);
        }}
        style={{
          ...styles.todoItem,
          ...(isDraggingItem && styles.todoItemDragging),
          ...(isDragOverItem && styles.todoItemDragOver),
          cursor: 'grab'
        }}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          style={styles.checkbox}
        />
        
        <div style={{ flex: 1 }}>
          <div style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            opacity: todo.completed ? 0.6 : 1,
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '10px',
            color: todo.completed ? theme.textSecondary : theme.text
          }}>
            {todo.text}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              ...styles.priorityBadge,
              backgroundColor: getPriorityColor(todo.priority)
            }}>
              {todo.priority === 'high' ? '🔥' : todo.priority === 'medium' ? '⚡' : '🌿'}
              {todo.priority === 'high' ? t.highPriority : 
               todo.priority === 'medium' ? t.mediumPriority : t.lowPriority}
            </span>
            
            <span style={styles.categoryBadge}>
              {todo.category === 'personal' ? '👤' : 
               todo.category === 'work' ? '💼' : 
               todo.category === 'learning' ? '📚' : 
               todo.category === 'home' ? '🏠' : '📌'}
              {todo.category === 'personal' ? t.personal : 
               todo.category === 'work' ? t.work : 
               todo.category === 'learning' ? t.learning : 
               todo.category === 'home' ? t.home : t.other}
            </span>
            
            <span style={{
              color: theme.textSecondary,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              📅 {new Date(todo.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
            </span>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            onClick={() => startEditing(todo)}
            style={{
              ...styles.button,
              backgroundColor: 'transparent',
              color: theme.info,
              border: `2px solid ${theme.info}`,
              padding: '10px 20px'
            }}
          >
            ✏️ {t.edit}
          </button>
          
          <button
            onClick={() => deleteTodo(todo.id)}
            style={{
              ...styles.button,
              backgroundColor: theme.danger,
              padding: '10px 20px'
            }}
          >
            🗑️ {t.delete}
          </button>
        </div>
      </div>
    );
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const confettiElements = [];
    for (let i = 0; i < 150; i++) {
      const style = {
        position: 'absolute',
        width: Math.random() * 20 + 5 + 'px',
        height: Math.random() * 20 + 5 + 'px',
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
        top: '-20px',
        left: Math.random() * 100 + '%',
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
        animationDelay: Math.random() * 2 + 's',
        transform: `rotate(${Math.random() * 360}deg)`
      };
      confettiElements.push(<div key={i} style={style} />);
    }
    
    return <div style={styles.confetti}>{confettiElements}</div>;
  };

  // ==================== MAIN RENDER ====================
  return (
    <div style={styles.container}>
      <audio ref={audioRef} preload="auto" />
      
      {/* Background Pattern */}
      <div style={styles.backgroundPattern} />
      
      {/* Confetti Effect */}
      {renderConfetti()}
      
      {/* Notification */}
      <div style={{
        ...styles.notification,
        ...(showNotification ? {} : styles.notificationHide)
      }}>
        <div style={{
          fontSize: '24px',
          color: theme.success
        }}>
          {notificationMessage.includes('Completed') ? '🎉' : 
           notificationMessage.includes('Deleted') ? '🗑️' : 
           notificationMessage.includes('Added') ? '✨' : '💾'}
        </div>
        <div>{notificationMessage}</div>
      </div>
      
      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </header>

        {/* Controls Bar */}
        <div style={styles.controlsBar}>
          <div style={styles.controlGroup}>
            <div style={styles.colorPicker}>
              <div
                onClick={() => setThemeColor('#6366f1')}
                style={{
                  ...styles.colorOption,
                  backgroundColor: '#6366f1',
                  ...(themeColor === '#6366f1' && styles.colorOptionActive)
                }}
                title="Indigo"
              />
              <div
                onClick={() => setThemeColor('#10b981')}
                style={{
                  ...styles.colorOption,
                  backgroundColor: '#10b981',
                  ...(themeColor === '#10b981' && styles.colorOptionActive)
                }}
                title="Emerald"
              />
              <div
                onClick={() => setThemeColor('#f59e0b')}
                style={{
                  ...styles.colorOption,
                  backgroundColor: '#f59e0b',
                  ...(themeColor === '#f59e0b' && styles.colorOptionActive)
                }}
                title="Amber"
              />
              <div
                onClick={() => setThemeColor('#ef4444')}
                style={{
                  ...styles.colorOption,
                  backgroundColor: '#ef4444',
                  ...(themeColor === '#ef4444' && styles.colorOptionActive)
                }}
                title="Red"
              />
            </div>
          </div>

          <div style={styles.controlGroup}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={styles.iconButton}
              title={darkMode ? t.light : t.dark}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={styles.iconButton}
              title={t.sound}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            
            <div style={styles.languageSwitch}>
              <div
                onClick={() => setLanguage('en')}
                style={{
                  ...styles.languageOption,
                  ...(language === 'en' && styles.languageOptionActive)
                }}
              >
                {t.english}
              </div>
              <div
                onClick={() => setLanguage('ar')}
                style={{
                  ...styles.languageOption,
                  ...(language === 'ar' && styles.languageOptionActive)
                }}
              >
                {t.arabic}
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div style={styles.inputSection}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder={t.placeholder}
            style={{
              ...styles.input,
              transform: animateAdd ? 'scale(0.98)' : 'scale(1)'
            }}
          />
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.select}
          >
            <option value="high">🔥 {t.highPriority}</option>
            <option value="medium">⚡ {t.mediumPriority}</option>
            <option value="low">🌿 {t.lowPriority}</option>
          </select>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="personal">👤 {t.personal}</option>
            <option value="work">💼 {t.work}</option>
            <option value="learning">📚 {t.learning}</option>
            <option value="home">🏠 {t.home}</option>
            <option value="other">📌 {t.other}</option>
          </select>
          
          <button
            onClick={addTodo}
            style={{
              ...styles.button,
              animation: animateAdd ? 'pulse 0.3s ease-in-out' : 'none'
            }}
          >
            ✨ {t.addButton}
          </button>
        </div>

        {/* Filters & Stats */}
        <div style={styles.statsCard}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {t.stats}
            <span style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: 'auto' }}>
              {t.dragDrop}
            </span>
          </h3>
          
          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                ...styles.filterButton,
                ...(filter === 'all' && styles.filterButtonActive)
              }}
            >
              📦 {t.all} ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              style={{
                ...styles.filterButton,
                ...(filter === 'active' && styles.filterButtonActive)
              }}
            >
              ⚡ {t.active} ({stats.active})
            </button>
            <button
              onClick={() => setFilter('completed')}
              style={{
                ...styles.filterButton,
                ...(filter === 'completed' && styles.filterButtonActive)
              }}
            >
              ✅ {t.completed} ({stats.completed})
            </button>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  style={styles.checkbox}
                />
                {t.showCompleted}
              </label>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ ...styles.select, minWidth: '150px' }}
              >
                <option value="priority">📊 {t.sortBy} {t.sortPriority}</option>
                <option value="date">📅 {t.sortBy} {t.sortDate}</option>
                <option value="name">🔤 {t.sortBy} {t.sortName}</option>
              </select>
              
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...styles.input, minWidth: '200px' }}
              />
            </div>
          </div>
          
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.total}</div>
              <div style={styles.statLabel}>{t.total}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.active}</div>
              <div style={styles.statLabel}>{t.activeTasks}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.completed}</div>
              <div style={styles.statLabel}>{t.completedTasks}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.highPriority}</div>
              <div style={styles.statLabel}>{t.highPriorityTasks}</div>
            </div>
          </div>
          
          {/* Category Distribution */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ marginBottom: '15px', color: theme.textSecondary }}>
              📈 {t.categoryDistribution}
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(stats.byCategory).map(([cat, count]) => (
                <div
                  key={cat}
                  style={{
                    ...styles.categoryBadge,
                    backgroundColor: theme.surfaceHover,
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>
                    {cat === 'personal' ? '👤' : 
                     cat === 'work' ? '💼' : 
                     cat === 'learning' ? '📚' : 
                     cat === 'home' ? '🏠' : '📌'}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{count}</span>
                  <span style={{ opacity: 0.7 }}>
                    {cat === 'personal' ? t.personal : 
                     cat === 'work' ? t.work : 
                     cat === 'learning' ? t.learning : 
                     cat === 'home' ? t.home : t.other}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {t.tasks} 
              <span style={{
                fontSize: '14px',
                backgroundColor: theme.primary,
                color: 'white',
                padding: '5px 15px',
                borderRadius: '20px'
              }}>
                {filteredAndSortedTodos().length}
              </span>
            </h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => markAllAs(true)}
                style={{ ...styles.button, backgroundColor: theme.success }}
              >
                ✅ {t.markAll}
              </button>
              <button
                onClick={clearCompleted}
                style={{ ...styles.button, backgroundColor: theme.danger }}
              >
                🧹 {t.clearCompleted}
              </button>
            </div>
          </div>

          {filteredAndSortedTodos().length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{t.emptyState}</h3>
              <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>{t.emptyMessage}</p>
            </div>
          ) : (
            <div>
              {filteredAndSortedTodos().map((todo, index) => (
                <div key={todo.id}>
                  {renderTodoItem(todo, index)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(500px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        * {
          direction: ${language === 'ar' ? 'rtl' : 'ltr'};
        }
        
        input, textarea, select, button {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        ::selection {
          background-color: ${theme.primary}40;
          color: ${theme.text};
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${theme.surface};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${theme.primary};
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.secondary};
        }
      `}</style>
    </div>
  );
};

export default UltimateTodoApp;