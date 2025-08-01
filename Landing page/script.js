document.addEventListener('DOMContentLoaded', () => {
    // Animated text cycling for the hero section
    const animatedText = document.getElementById('animated-text');
    if (animatedText) {
        const titles = ["amazing", "new", "wonderful", "beautiful", "smart"];
        let currentIndex = 0;

        function updateText() {
            // Fade out
            animatedText.classList.remove('text-visible');
            animatedText.classList.add('text-hidden');
            
            setTimeout(() => {
                // Update text
                currentIndex = (currentIndex + 1) % titles.length;
                animatedText.textContent = titles[currentIndex];
                
                // Fade in
                animatedText.classList.remove('text-hidden');
                animatedText.classList.add('text-visible');
            }, 250); // Corresponds to the transition duration
        }

        // Start the animation cycle
        setInterval(updateText, 2000);
    }

    // Tubelight Navbar scroll behavior
    const navbar = document.getElementById('tubelightNav');
    if (navbar) {
        navbar.classList.add('hidden');
        navbar.classList.remove('visible');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            } else {
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            }
        });
    }
});
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const getStartedBtn = document.getElementById('getStartedBtn');
const startJourneyBtn = document.getElementById('startJourneyBtn');
const watchDemoBtn = document.getElementById('watchDemoBtn');
const joinNowBtn = document.getElementById('joinNowBtn');

// Enhanced Interactive Features
class InteractiveEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceButtons();
        this.addSmoothScrolling();
        this.improveResponsiveness();
        this.initTubelightNavbar();
    }

    initTubelightNavbar() {
        const navItems = document.querySelectorAll('.nav-item');
        const navbar = document.getElementById('tubelightNav');
        
        // Ensure navbar starts hidden
        navbar.classList.add('hidden');
        navbar.classList.remove('visible');
        
        // Show navbar on scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            } else {
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Handle nav item clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Smooth scroll to section
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href) || document.querySelector('[id="' + href.substring(1) + '"]');
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Update active nav item based on scroll position
        const sections = ['home', 'features', 'about', 'pricing'];
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 200;
            
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
                const navItem = document.querySelector(`[data-nav="${sectionId}"]`);
                
                if (section && navItem) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navItems.forEach(nav => nav.classList.remove('active'));
                        navItem.classList.add('active');
                    }
                }
            });
        });
    }

    enhanceButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    improveResponsiveness() {
        // Add better mobile interactions
        const cards = document.querySelectorAll('.stat-card, .budget-card, .goal-item');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
}

// Mobile Navigation Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Button Click Handlers
getStartedBtn?.addEventListener('click', () => {
    showModal('Get Started', 'Welcome to Spendr! Sign up to begin your financial journey.');
});

startJourneyBtn?.addEventListener('click', () => {
    showModal('Start Your Journey', 'Ready to transform your finances? Let\'s get you set up!');
});

watchDemoBtn?.addEventListener('click', () => {
    showModal('Demo Video', 'Demo video would play here. See Spendr in action!');
});

joinNowBtn?.addEventListener('click', () => {
    showModal('Join Spendr', 'Join thousands of users building wealth with Spendr!');
});

