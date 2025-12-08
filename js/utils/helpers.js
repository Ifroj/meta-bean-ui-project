// Helper Utilities
export function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check for saved theme or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

export function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;
    
    // Check for saved language or use default
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    
    langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    });
    
    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'hi' ? 'rtl' : 'ltr');
        
        // Update button text
        langToggle.textContent = lang === 'en' ? 'हिंदी' : 'English';
        
        // Update all translatable elements
        updateTranslations(lang);
    }
    
    function updateTranslations(lang) {
        // This would typically load translation files
        // For now, we'll just update a few example elements
        
        const translations = {
            en: {
                'nav-home': 'Home',
                'nav-ranks': 'Ranks',
                'nav-training': 'Training',
                'nav-fitness': 'Fitness',
                'nav-gallery': 'Gallery',
                'nav-join': 'Join Army',
                'nav-login': 'Login'
            },
            hi: {
                'nav-home': 'होम',
                'nav-ranks': 'रैंक',
                'nav-training': 'प्रशिक्षण',
                'nav-fitness': 'फिटनेस',
                'nav-gallery': 'गैलरी',
                'nav-join': 'आर्मी जॉइन करें',
                'nav-login': 'लॉगिन'
            }
        };
        
        Object.keys(translations[lang]).forEach(key => {
            const element = document.querySelector(`[data-translate="${key}"]`);
            if (element) {
                element.textContent = translations[lang][key];
            }
        });
    }
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
            return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        default:
            return d.toLocaleDateString();
    }
}

export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isValidPhone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/[^\d+]/g, ''));
}

export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => false);
}

export function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

export function removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

export function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${getToastClass(type)}`;
    
    // Set icon based on type
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span class="font-medium">${message}</span>
            <button class="ml-4 text-white opacity-70 hover:opacity-100">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('translate-x-0');
    });
    
    // Close button
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }
    
    return toast;
}

function getToastClass(type) {
    switch (type) {
        case 'success': return 'bg-green-600 text-white';
        case 'error': return 'bg-red-600 text-white';
        case 'warning': return 'bg-yellow-600 text-white';
        default: return 'bg-blue-600 text-white';
    }
}

function removeToast(toast) {
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

export function createModal(content, options = {}) {
    const {
        title = '',
        size = 'md',
        closable = true,
        onClose = null
    } = options;
    
    // Remove existing modals
    const existingModals = document.querySelectorAll('.modal-overlay');
    existingModals.forEach(modal => modal.remove());
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = `modal bg-gray-900 rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${getModalSize(size)}`;
    
    // Create header if title exists
    let headerHTML = '';
    if (title) {
        headerHTML = `
            <div class="modal-header p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">${title}</h3>
                ${closable ? '<button class="modal-close text-gray-400 hover:text-white"><i class="fas fa-times"></i></button>' : ''}
            </div>
        `;
    } else if (closable) {
        headerHTML = `
            <div class="modal-header p-4 flex justify-end">
                <button class="modal-close text-gray-400 hover:text-white"><i class="fas fa-times"></i></button>
            </div>
        `;
    }
    
    // Set modal HTML
    modal.innerHTML = `
        ${headerHTML}
        <div class="modal-body p-4 overflow-auto max-h-[calc(90vh-120px)]">
            ${content}
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Add close functionality
    if (closable) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.body.style.overflow = 'auto';
            if (onClose) onClose();
        }, 300);
    }
    
    return {
        close: closeModal,
        element: modal.querySelector('.modal-body')
    };
}

function getModalSize(size) {
    switch (size) {
        case 'sm': return 'max-w-sm';
        case 'md': return 'max-w-md';
        case 'lg': return 'max-w-lg';
        case 'xl': return 'max-w-xl';
        case 'full': return 'max-w-full';
        default: return 'max-w-md';
    }
}

export function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => observer.observe(img));
}

export function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}