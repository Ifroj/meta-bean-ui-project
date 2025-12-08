// Main JavaScript File
import { loadPage, setupNavigation } from '../modules/router.js';
import { setupMobileMenu } from '../modules/mobile-menu.js';
import { setupSmoothScroll } from '../modules/smooth-scroll.js';
import { setupFAQAccordion } from '../modules/faq-accordion.js';
import { setupFormValidation } from '../modules/form-validation.js';
import { setupThemeToggle, setupLanguageToggle } from '../utils/helpers.js';

// Initialize the application
class IndianArmyHub {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Load components
            await this.loadComponents();
            
            // Setup modules
            this.setupModules();
            
            // Load initial page
            await loadPage('home');
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Indian Army Hub initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    async loadComponents() {
        // Load header
        await fetch('components/header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header').innerHTML = html;
            })
            .catch(error => console.error('Error loading header:', error));

        // Load footer
        await fetch('components/footer.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('footer').innerHTML = html;
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    setupModules() {
        setupMobileMenu();
        setupSmoothScroll();
        setupFAQAccordion();
        setupFormValidation();
        setupNavigation();
        setupThemeToggle();
        setupLanguageToggle();
    }

    setupEventListeners() {
        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Gallery filter
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                this.filterGallery(filterValue);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleContactFormSubmit(contactForm);
            });
        }

        // Join form submission
        const joinForm = document.getElementById('joinForm');
        if (joinForm) {
            joinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleJoinFormSubmit(joinForm);
            });
        }

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLoginFormSubmit(loginForm);
            });
        }
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    async handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showNotification('Message sent successfully! We will get back to you soon.', 'success');
            
            // Reset form
            form.reset();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleJoinFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Application submitted successfully! We will review your application and contact you soon.', 'success');
            
            // Reset form
            form.reset();
        } catch (error) {
            this.showNotification('Failed to submit application. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleLoginFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            // Simulate redirect
            setTimeout(() => {
                loadPage('dashboard');
            }, 1000);
            
            // Reset form
            form.reset();
        } catch (error) {
            this.showNotification('Invalid credentials. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`;
        notification.style.transform = 'translateX(100%)';
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${icon} text-white text-lg"></i>
                <span class="text-white font-medium">${message}</span>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close on click
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Initialize gallery modal
    setupGalleryModal() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('galleryModal');
        
        if (!modal || galleryItems.length === 0) return;
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openGalleryModal(index);
            });
        });
        
        // Close modal on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeGalleryModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeGalleryModal();
            }
        });
    }

    openGalleryModal(index) {
        const modal = document.getElementById('galleryModal');
        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-description');
        
        // Get gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        const currentItem = galleryItems[index];
        
        // Set modal content
        const imageSrc = currentItem.querySelector('img').src;
        const title = currentItem.querySelector('.gallery-title')?.textContent || 'Image';
        const description = currentItem.querySelector('.gallery-category')?.textContent || '';
        
        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        
        // Store current index
        modal.setAttribute('data-current-index', index);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGalleryModal() {
        const modal = document.getElementById('galleryModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    navigateGallery(direction) {
        const modal = document.getElementById('galleryModal');
        const currentIndex = parseInt(modal.getAttribute('data-current-index') || 0);
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = galleryItems.length - 1;
        if (newIndex >= galleryItems.length) newIndex = 0;
        
        this.openGalleryModal(newIndex);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndianArmyHub();
});

// Export for testing
export default IndianArmyHub;