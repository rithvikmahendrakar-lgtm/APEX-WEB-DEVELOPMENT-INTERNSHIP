/* ============================================================
   1. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   2. TYPING ANIMATION
   ============================================================ */
const typingEl = document.getElementById('typing');
const roles = ['Developer 💻', 'Cyber Security Enthusiast 🔐', 'Problem Solver 🚀', 'Tech Lover ⚡'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

(function type() {
    const word = roles[roleIndex];
    typingEl.textContent = word.substring(0, isDeleting ? charIndex-- : charIndex++);
    let speed = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === word.length + 1) {
        isDeleting = true;
        speed = 1600;
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 350;
    }
    setTimeout(type, speed);
})();

/* ============================================================
   3. FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   4. CONTACT FORM  (saves to localStorage)
   ============================================================ */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const msg = document.getElementById('cMsg').value.trim();
    const formMsg = document.getElementById('formMsg');

    if (!name || !email || !msg) {
        formMsg.textContent = 'Please fill in all fields.';
        formMsg.className = 'form-msg error';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMsg.textContent = 'Please enter a valid email address.';
        formMsg.className = 'form-msg error';
        return;
    }

    const messages = JSON.parse(localStorage.getItem('dm_messages')) || [];
    messages.unshift({ name, email, msg, date: new Date().toLocaleString() });
    localStorage.setItem('dm_messages', JSON.stringify(messages));

    e.target.reset();
    formMsg.textContent = 'Message sent successfully! Thank you.';
    formMsg.className = 'form-msg success';
});

/* ============================================================
   5. TO-DO LIST + NOTES  (localStorage persistence)
   ============================================================ */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let tasks = JSON.parse(localStorage.getItem('dm_tasks')) || [];
let notes = JSON.parse(localStorage.getItem('dm_notes')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesGrid = document.getElementById('notesGrid');

function saveTasks() { localStorage.setItem('dm_tasks', JSON.stringify(tasks)); }
function saveNotes() { localStorage.setItem('dm_notes', JSON.stringify(notes)); }

function renderTasks() {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = '<li class="empty">No tasks here. Add one above!</li>';
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'done' : ''}`;
        li.innerHTML = `
            <label class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-action="toggle" data-id="${task.id}">
                <span class="task-text">
                    ${escapeHtml(task.text)}
                    <small class="task-date">${task.createdAt}</small>
                </span>
            </label>
            <span class="badge badge-${task.priority}">${task.priority}</span>
            <div class="task-actions">
                <button data-action="edit" data-id="${task.id}" title="Edit"><i class="fas fa-pen"></i></button>
                <button data-action="delete" data-id="${task.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });

    const active = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) { taskInput.focus(); return; }

    tasks.unshift({
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        completed: false,
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    });

    taskInput.value = '';
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

taskList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'toggle') {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    } else if (action === 'delete') {
        tasks = tasks.filter(t => t.id !== id);
    } else if (action === 'edit') {
        const task = tasks.find(t => t.id === id);
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') task.text = newText.trim();
    }
    saveTasks();
    renderTasks();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

function renderNotes() {
    notesGrid.innerHTML = notes.length ? '' : '<p class="empty">No notes yet.</p>';
    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <p>${escapeHtml(note.text).replace(/\n/g, '<br>')}</p>
            <div class="note-footer">
                <small>${note.date}</small>
                <button data-note-id="${note.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        notesGrid.appendChild(card);
    });
}

function addNote() {
    const text = noteInput.value.trim();
    if (!text) return;
    notes.unshift({
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    noteInput.value = '';
    saveNotes();
    renderNotes();
}

addNoteBtn.addEventListener('click', addNote);

notesGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-note-id]');
    if (!btn) return;
    notes = notes.filter(n => n.id !== Number(btn.dataset.noteId));
    saveNotes();
    renderNotes();
});

renderTasks();
renderNotes();

/* ============================================================
   6. PRODUCT FILTER + SORT
   ============================================================ */