// Modal System
function showModal(title, message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('customModal');
    if (!modal) {
        modal = createModal();
    }
    
    // Update modal content
    const modalTitle = modal.querySelector('.modal-title');
    const modalMessage = modal.querySelector('.modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"></h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-message"></p>
                <div class="modal-actions">
                    <button class="btn-primary modal-confirm">Get Started</button>
                    <button class="btn-secondary modal-cancel">Maybe Later</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: scale(1) translateY(0);
        }
        
        .modal-header {
            padding: 24px 24px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #8b5cf6;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: #94a3b8;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .modal-message {
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 24px;
            font-size: 1.1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .modal-actions button {
            flex: 1;
            min-width: 120px;
        }
        
        @media (max-width: 480px) {
            .modal-actions {
                flex-direction: column;
            }
            
            .modal-actions button {
                width: 100%;
            }
        }
    `;
    
    // Add styles to head if not already added
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', () => {
        // Here you would typically redirect to signup/login
        alert('Redirecting to signup page...');
        closeModal();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Navbar Visibility on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection.offsetHeight;
    
    if (window.scrollY > heroHeight * 0.8) {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
    } else {
        navbar.classList.remove('visible');
        navbar.classList.add('hidden');
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .dashboard-preview');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Dashboard Preview Interactive Elements
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.preview-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Add a subtle animation effect
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Enhanced Stats Counter Animation
function animateStatsCounter(element, originalText) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    let targetNumber;
    let suffix = '';
    let prefix = '';
    
    // Parse different formats
    if (originalText.includes('k+')) {
        targetNumber = parseInt(originalText.replace(/[^\d]/g, ''));
        suffix = 'k+';
    } else if (originalText.includes('Cr+')) {
        targetNumber = parseInt(originalText.replace(/[^\d]/g, ''));
        prefix = '₹';
        suffix = 'Cr+';
    } else if (originalText.includes('★')) {
        targetNumber = parseFloat(originalText.replace(/[^\d.]/g, ''));
        suffix = '★';
    } else {
        targetNumber = parseInt(originalText.replace(/[^\d]/g, ''));
    }
    
    let current = 0;
    const increment = targetNumber / 50;
    const isDecimal = originalText.includes('.');
    
    function updateCounter() {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
        }
        
        let displayValue;
        if (isDecimal) {
            displayValue = current.toFixed(1);
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = prefix + displayValue + suffix;
        
        if (current < targetNumber) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const originalText = stat.textContent;
                animateStatsCounter(stat, originalText);
            });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const contentStats = document.querySelector('.content-stats');
    if (contentStats) {
        statsObserver.observe(contentStats);
    }
});

// Budget Cards Animation
function animateBudgetCards() {
    const cards = document.querySelectorAll('.budget-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }, index * 200);
    });
}

// Progress Bars Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            bar.style.width = targetWidth;
        }, index * 300 + 500);
    });
}

// Goals Stats Animation
function animateGoalStats() {
    const goalStats = document.querySelectorAll('.goal-stat');
    goalStats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(30px) rotateX(45deg)';
            stat.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0) rotateX(0deg)';
            }, 100);
        }, index * 150);
    });
}

// Goal Items Animation
function animateGoalItems() {
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px) scale(0.95)';
            item.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) scale(1)';
            }, 100);
        }, index * 400);
    });
}

// Category Items Hover Effect
function addCategoryHoverEffects() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const progressFill = item.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.transform = 'scaleY(1.2)';
                progressFill.style.filter = 'brightness(1.2)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const progressFill = item.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.transform = 'scaleY(1)';
                progressFill.style.filter = 'brightness(1)';
            }
        });
    });
}

// Enhanced Base Object Hiding Function
function hideBaseObjects(robotSpline) {
    try {
        const splineApp = robotSpline.spline;
        if (splineApp) {
            console.log('Attempting to hide base objects...');
            
            // Method 1: Hide by common names
            const baseObjects = [
                'Rectangle', 'Base', 'Floor', 'Platform', 'Ground', 'Plane', 'Tiles',
                'Cube', 'Box', 'Surface', 'Stage', 'Stand', 'Pedestal', 'Foundation',
                'rectangle', 'base', 'floor', 'platform', 'ground', 'plane', 'tiles',
                'cube', 'box', 'surface', 'stage', 'stand', 'pedestal', 'foundation'
            ];
            
            if (splineApp.findObjectByName) {
                baseObjects.forEach(name => {
                    const obj = splineApp.findObjectByName(name);
                    if (obj) {
                        obj.visible = false;
                        console.log(`Hidden object by name: ${name}`);
                    }
                });
            }
            
            // Method 2: Hide objects by position and characteristics
            if (splineApp.scene && splineApp.scene.children) {
                splineApp.scene.children.forEach((child, index) => {
                    // Hide objects with suspicious names
                    if (child.name && (
                        child.name.toLowerCase().includes('base') ||
                        child.name.toLowerCase().includes('floor') ||
                        child.name.toLowerCase().includes('platform') ||
                        child.name.toLowerCase().includes('ground') ||
                        child.name.toLowerCase().includes('tile') ||
                        child.name.toLowerCase().includes('plane') ||
                        child.name.toLowerCase().includes('cube') ||
                        child.name.toLowerCase().includes('box') ||
                        child.name.toLowerCase().includes('rectangle') ||
                        child.name.toLowerCase().includes('surface')
                    )) {
                        child.visible = false;
                        console.log(`Hidden object by name pattern: ${child.name}`);
                    }
                    
                    // Hide objects positioned at the bottom (y < -2)
                    if (child.position && child.position.y < -2) {
                        child.visible = false;
                        console.log(`Hidden object by position: ${child.name || 'unnamed'} at y=${child.position.y}`);
                    }
                    
                    // Hide very large flat objects (likely platforms)
                    if (child.scale && (child.scale.x > 5 || child.scale.z > 5) && child.scale.y < 1) {
                        child.visible = false;
                        console.log(`Hidden large flat object: ${child.name || 'unnamed'}`);
                    }
                });
                
                // Method 3: Traverse deeper into the scene hierarchy
                const traverseAndHide = (object) => {
                    if (object.children) {
                        object.children.forEach(child => {
                            if (child.name && (
                                child.name.toLowerCase().includes('base') ||
                                child.name.toLowerCase().includes('platform') ||
                                child.name.toLowerCase().includes('floor') ||
                                child.name.toLowerCase().includes('ground')
                            )) {
                                child.visible = false;
                                console.log(`Hidden nested object: ${child.name}`);
                            }
                            traverseAndHide(child);
                        });
                    }
                };
                
                splineApp.scene.children.forEach(traverseAndHide);
            }
            
            // Method 4: Try alternative API methods
            if (splineApp.findObjectsByName) {
                baseObjects.forEach(name => {
                    const objects = splineApp.findObjectsByName(name);
                    if (objects && objects.length > 0) {
                        objects.forEach(obj => {
                            obj.visible = false;
                            console.log(`Hidden object via findObjectsByName: ${name}`);
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.log('Enhanced base hiding error:', error);
    }
}

// Enhanced Robot Integration
function initializeRobot() {
    const robotSpline = document.getElementById('robot-spline');
    const robotLoading = document.getElementById('robot-loading');
    
    if (robotSpline && robotLoading) {
        // Show loading initially
        robotLoading.style.opacity = '1';
        robotLoading.style.visibility = 'visible';
        
        // Listen for Spline load event
        robotSpline.addEventListener('load', function() {
            // Hide loading state
            setTimeout(() => {
                robotLoading.style.opacity = '0';
                setTimeout(() => {
                    robotLoading.style.visibility = 'hidden';
                }, 500);
            }, 1000);
            
            // Wait a bit more for scene to fully initialize before hiding objects
            setTimeout(() => {
                hideBaseObjects(robotSpline);
            }, 2000);
            
            // Also try immediate hiding in case the scene is already ready
            setTimeout(() => {
                hideBaseObjects(robotSpline);
            }, 500);
        });
        
        // Handle loading errors
        robotSpline.addEventListener('error', function() {
            robotLoading.innerHTML = `
                <div class="text-center text-white">
                    <div class="text-red-400 text-4xl mb-4">⚠️</div>
                    <p class="text-lg font-medium">Failed to load robot</p>
                    <p class="text-sm text-gray-400 mt-2">Please check your connection and try again</p>
                </div>
            `;
        });
        
        // Fallback timeout
        setTimeout(() => {
            if (robotLoading.style.opacity !== '0') {
                robotLoading.style.opacity = '0';
                setTimeout(() => {
                    robotLoading.style.visibility = 'hidden';
                }, 500);
            }
        }, 10000); // 10 second timeout
    }
}

// Financial Command Center Functionality
function initFinancialDashboard() {
    // Initialize 3D tilt effects for holo panels
    initHoloPanelTilt();
    
    // Animate matrix bars when section comes into view
    initMatrixBarAnimations();
    
    // Initialize command buttons
    initCommandButtons();
    
    // Initialize goal bubble interactions
    initGoalBubbles();
}

// 3D Tilt Effect for Holo Panels
function initHoloPanelTilt() {
    const holoPanels = document.querySelectorAll('[data-tilt]');
    
    holoPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Matrix Bar Animations
function initMatrixBarAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const matrixItems = entry.target.querySelectorAll('.matrix-item');
                
                matrixItems.forEach((item, index) => {
                    const bar = item.querySelector('.matrix-bar');
                    const width = bar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        bar.style.setProperty('--width', width + '%');
                    }, index * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const dashboard = document.getElementById('financial-dashboard');
    if (dashboard) {
        observer.observe(dashboard);
    }
}

// Command Button Interactions
function initCommandButtons() {
    const cmdButtons = document.querySelectorAll('.cmd-btn');
    
    cmdButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const command = button.getAttribute('data-cmd');
            
            // Add click effect
            button.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
            
            // Simulate command execution
            showCommandFeedback(command);
        });
    });
}

// Command Feedback System
function showCommandFeedback(command) {
    const commandInput = document.querySelector('.command-input .typing-text');
    const originalText = commandInput.textContent;
    
    const commands = {
        'budget': 'budget_set --amount=50000 --category=monthly',
        'goal': 'goal_create --target="New Car" --amount=800000',
        'analyze': 'analyze_complete --generating_report...'
    };
    
    commandInput.textContent = commands[command] || 'command_executed';
    
    setTimeout(() => {
        commandInput.textContent = originalText;
    }, 3000);
}

// Goal Bubble Interactions
function initGoalBubbles() {
    const goalBubbles = document.querySelectorAll('.goal-bubble');
    
    goalBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: 50%;
                top: 50%;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            bubble.style.position = 'relative';
            bubble.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced Intersection Observer for animations
const sectionAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('budget-section')) {
                animateBudgetCards();
                setTimeout(animateProgressBars, 800);
                sectionAnimationObserver.unobserve(target);
            }
            
            if (target.classList.contains('goals-section')) {
                animateGoalStats();
                setTimeout(animateGoalItems, 600);
                sectionAnimationObserver.unobserve(target);
            }
            
            if (target.id === 'financial-dashboard') {
                initFinancialDashboard();
                sectionAnimationObserver.unobserve(target);
            }
        }
    });
}, {
    threshold: 0.2
});

// Dashboard Tab Switching
function initDashboardTabs() {
    const navItems = document.querySelectorAll('.dashboard-preview .nav-item');
    const tabContents = document.querySelectorAll('.dashboard-preview .tab-content');
    
    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const targetTab = navItem.getAttribute('data-tab');
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked nav item
            navItem.classList.add('active');
            
            // Show corresponding tab content
            const targetContent = document.getElementById(`${targetTab}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialize interactive enhancements
let interactiveEnhancements;

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize interactive features
    interactiveEnhancements = new InteractiveEnhancements();
    
    const budgetSection = document.querySelector('.budget-section');
    const goalsSection = document.querySelector('.goals-section');
    
    if (budgetSection) sectionAnimationObserver.observe(budgetSection);
    if (goalsSection) sectionAnimationObserver.observe(goalsSection);
    
    // Add hover effects
    addCategoryHoverEffects();
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize everything when DOM is loaded
    initializeRobot();
    initializeNavbar();
    initializePricing();
});

