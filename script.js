// Combined JavaScript for both pages

// Page navigation functions
function showLandingPage() {
    document.getElementById('landing-page').classList.add('active');
    document.getElementById('dashboard-page').classList.remove('active');
}

function showAuthView(type = 'login') {
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('dashboard-page').classList.add('active');
    
    if (type === 'signup') {
        showSignup();
    } else {
        showLogin();
    }
}

function showDashboardView() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
}

// DOM Elements
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const welcomeText = document.getElementById('welcome');
const avatar = document.getElementById('avatar');
const avatarInitials = document.getElementById('avatar-initials');
const userRole = document.getElementById('user-role');
const projectsContainer = document.getElementById('projects');
const notification = document.getElementById('notification');
const suggestionsGrid = document.getElementById('suggestions-grid');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const projectFormModal = document.getElementById('projectFormModal');
const profileModal = document.getElementById('profileModal');
const demoModal = document.getElementById('demo-modal');
const confirmationModal = document.getElementById('confirmationModal');

// Project statuses
const STATUS_NOT_STARTED = "Not Started";
const STATUS_IN_PROGRESS = "In Progress";
const STATUS_COMPLETED = "Completed";

// Project priorities
const PRIORITY_LOW = "Low";
const PRIORITY_MEDIUM = "Medium";
const PRIORITY_HIGH = "High";

// Project categories
const CATEGORY_WEB = "Web Development";
const CATEGORY_MOBILE = "Mobile App";
const CATEGORY_DESIGN = "UI/UX Design";
const CATEGORY_MARKETING = "Marketing";

// Project suggestions
const projectSuggestions = [
    { title: "Portfolio Website", description: "Create a personal portfolio to showcase your work", category: CATEGORY_WEB },
    { title: "E-commerce Mobile App", description: "Design and develop an online shopping app", category: CATEGORY_MOBILE },
    { title: "Social Media Dashboard", description: "Analytics dashboard for social media metrics", category: CATEGORY_WEB },
    { title: "Brand Identity Design", description: "Create a complete brand identity package", category: CATEGORY_DESIGN },
    { title: "Email Marketing Campaign", description: "Plan and execute an email marketing strategy", category: CATEGORY_MARKETING },
    { title: "Task Management System", description: "Build a custom task management solution", category: CATEGORY_WEB },
    { title: "Fitness Tracking App", description: "Mobile app for tracking workouts and nutrition", category: CATEGORY_MOBILE },
    { title: "User Onboarding Flow", description: "Design an intuitive user onboarding experience", category: CATEGORY_DESIGN }
];

// User accounts storage
let userAccounts = JSON.parse(localStorage.getItem('userAccounts')) || [];
let currentUser = null;
let recoveryUser = null;
let editingProjectId = null;
let confirmationCallback = null;

// Show notification
function showNotification(message, isSuccess = false) {
    notification.innerHTML = `<i class="${isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i> ${message}`;
    notification.classList.toggle('success', isSuccess);
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Toggle between signup and login
function showSignup() {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'flex';
}

function showLogin() {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
}

// Signup function
function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const securityKey = document.getElementById('signup-security-key').value;
    
    if (!username || !email || !password || !securityKey) return showNotification('Please fill all fields');
    if (username.length < 3) return showNotification('Username must be at least 3 characters');
    if (password.length < 6) return showNotification('Password must be at least 6 characters');
    if (securityKey.length !== 6 || !/^\d+$/.test(securityKey)) return showNotification('Security Key must be a 6-digit number');
    if (userAccounts.find(user => user.username === username)) return showNotification('Username already exists');
    
    const newUser = {
        username, email, password, securityKey,
        name: username, role: "Project Manager",
        createdAt: new Date().toISOString(),
        lastUsernameChange: null, 
        projects: [], 
        avatar: null,
        hasInitializedProjects: false
    };
    
    userAccounts.push(newUser);
    localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
    showNotification('Account created successfully! You can now sign in.', true);
    showLogin();
    document.getElementById('signup-container').querySelector('form').reset();
}

// Login function
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) return showNotification('Please enter both username and password');
    
    const user = userAccounts.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        welcomeText.textContent = `Welcome, ${user.name}`;
        userRole.textContent = user.role;
        avatarInitials.textContent = user.name.substring(0, 2).toUpperCase();
        
        loadProjects();
        loadSuggestions();
        initFilters();
        showDashboardView();
    } else {
        showNotification('Invalid username or password');
    }
}

