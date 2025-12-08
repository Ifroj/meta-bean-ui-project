// Router Module
const pages = {
    'home': 'pages/home.html',
    'ranks': 'pages/ranks.html',
    'training': 'pages/training.html',
    'fitness': 'pages/fitness.html',
    'gallery': 'pages/gallery.html',
    'contact': 'pages/contact.html',
    'join': 'pages/join-army.html',
    'events': 'pages/events.html',
    'login': 'pages/login.html',
    'dashboard': 'pages/dashboard.html',
    'about': 'pages/about.html',
    'faq': 'pages/faq.html'
};

const pageTitles = {
    'home': 'Home | Indian Army Hub',
    'ranks': 'Ranks & Badges | Indian Army Hub',
    'training': 'Training Programs | Indian Army Hub',
    'fitness': 'Fitness Guide | Indian Army Hub',
    'gallery': 'Gallery | Indian Army Hub',
    'contact': 'Contact | Indian Army Hub',
    'join': 'Join Indian Army | Indian Army Hub',
    'events': 'Events & Camps | Indian Army Hub',
    'login': 'Login | Indian Army Hub',
    'dashboard': 'Dashboard | Indian Army Hub',
    'about': 'About Indian Army | Indian Army Hub',
    'faq': 'FAQ | Indian Army Hub'
};

export async function loadPage(pageName) {
    const pagePath = pages[pageName];
    
    if (!pagePath) {
        console.error(`Page "${pageName}" not found`);
        await loadErrorPage();
        return;
    }
    
    try {
        // Show loading state
        showLoading();
        
        // Load page content
        const response = await fetch(pagePath);
        
        if (!response.ok) {
            throw new Error(`Failed to load page: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Update page content
        document.getElementById('page-content').innerHTML = html;
        
        // Update page title
        document.title = pageTitles[pageName] || 'Indian Army Hub';
        
        // Update URL
        history.pushState({ page: pageName }, '', `#${pageName}`);
        
        // Initialize page-specific scripts
        initializePage(pageName);
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
            });


        
    } catch (error) {
        console.error('Error loading page:', error);
        await loadErrorPage();
    } finally {
        hideLoading();
    }
}

async function loadErrorPage() {
    try {
        const response = await fetch('pages/404.html');
        const html = await response.text();
        document.getElementById('page-content').innerHTML = html;
        document.title = 'Page Not Found | Indian Army Hub';
    } catch {
        document.getElementById('page-content').innerHTML = `
            <section class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-orange-500 mb-4">404 - Page Not Found</h1>
                    <p class="text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
                    <button onclick="loadPage('home')" class="btn btn-primary">
                        Go to Homepage
                    </button>
                </div>
            </section>
        `;
    }
}

function showLoading() {
    let loader = document.getElementById('page-loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-white">Loading...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    loader.style.display = 'flex';
}

function hideLoading() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function initializePage(pageName) {
    // Re-initialize all modules for the new page
    import('./mobile-menu.js').then(module => module.setupMobileMenu());
    import('./smooth-scroll.js').then(module => module.setupSmoothScroll());
    import('./faq-accordion.js').then(module => module.setupFAQAccordion());
    import('./form-validation.js').then(module => module.setupFormValidation());
    
    // Page-specific initialization
    switch (pageName) {
        case 'gallery':
            initializeGallery();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
        case 'login':
            initializeLogin();
            break;
    }
    
    // Update active nav link
    updateActiveNavLink(pageName);
}

function updateActiveNavLink(pageName) {
    const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === pageName || linkHref === `pages/${pageName}.html`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initializeGallery() {
    // Gallery modal functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    modal.id = 'galleryModal';
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <button class="modal-nav modal-prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="modal-nav modal-next">
                <i class="fas fa-chevron-right"></i>
            </button>
            <img class="modal-image" src="" alt="">
            <div class="modal-info">
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems);
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openModal(index);
        });
    });
    
    function openModal(index) {
        const item = images[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.textContent || '';
        const desc = item.querySelector('.gallery-category')?.textContent || '';
        
        modal.querySelector('.modal-image').src = img.src;
        modal.querySelector('.modal-image').alt = img.alt;
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-description').textContent = desc;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function navigate(direction) {
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        openModal(currentImageIndex);
    }
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-prev').addEventListener('click', () => navigate(-1));
    modal.querySelector('.modal-next').addEventListener('click', () => navigate(1));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

function initializeDashboard() {
    // Dashboard charts and widgets
    console.log('Dashboard initialized');
    
    // Update progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = `${value}%`;
    });
    
    // Update statistics
    updateDashboardStats();
}

function updateDashboardStats() {
    // Simulate updating dashboard statistics
    const stats = {
        progress: 85,
        completed: 12,
        upcoming: 3,
        grade: 'A+'
    };
    
    Object.keys(stats).forEach(key => {
        const element = document.querySelector(`.stat-${key}`);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function initializeLogin() {
    // Login form enhancements
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Add remember me functionality
        const rememberCheckbox = loginForm.querySelector('#remember');
        if (rememberCheckbox) {
            const savedUsername = localStorage.getItem('rememberedUsername');
            if (savedUsername) {
                loginForm.querySelector('#username').value = savedUsername;
                rememberCheckbox.checked = true;
            }
            
            rememberCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    const username = loginForm.querySelector('#username').value;
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }
            });
        }
        
        // Add password toggle
        const passwordInput = loginForm.querySelector('#password');
        const passwordToggle = document.createElement('button');
        passwordToggle.type = 'button';
        passwordToggle.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400';
        passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
        
        if (passwordInput) {
            passwordInput.parentNode.classList.add('relative');
            passwordInput.parentNode.appendChild(passwordToggle);
            
            passwordToggle.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                passwordToggle.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
    }
}

export function setupNavigation() {
    // Handle navigation links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            loadPage(pageName);
        }
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        } else {
            loadPage('home');
        }
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (pages[hash]) {
            loadPage(hash);
        }
    });
    
    // Load initial page based on hash
    const initialHash = window.location.hash.slice(1);
    if (pages[initialHash]) {
        loadPage(initialHash);
    } else {
        loadPage('home');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        })
        .catch(err => console.error("Header Load Error:", err));
});
