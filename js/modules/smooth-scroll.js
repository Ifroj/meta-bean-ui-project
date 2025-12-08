// Smooth Scroll Module
export function setupSmoothScroll() {
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            // Get target element
            const target = document.querySelector(href);
            if (!target) return;
            
            // Prevent default anchor click behavior
            e.preventDefault();
            
            // Calculate scroll position
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;
            
            // Smooth scroll to target
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL hash
            history.pushState(null, null, href);
            
            // Update active nav link
            updateActiveNavLink(href);
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink(hash) {
        const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-link');
        
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href');
            if (linkHash === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);
    
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    }
    
    // Call once on load
    highlightActiveSection();
}