// Pricing functionality
function initializePricing() {
    const toggle = document.getElementById('billing-toggle');
    if (toggle) {
        toggle.addEventListener('change', toggleBilling);
    }
}

function toggleBilling() {
    const toggle = document.getElementById('billing-toggle');
    const isAnnual = toggle.checked;
    const priceAmounts = document.querySelectorAll('.price-amount');
    const billingPeriods = document.querySelectorAll('.billing-period');
    const billingInfos = document.querySelectorAll('.billing-info');
    const dot = document.querySelector('.dot');
    
    // Animate toggle dot
    if (dot) {
        if (isAnnual) {
            dot.style.transform = 'translateX(24px)';
            dot.style.backgroundColor = '#8b5cf6'; // cyber-purple
        } else {
            dot.style.transform = 'translateX(0)';
            dot.style.backgroundColor = '#ffffff';
        }
    }
    
    // Update prices with animation
    priceAmounts.forEach(priceElement => {
        const monthlyPrice = priceElement.getAttribute('data-monthly');
        const yearlyPrice = priceElement.getAttribute('data-yearly');
        
        if (monthlyPrice && yearlyPrice) {
            // Add fade out effect
            priceElement.style.opacity = '0.5';
            priceElement.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                priceElement.textContent = isAnnual ? yearlyPrice : monthlyPrice;
                // Fade back in
                priceElement.style.opacity = '1';
                priceElement.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    // Update billing period text
    billingPeriods.forEach(period => {
        period.textContent = isAnnual ? 'per year' : 'per month';
    });
    
    // Update billing info text
    billingInfos.forEach(info => {
        info.textContent = isAnnual ? 'billed annually' : 'billed monthly';
    });
    
    // Add confetti effect for annual selection
    if (isAnnual) {
        createConfetti();
    }
}

// Simple confetti effect
function createConfetti() {
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'confetti-fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add loading animation for buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = originalText;
            }, 1000);
        }
    });
});

// Add button loading styles
const buttonStyles = `
    .btn-primary.loading, .btn-secondary.loading {
        pointer-events: none;
        opacity: 0.8;
    }
`;

const buttonStyleSheet = document.createElement('style');
buttonStyleSheet.textContent = buttonStyles;
document.head.appendChild(buttonStyleSheet);

console.log('Spendr Landing Page Loaded Successfully! 🚀');