const PRODUCTS = [
    { id: 1,  name: 'Wireless Headphones',  category: 'electronics', price: 2999, rating: 4.5, icon: '🎧' },
    { id: 2,  name: 'Smart Watch',          category: 'electronics', price: 4999, rating: 4.2, icon: '⌚' },
    { id: 3,  name: 'Bluetooth Speaker',    category: 'electronics', price: 1499, rating: 4.0, icon: '🔊' },
    { id: 4,  name: 'Laptop Stand',         category: 'electronics', price: 999,  rating: 4.3, icon: '💻' },
    { id: 5,  name: 'Graphic T-Shirt',      category: 'fashion',     price: 599,  rating: 4.1, icon: '👕' },
    { id: 6,  name: 'Denim Jacket',         category: 'fashion',     price: 1899, rating: 4.6, icon: '🧥' },
    { id: 7,  name: 'Running Sneakers',     category: 'fashion',     price: 2499, rating: 4.4, icon: '👟' },
    { id: 8,  name: 'Travel Backpack',      category: 'fashion',     price: 1299, rating: 4.2, icon: '🎒' },
    { id: 9,  name: 'JavaScript Guide',     category: 'books',       price: 499,  rating: 4.8, icon: '📘' },
    { id: 10, name: 'Python Crash Course',  category: 'books',       price: 650,  rating: 4.7, icon: '📗' },
    { id: 11, name: 'Atomic Habits',        category: 'books',       price: 350,  rating: 4.6, icon: '📕' },
    { id: 12, name: 'LED Desk Lamp',        category: 'home',        price: 899,  rating: 4.3, icon: '💡' },
    { id: 13, name: 'Coffee Mug',           category: 'home',        price: 299,  rating: 4.1, icon: '☕' },
    { id: 14, name: 'Wall Clock',           category: 'home',        price: 749,  rating: 3.9, icon: '🕐' },
    { id: 15, name: 'Plant Pot',            category: 'home',        price: 399,  rating: 4.5, icon: '🪴' },
];

const prodState = { search: '', category: 'all', maxPrice: 5000, sort: 'featured' };

const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.cat-btn');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');
const resultCount = document.getElementById('resultCount');

function getFilteredProducts() {
    let items = PRODUCTS.filter(p =>
        (prodState.category === 'all' || p.category === prodState.category) &&
        p.price <= prodState.maxPrice &&
        p.name.toLowerCase().includes(prodState.search.toLowerCase())
    );

    switch (prodState.sort) {
        case 'price-low':  items.sort((a, b) => a.price - b.price); break;
        case 'price-high': items.sort((a, b) => b.price - a.price); break;
        case 'rating':     items.sort((a, b) => b.rating - a.rating); break;
        case 'name':       items.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return items;
}

function renderProducts() {
    const items = getFilteredProducts();
    resultCount.textContent = `${items.length} product${items.length !== 1 ? 's' : ''} found`;
    grid.innerHTML = items.length ? '' : '<p class="empty">No products match your filters.</p>';

    items.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-icon">${p.icon}</div>
            <span class="product-cat">${p.category}</span>
            <h3>${p.name}</h3>
            <div class="product-meta">
                <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
                <span class="rating">★ ${p.rating}</span>
            </div>
            <button class="btn btn-primary btn-sm add-cart">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

searchInput.addEventListener('input', e => {
    prodState.search = e.target.value;
    renderProducts();
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        prodState.category = btn.dataset.category;
        renderProducts();
    });
});

priceRange.addEventListener('input', e => {
    prodState.maxPrice = Number(e.target.value);
    priceValue.textContent = `₹${prodState.maxPrice.toLocaleString('en-IN')}`;
    renderProducts();
});

sortSelect.addEventListener('change', e => {
    prodState.sort = e.target.value;
    renderProducts();
});

grid.addEventListener('click', e => {
    if (e.target.classList.contains('add-cart')) {
        e.target.textContent = 'Added';
        setTimeout(() => { e.target.textContent = 'Add to Cart'; }, 1000);
    }
});

renderProducts();