// Demo login function
function viewDemo() {
    let demoUser = userAccounts.find(u => u.username === 'demo');
    if (!demoUser) {
        demoUser = {
            username: 'demo', email: 'demo@projectflow.com', password: 'demopassword', securityKey: '123456',
            name: 'Demo User', role: "Project Manager", createdAt: new Date().toISOString(), lastUsernameChange: null, 
            projects: [
                createProject("Website Revamp", "Complete redesign of company website with modern UI/UX and improved performance", CATEGORY_WEB, 75, STATUS_IN_PROGRESS, PRIORITY_HIGH),
                createProject("Mobile Banking App", "Development of secure banking application for iOS and Android platforms", CATEGORY_MOBILE, 35, STATUS_IN_PROGRESS, PRIORITY_HIGH),
                createProject("Q3 Marketing Campaign", "Integrated marketing campaign for new product launch across digital channels", CATEGORY_MARKETING, 100, STATUS_COMPLETED, PRIORITY_MEDIUM),
                createProject("E-commerce Platform UI", "User interface redesign for online store to improve conversion rates", CATEGORY_DESIGN, 50, STATUS_IN_PROGRESS, PRIORITY_HIGH),
                createProject("API Integration Project", "Integrate third-party services with our core platform through REST APIs", CATEGORY_WEB, 20, STATUS_NOT_STARTED, PRIORITY_MEDIUM)
            ], 
            avatar: null,
            hasInitializedProjects: true
        };
        userAccounts.push(demoUser);
        localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
    }
    document.getElementById('login-username').value = 'demo';
    document.getElementById('login-password').value = 'demopassword';
    login();
    showNotification('Logged in as demo user', true);
}

// Logout function
function logout() {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    showLandingPage();
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showNotification('You have been logged out', true);
}

// Initialize filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            filterProjects(button.dataset.filter);
        });
    });
}

// Filter projects
function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const status = card.dataset.status;
        const priority = card.dataset.priority;
        let show = false;
        switch(filter) {
            case 'all': 
                show = true; 
                break;
            case 'active': 
                show = (status === STATUS_IN_PROGRESS || status === STATUS_NOT_STARTED); 
                break;
            case 'completed': 
                show = (status === STATUS_COMPLETED); 
                break;
            case 'high-priority': 
                show = (priority === PRIORITY_HIGH); 
                break;
        }
        card.style.display = show ? 'flex' : 'none';
    });
}

