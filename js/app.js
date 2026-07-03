// ===========================
// Storage Manager
// ===========================

const StorageManager = {
    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    // User name
    getUserName() {
        return localStorage.getItem('dashboard_userName');
    },

    setUserName(name) {
        localStorage.setItem('dashboard_userName', name);
    },

    // Timer preferences
    getTimerDuration() {
        const duration = localStorage.getItem('dashboard_timerDuration');
        return duration ? parseInt(duration, 10) : null;
    },

    setTimerDuration(minutes) {
        localStorage.setItem('dashboard_timerDuration', minutes.toString());
    },

    // Tasks
    getTasks() {
        try {
            const tasks = localStorage.getItem('dashboard_tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (e) {
            console.error('Failed to parse tasks from localStorage:', e);
            return [];
        }
    },

    setTasks(tasks) {
        try {
            localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage:', e);
        }
    },

    // Quick links
    getLinks() {
        try {
            const links = localStorage.getItem('dashboard_links');
            return links ? JSON.parse(links) : [];
        } catch (e) {
            console.error('Failed to parse links from localStorage:', e);
            return [];
        }
    },

    setLinks(links) {
        try {
            localStorage.setItem('dashboard_links', JSON.stringify(links));
        } catch (e) {
            console.error('Failed to save links to localStorage:', e);
        }
    },

    // Theme
    getTheme() {
        return localStorage.getItem('dashboard_theme');
    },

    setTheme(theme) {
        localStorage.setItem('dashboard_theme', theme);
    },

    // Sort preference
    getSortPreference() {
        return localStorage.getItem('dashboard_sortPreference');
    },

    setSortPreference(preference) {
        localStorage.setItem('dashboard_sortPreference', preference);
    },

    // Clear all data
    clear() {
        localStorage.removeItem('dashboard_userName');
        localStorage.removeItem('dashboard_timerDuration');
        localStorage.removeItem('dashboard_tasks');
        localStorage.removeItem('dashboard_links');
        localStorage.removeItem('dashboard_theme');
        localStorage.removeItem('dashboard_sortPreference');
    }
};

// ===========================
// Theme Manager
// ===========================

const ThemeManager = {
    init() {
        const savedTheme = StorageManager.getTheme();
        if (savedTheme) {
            this.apply(savedTheme);
        } else {
            this.apply('light');
        }

        // Set up theme toggle button
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        themeToggleBtn.addEventListener('click', () => this.toggle());
    },

    toggle() {
        const currentTheme = this.getCurrent();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.apply(newTheme);
    },

    apply(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        StorageManager.setTheme(theme);

        const themeIcon = document.getElementById('themeIcon');
        if (theme === 'dark') {
            themeIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
            themeIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    },

    getCurrent() {
        return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    }
};

// ===========================
// Greeting Module
// ===========================

const GreetingModule = {
    init() {
        this.updateDisplay();
        // Update every second
        setInterval(() => this.updateDisplay(), 1000);
    },

    updateDisplay() {
        const now = new Date();
        const timeDisplay = document.getElementById('timeDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        const greetingMessage = document.getElementById('greetingMessage');

        timeDisplay.textContent = this.formatTime(now);
        dateDisplay.textContent = this.formatDate(now);

        const userName = StorageManager.getUserName() || 'Guest';
        const period = this.getTimePeriod(now.getHours());
        greetingMessage.textContent = this.getGreeting(period, userName);
    },

    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    },

    formatDate(date) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayOfWeek = daysOfWeek[date.getDay()];
        const month = months[date.getMonth()];
        const day = date.getDate();
        
        return `${dayOfWeek}, ${month} ${day}`;
    },

    getTimePeriod(hour) {
        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 18) {
            return 'afternoon';
        } else {
            return 'evening';
        }
    },

    getGreeting(period, userName) {
        if (period === 'morning') {
            return `Good morning, ${userName}`;
        } else if (period === 'afternoon') {
            return `Good afternoon, ${userName}`;
        } else {
            return `Good evening, ${userName}`;
        }
    }
};

// ===========================
// Timer Module
// ===========================

