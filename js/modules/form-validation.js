// Form Validation Module
export function setupFormValidation() {
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupForm(contactForm);
    }
    
    // Join form validation
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        setupForm(joinForm);
    }
    
    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupForm(loginForm);
    }
    
    // Newsletter form validation
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        setupNewsletterForm(newsletterForm);
    }
}

function setupForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        // Add validation on blur
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        // Clear error on input
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Form is valid, you can submit it here
            console.log('Form is valid, submitting...');
            // form.submit(); // Uncomment to actually submit
        }
    });
}

function setupNewsletterForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitBtn) return;
    
    emailInput.addEventListener('blur', () => {
        validateEmail(emailInput);
    });
    
    emailInput.addEventListener('input', () => {
        clearError(emailInput);
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateEmail(emailInput)) {
            // Show success message
            showFormMessage(form, 'Thank you for subscribing!', 'success');
            emailInput.value = '';
            
            // Reset after 3 seconds
            setTimeout(() => {
                clearFormMessage(form);
            }, 3000);
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name || input.id;
    
    // Check if required field is empty
    if (input.required && !value) {
        showError(input, `${getFieldName(name)} is required`);
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[^\d+]/g, ''))) {
            showError(input, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // URL validation
    if (type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            showError(input, 'Please enter a valid URL');
            return false;
        }
    }
    
    // Minimum length validation
    const minLength = input.getAttribute('minlength');
    if (minLength && value.length < minLength) {
        showError(input, `Minimum ${minLength} characters required`);
        return false;
    }
    
    // Maximum length validation
    const maxLength = input.getAttribute('maxlength');
    if (maxLength && value.length > maxLength) {
        showError(input, `Maximum ${maxLength} characters allowed`);
        return false;
    }
    
    // Pattern validation
    const pattern = input.getAttribute('pattern');
    if (pattern && value) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
            const title = input.getAttribute('title') || 'Please match the requested format';
            showError(input, title);
            return false;
        }
    }
    
    // Clear error if validation passes
    clearError(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    
    if (!value) {
        showError(input, 'Email address is required');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearError(input);
    return true;
}

function showError(input, message) {
    clearError(input);
    
    const error = document.createElement('div');
    error.className = 'error-message text-red-400 text-sm mt-1';
    error.textContent = message;
    
    input.classList.add('border-red-500');
    input.parentNode.appendChild(error);
}

function clearError(input) {
    input.classList.remove('border-red-500');
    
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

function showFormMessage(form, message, type = 'success') {
    clearFormMessage(form);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message p-3 rounded-lg mt-3 ${type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`;
    messageDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    form.appendChild(messageDiv);
}

function clearFormMessage(form) {
    const message = form.querySelector('.form-message');
    if (message) {
        message.remove();
    }
}

function getFieldName(name) {
    // Convert camelCase or snake_case to readable text
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}