// Load projects
function loadProjects() {
    projectsContainer.innerHTML = '';
    
    if (!currentUser.hasInitializedProjects && (!currentUser.projects || currentUser.projects.length === 0)) {
        currentUser.projects = [
            createProject("Website Revamp", "Complete redesign of company website with modern UI/UX and improved performance", CATEGORY_WEB, 75, STATUS_IN_PROGRESS, PRIORITY_HIGH),
            createProject("Mobile Banking App", "Development of secure banking application for iOS and Android platforms", CATEGORY_MOBILE, 35, STATUS_IN_PROGRESS, PRIORITY_HIGH),
            createProject("Q3 Marketing Campaign", "Integrated marketing campaign for new product launch across digital channels", CATEGORY_MARKETING, 100, STATUS_COMPLETED, PRIORITY_MEDIUM),
            createProject("E-commerce Platform UI", "User interface redesign for online store to improve conversion rates", CATEGORY_DESIGN, 50, STATUS_IN_PROGRESS, PRIORITY_HIGH),
            createProject("API Integration Project", "Integrate third-party services with our core platform through REST APIs", CATEGORY_WEB, 20, STATUS_NOT_STARTED, PRIORITY_MEDIUM)
        ];
        currentUser.hasInitializedProjects = true;
        saveUserData();
    }

    if (!currentUser.projects) currentUser.projects = [];

    currentUser.projects.forEach(project => {
        const projectCard = document.createElement('article');
        projectCard.className = 'project-card';
        projectCard.dataset.status = project.status;
        projectCard.dataset.priority = project.priority;
        projectCard.dataset.category = project.category;
        
        projectCard.innerHTML = `
            <header class="project-header">
                <div class="project-icon ${project.icon}"><i class="${getProjectIcon(project.category)}" aria-hidden="true"></i></div>
                <div class="project-info"><h3>${project.name}</h3><p>${project.description}</p></div>
            </header>
            <div class="project-body">
                <div class="project-meta">
                    <div class="project-status"><span class="status-dot ${getStatusClass(project.status)}"></span>${project.status}</div>
                    <div>Priority: <strong>${project.priority}</strong></div>
                </div>
                <div class="progress-container" role="progressbar" aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${project.name} progress">
                    <div class="progress-bar" style="width: ${project.progress}%; background-color: ${project.color};"></div>
                </div>
                <div class="project-stats">
                    <div class="stat"><div class="stat-value">${project.tasks}</div><div class="stat-label">Tasks</div></div>
                    <div class="stat"><div class="stat-value">${project.progress}%</div><div class="stat-label">Progress</div></div>
                    <div class="stat"><div class="stat-value">${project.members}</div><div class="stat-label">Members</div></div>
                </div>
            </div>
            <div class="project-actions">
                <button class="action-btn edit" onclick="editProject('${project.id}')" aria-label="Edit ${project.name}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteProject('${project.id}')" aria-label="Delete ${project.name}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
    
    const addCard = document.createElement('div');
    addCard.className = 'add-project-card';
    addCard.onclick = addProject;
    addCard.setAttribute('role', 'button');
    addCard.setAttribute('tabindex', '0');
    addCard.innerHTML = `<i class="fas fa-plus-circle" aria-hidden="true"></i><h3>Create New Project</h3><p>Start a new project to organize your tasks</p>`;
    addCard.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') addProject(); });
    projectsContainer.appendChild(addCard);
}

function getProjectIcon(category) {
    const icons = { [CATEGORY_WEB]: "fas fa-globe", [CATEGORY_MOBILE]: "fas fa-mobile-alt", [CATEGORY_DESIGN]: "fas fa-palette", [CATEGORY_MARKETING]: "fas fa-bullhorn" };
    return icons[category] || "fas fa-project-diagram";
}

function getStatusClass(status) {
    const classes = { [STATUS_NOT_STARTED]: "status-not-started", [STATUS_IN_PROGRESS]: "status-in-progress", [STATUS_COMPLETED]: "status-completed" };
    return classes[status] || "";
}

function createProject(name, description, category, progress, status, priority) {
    const icons = ["project-icon-1", "project-icon-2", "project-icon-3", "project-icon-4"];
    const colors = ["#ff6b6b", "#4cc9f0", "#ffd166", "#9d4edd", "#2a9d8f"];
    
    // Realistic task counts based on project size
    const taskCounts = {
        small: { min: 5, max: 15 },
        medium: { min: 15, max: 30 },
        large: { min: 30, max: 50 }
    };
    
    // Realistic team sizes based on project complexity
    const teamSizes = {
        small: { min: 2, max: 4 },
        medium: { min: 4, max: 8 },
        large: { min: 8, max: 12 }
    };
    
    // Determine project size
    let size = "medium";
    if (priority === PRIORITY_HIGH && progress < 30) size = "large";
    if (priority === PRIORITY_LOW || progress > 80) size = "small";
    
    return {
        id: 'project-' + Date.now() + Math.random().toString(36).substr(2, 9),
        name, 
        description, 
        category, 
        progress,
        icon: icons[Math.floor(Math.random() * icons.length)],
        tasks: Math.floor(Math.random() * (taskCounts[size].max - taskCounts[size].min)) + taskCounts[size].min,
        members: Math.floor(Math.random() * (teamSizes[size].max - teamSizes[size].min)) + teamSizes[size].min,
        color: colors[Math.floor(Math.random() * colors.length)],
        status: status || STATUS_NOT_STARTED,
        priority: priority || PRIORITY_MEDIUM,
        createdAt: new Date().toISOString()
    };
}

function saveUserData() {
    const index = userAccounts.findIndex(u => u.username === currentUser.username);
    if (index !== -1) {
        userAccounts[index] = currentUser;
        localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
    }
}

function addProject() {
    editingProjectId = null;
    document.getElementById('projectFormTitle').textContent = 'Create New Project';
    document.getElementById('projectFormSubmit').textContent = 'Create Project';
    document.getElementById('projectFormModal').querySelector('form').reset();
    document.getElementById('project-progress-value').textContent = '0';
    projectFormModal.style.display = 'flex';
}

function editProject(projectId) {
    const project = currentUser.projects.find(p => p.id === projectId);
    if (project) {
        editingProjectId = projectId;
        document.getElementById('projectFormTitle').textContent = 'Edit Project';
        document.getElementById('projectFormSubmit').textContent = 'Update Project';
        
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-category').value = project.category;
        document.getElementById('project-status').value = project.status;
        document.getElementById('project-priority').value = project.priority;
        document.getElementById('project-tasks').value = project.tasks;
        document.getElementById('project-members').value = project.members;
        document.getElementById('project-progress').value = project.progress;
        document.getElementById('project-progress-value').textContent = project.progress;
        document.getElementById('project-color').value = project.color;
        
        projectFormModal.style.display = 'flex';
    }
}

function saveProject() {
    const name = document.getElementById('project-name').value;
    if (!name) return showNotification('Project name is required');
    
    const projectData = {
        name,
        description: document.getElementById('project-description').value,
        category: document.getElementById('project-category').value,
        status: document.getElementById('project-status').value,
        priority: document.getElementById('project-priority').value,
        tasks: parseInt(document.getElementById('project-tasks').value),
        members: parseInt(document.getElementById('project-members').value),
        progress: parseInt(document.getElementById('project-progress').value),
        color: document.getElementById('project-color').value,
    };
    
    if (editingProjectId) {
        const projectIndex = currentUser.projects.findIndex(p => p.id === editingProjectId);
        if (projectIndex !== -1) currentUser.projects[projectIndex] = { ...currentUser.projects[projectIndex], ...projectData };
        showNotification('Project updated successfully!', true);
    } else {
        const newProject = createProject(projectData.name, projectData.description, projectData.category, projectData.progress, projectData.status, projectData.priority);
        Object.assign(newProject, { tasks: projectData.tasks, members: projectData.members, color: projectData.color });
        currentUser.projects.push(newProject);
        showNotification('Project created successfully!', true);
    }
    
    saveUserData();
    loadProjects();
    closeModal(projectFormModal);
}

function showConfirmationModal(message, callback) {
    document.getElementById('confirmation-message').textContent = message;
    confirmationCallback = callback;
    confirmationModal.style.display = 'flex';
}

function deleteProject(projectId) {
    showConfirmationModal('Are you sure you want to delete this project?', () => {
        currentUser.projects = currentUser.projects.filter(p => p.id !== projectId);
        saveUserData();
        loadProjects();
        showNotification('Project deleted successfully!', true);
    });
}

function deleteAccount() {
    showConfirmationModal('Are you sure you want to delete your account? This action is permanent and cannot be undone.', () => {
        userAccounts = userAccounts.filter(u => u.username !== currentUser.username);
        localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
        showNotification('Account deleted successfully', true);
        logout();
    });
}

function loadSuggestions() {
    suggestionsGrid.innerHTML = '';
    const shuffled = [...projectSuggestions].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    shuffled.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `<h4>${suggestion.title}</h4><p>${suggestion.description}</p><div class="project-meta" style="margin-top: 10px;"><div class="project-status">${suggestion.category}</div></div>`;
        card.addEventListener('click', () => {
            currentUser.projects.push(createProject(suggestion.title, suggestion.description, suggestion.category, 0, STATUS_NOT_STARTED, PRIORITY_MEDIUM));
            saveUserData();
            loadProjects();
            showNotification(`Project "${suggestion.title}" created!`, true);
        });
        suggestionsGrid.appendChild(card);
    });
}

function refreshSuggestions() {
    loadSuggestions();
    showNotification('Suggestions refreshed!', true);
}

function openProfileModal() {
    if (!currentUser) return;
    
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-role').textContent = currentUser.role;
    document.getElementById('profile-username').value = currentUser.username;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('security-key').value = currentUser.securityKey;
    document.getElementById('profile-initials').textContent = currentUser.name.substring(0, 2).toUpperCase();
    
    profileModal.style.display = 'flex';
}

function openForgotPassword() {
    forgotPasswordModal.style.display = 'flex';
    resetForgotPasswordModal();
}

function resetForgotPasswordModal() {
    document.getElementById('verify-form').style.display = 'block';
    document.getElementById('otp-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'none';
    document.getElementById('recovery-username').value = '';
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
    
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.remove('active');
}

function verifyUser() {
    const username = document.getElementById('recovery-username').value;
    if (!username) return showNotification('Please enter your username');
    
    const user = userAccounts.find(u => u.username === username);
    if (!user) return showNotification('User not found');
    
    recoveryUser = user;
    document.getElementById('verify-form').style.display = 'none';
    document.getElementById('otp-form').style.display = 'block';
    document.getElementById('step2').classList.add('active');
}

function verifySecurityKey() {
    const securityKey = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
    if (securityKey.length !== 6) return showNotification('Please enter a valid 6-digit security key');
    if (securityKey !== recoveryUser.securityKey) return showNotification('Invalid security key');
    
    document.getElementById('otp-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'block';
    document.getElementById('step3').classList.add('active');
}

function resetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!newPassword || !confirmPassword) return showNotification('Please fill both password fields');
    if (newPassword !== confirmPassword) return showNotification('Passwords do not match');
    if (newPassword.length < 6) return showNotification('Password must be at least 6 characters');
    
    const userIndex = userAccounts.findIndex(u => u.username === recoveryUser.username);
    if (userIndex !== -1) {
        userAccounts[userIndex].password = newPassword;
        localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
        showNotification('Password reset successfully!', true);
        closeModal(forgotPasswordModal);
    }
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password-profile').value;
    const confirmPassword = document.getElementById('confirm-password-profile').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) return showNotification('Please fill all password fields');
    if (newPassword !== confirmPassword) return showNotification('New passwords do not match');
    if (currentPassword !== currentUser.password) return showNotification('Current password is incorrect');
    
    currentUser.password = newPassword;
    saveUserData();
    showNotification('Password updated successfully!', true);
}

function changeSecurityKey() {
    const securityKey = document.getElementById('security-key').value;
    
    if (!securityKey) return showNotification('Security key is required');
    if (securityKey.length !== 6 || !/^\d+$/.test(securityKey)) return showNotification('Security Key must be a 6-digit number');
    
    currentUser.securityKey = securityKey;
    saveUserData();
    showNotification('Security Key updated successfully!', true);
}

function toggleUsernameEdit() {
    const usernameInput = document.getElementById('profile-username');
    const editBtn = document.getElementById('edit-username-btn');
    
    if (usernameInput.readOnly) {
        usernameInput.readOnly = false;
        editBtn.textContent = 'Save';
    } else {
        const newUsername = usernameInput.value.trim();
        if (!newUsername) return showNotification('Username cannot be empty');
        if (newUsername === currentUser.username) {
            usernameInput.readOnly = true;
            editBtn.textContent = 'Edit';
            return;
        }
        
        if (userAccounts.find(u => u.username === newUsername && u.username !== currentUser.username)) {
            return showNotification('Username already taken');
        }
        
        currentUser.username = newUsername;
        saveUserData();
        usernameInput.readOnly = true;
        editBtn.textContent = 'Edit';
        showNotification('Username updated successfully!', true);
    }
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `projectflow-data-${currentUser.username}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification('Data exported successfully!', true);
}

function closeModal(modalElement) {
    if (modalElement && modalElement.classList.contains('modal')) {
        modalElement.style.display = 'none';
    } else {
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    new Chart(document.getElementById('progressChart').getContext('2d'), {
        type: 'doughnut',
        data: { datasets: [{ data: [75, 25], backgroundColor: ['#4361ee', '#e0eafc'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });

    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(e.target); });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card, .step, .testimonial-card, .section-title').forEach(el => observer.observe(el));
    
    document.getElementById('search-projects').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.project-card').forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        });
    });
    
    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
        input.addEventListener('input', () => { if (input.value && index < inputs.length - 1) inputs[index + 1].focus(); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !input.value && index > 0) inputs[index - 1].focus(); });
    });
    
    document.getElementById('project-progress').addEventListener('input', (e) => { 
        document.getElementById('project-progress-value').textContent = e.target.value; 
    });
    
    document.getElementById('projectFormSubmit').addEventListener('click', saveProject);
    
    document.getElementById('confirm-action-btn').addEventListener('click', () => {
        if (typeof confirmationCallback === 'function') {
            confirmationCallback();
        }
        closeModal(confirmationModal);
        confirmationCallback = null;
    });
});