const TimerModule = {
    state: {
        duration: 25 * 60, // Default 25 minutes in seconds
        remaining: 25 * 60,
        running: false,
        intervalId: null
    },

    init() {
        const savedDuration = StorageManager.getTimerDuration();
        if (savedDuration) {
            this.state.duration = savedDuration * 60;
            this.state.remaining = savedDuration * 60;
        }

        this.updateDisplay();
        this.updateToggleButton();

        document.getElementById('timerToggleBtn').addEventListener('click', () => this.toggle());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('setDurationBtn').addEventListener('click', () => this.showDurationInput());
        document.getElementById('saveDurationBtn').addEventListener('click', () => this.setCustomDuration());
        document.getElementById('cancelDurationBtn').addEventListener('click', () => this.hideDurationInput());
    },

    toggle() {
        if (this.state.running) {
            this.stop();
        } else {
            this.start();
        }
    },

    updateToggleButton() {
        const btn = document.getElementById('timerToggleBtn');
        if (this.state.running) {
            btn.className = 'btn btn-secondary';
            btn.setAttribute('aria-label', 'Stop timer');
            btn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>Stop';
        } else {
            btn.className = 'btn btn-primary';
            btn.setAttribute('aria-label', 'Start timer');
            btn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>Start';
        }
    },

    start() {
        if (!this.state.running) {
            this.state.running = true;
            this.state.intervalId = setInterval(() => this.tick(), 1000);
            this.updateToggleButton();
        }
    },

    stop() {
        if (this.state.running) {
            this.state.running = false;
            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
                this.state.intervalId = null;
            }
            this.updateToggleButton();
        }
    },

    reset() {
        this.stop();
        this.state.remaining = this.state.duration;
        this.updateDisplay();
        this.clearMessage();
    },

    tick() {
        if (this.state.remaining > 0) {
            this.state.remaining--;
            this.updateDisplay();
        } else {
            this.handleComplete();
        }
    },

    handleComplete() {
        this.stop();
        this.showMessage('Timer completed!', 'success');

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus Timer Complete', {
                body: 'Your focus session has ended!'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Focus Timer Complete', {
                        body: 'Your focus session has ended!'
                    });
                }
            });
        }
    },

    showDurationInput() {
        document.getElementById('durationInputContainer').classList.remove('hidden');
    },

    hideDurationInput() {
        document.getElementById('durationInputContainer').classList.add('hidden');
        document.getElementById('durationInput').value = '';
    },

    setCustomDuration() {
        const input = document.getElementById('durationInput');
        const minutes = parseInt(input.value, 10);

        if (isNaN(minutes) || minutes < 1 || minutes > 60) {
            this.showMessage('Duration must be between 1 and 60 minutes', 'error');
            return;
        }

        this.state.duration = minutes * 60;
        this.state.remaining = minutes * 60;
        StorageManager.setTimerDuration(minutes);
        this.updateDisplay();
        this.hideDurationInput();
        this.showMessage(`Timer set to ${minutes} minutes`, 'success');
    },

    updateDisplay() {
        const timerClock = document.getElementById('timerClock');
        timerClock.textContent = this.formatTime(this.state.remaining);
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const minsStr = mins < 10 ? '0' + mins : mins;
        const secsStr = secs < 10 ? '0' + secs : secs;
        return `${minsStr}:${secsStr}`;
    },

    showMessage(message, type) {
        const messageEl = document.getElementById('timerMessage');
        messageEl.textContent = message;
        messageEl.style.color = type === 'success' ? 'var(--color-success)' : 'var(--color-error)';
    },

    clearMessage() {
        const messageEl = document.getElementById('timerMessage');
        messageEl.textContent = '';
    }
};

// ===========================
// Tasks Module
// ===========================

const TasksModule = {
    state: {
        tasks: [],
        sortPreference: 'creation'
    },

    init() {
        this.state.tasks = StorageManager.getTasks();
        const savedSort = StorageManager.getSortPreference();
        if (savedSort) {
            this.state.sortPreference = savedSort;
            document.getElementById('sortSelect').value = savedSort;
        }

        this.renderTasks();

        // Set up event listeners
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortTasks(e.target.value);
        });
    },

    addTask() {
        const input = document.getElementById('taskInput');
        const description = input.value.trim();

        if (!this.validateDescription(description)) {
            this.showError('Task description cannot be empty');
            return;
        }

        const task = {
            id: `task_${Date.now()}_${Math.random()}`,
            description: description,
            completed: false,
            createdAt: Date.now()
        };

        this.state.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        input.value = '';
        this.hideError();
    },

    deleteTask(id) {
        this.state.tasks = this.state.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    },

    toggleTask(id) {
        const task = this.state.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    },

    editTask(id) {
        const task = this.state.tasks.find(task => task.id === id);
        if (!task) return;

        const newDescription = prompt('Edit task:', task.description);
        if (newDescription !== null) {
            const trimmed = newDescription.trim();
            if (this.validateDescription(trimmed)) {
                task.description = trimmed;
                this.saveTasks();
                this.renderTasks();
            } else {
                alert('Task description cannot be empty');
            }
        }
    },

    sortTasks(sortType) {
        this.state.sortPreference = sortType;
        StorageManager.setSortPreference(sortType);

        if (sortType === 'alphabetical') {
            this.state.tasks.sort((a, b) => a.description.localeCompare(b.description));
        } else if (sortType === 'status') {
            this.state.tasks.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
        } else {
            // creation order
            this.state.tasks.sort((a, b) => a.createdAt - b.createdAt);
        }

        this.renderTasks();
    },

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.state.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            const description = document.createElement('span');
            description.className = 'task-description';
            description.textContent = task.description;

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-small btn-utility';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => this.editTask(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-small btn-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(checkbox);
            li.appendChild(description);
            li.appendChild(actions);

            taskList.appendChild(li);
        });
    },

    validateDescription(description) {
        return description.length > 0;
    },

    saveTasks() {
        StorageManager.setTasks(this.state.tasks);
    },

    showError(message) {
        const errorEl = document.getElementById('taskError');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    },

    hideError() {
        const errorEl = document.getElementById('taskError');
        errorEl.classList.add('hidden');
    }
};

// ===========================
// Links Module
// ===========================

const LinksModule = {
    state: {
        links: []
    },

    init() {
        this.state.links = StorageManager.getLinks();
        this.renderLinks();

        // Set up event listeners
        document.getElementById('linkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLink();
        });
    },

    addLink() {
        const urlInput = document.getElementById('urlInput');
        const labelInput = document.getElementById('labelInput');
        const url = urlInput.value.trim();
        const label = labelInput.value.trim();

        if (!this.validateUrl(url)) {
            this.showError('URL must start with http:// or https://');
            return;
        }

        if (!this.validateLabel(label)) {
            this.showError('URL and label are required');
            return;
        }

        const link = {
            id: `link_${Date.now()}_${Math.random()}`,
            url: url,
            label: label
        };

        this.state.links.push(link);
        this.saveLinks();
        this.renderLinks();
        urlInput.value = '';
        labelInput.value = '';
        this.hideError();
    },

    deleteLink(id) {
        this.state.links = this.state.links.filter(link => link.id !== id);
        this.saveLinks();
        this.renderLinks();
    },

    renderLinks() {
        const linkList = document.getElementById('linkList');
        linkList.innerHTML = '';

        this.state.links.forEach(link => {
            const linkBtn = document.createElement('div');
            linkBtn.className = 'link-item';

            const linkLabel = document.createElement('span');
            linkLabel.textContent = link.label;
            linkLabel.addEventListener('click', () => {
                window.open(link.url, '_blank');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'link-delete';
            deleteBtn.setAttribute('aria-label', 'Delete link');
            deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLink(link.id);
            });

            linkBtn.appendChild(linkLabel);
            linkBtn.appendChild(deleteBtn);
            linkList.appendChild(linkBtn);
        });
    },

    validateUrl(url) {
        return /^https?:\/\/.+/.test(url);
    },

    validateLabel(label) {
        return label.length > 0;
    },

    saveLinks() {
        StorageManager.setLinks(this.state.links);
    },

    showError(message) {
        const errorEl = document.getElementById('linkError');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    },

    hideError() {
        const errorEl = document.getElementById('linkError');
        errorEl.classList.add('hidden');
    }
};

// ===========================
// User Name Popup
// ===========================

function initUserNamePopup() {
    const userName = StorageManager.getUserName();
    
    if (!userName) {
        const popup = document.getElementById('namePopup');
        popup.classList.remove('hidden');

        document.getElementById('submitNameBtn').addEventListener('click', () => {
            const nameInput = document.getElementById('nameInput');
            const name = nameInput.value.trim();
            if (name) {
                StorageManager.setUserName(name);
                popup.classList.add('hidden');
                GreetingModule.updateDisplay();
            }
        });

        document.getElementById('guestBtn').addEventListener('click', () => {
            StorageManager.setUserName('Guest');
            popup.classList.add('hidden');
            GreetingModule.updateDisplay();
        });

        // Allow Enter key to submit
        document.getElementById('nameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('submitNameBtn').click();
            }
        });
    }
}

// ===========================
// Dashboard Initialization
// ===========================

function initDashboard() {
    // Check if localStorage is available
    if (!StorageManager.isAvailable()) {
        document.getElementById('storageError').classList.remove('hidden');
        return;
    }

    // Initialize all modules
    ThemeManager.init();
    GreetingModule.init();
    TimerModule.init();
    TasksModule.init();
    LinksModule.init();
    initUserNamePopup();
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
