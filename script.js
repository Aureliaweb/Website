document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // 1. Scroll-based Navbar Class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 2. Active Link Highlighting on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // 3. Hamburger Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Animate hamburger to X
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });
        
        // Close menu when a link is clicked (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // 4. Contact/Feedback Form Tabs Toggling
    const tabBtns = document.querySelectorAll('.form-tab-btn');
    const formPanes = document.querySelectorAll('.form-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            formPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(`${targetTab}-pane`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
    
    // 5. Star Rating System
    const starBtns = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('feedback-rating');
    
    starBtns.forEach(star => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            const ratingValue = star.getAttribute('data-value');
            if (ratingInput) {
                ratingInput.value = ratingValue;
            }
            
            // Highlight stars up to clicked one
            starBtns.forEach(s => {
                const sValue = s.getAttribute('data-value');
                if (parseInt(sValue) <= parseInt(ratingValue)) {
                    s.style.color = '#eab308'; // filled star yellow
                } else {
                    s.style.color = '#e2e8f0'; // empty star light grey
                }
            });
        });
        
        // Add basic hover styling helpers
        star.addEventListener('mouseenter', () => {
            const ratingValue = star.getAttribute('data-value');
            starBtns.forEach(s => {
                const sValue = s.getAttribute('data-value');
                if (parseInt(sValue) <= parseInt(ratingValue)) {
                    s.style.borderColor = '#eab308';
                }
            });
        });
    });
    
    // 6. Form Submission Handlers (FormSubmit.co Integration)
    const contactForm = document.getElementById('contact-form-el');
    const feedbackForm = document.getElementById('feedback-form-el');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const alertBox = document.getElementById('contact-alert');
            
            // Show sending status
            const btn = contactForm.querySelector('button[type="submit"]');
            const origText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Prepare form data
            const formData = new FormData(contactForm);
            const endpoint = contactForm.getAttribute('action') || 'https://formsubmit.co/ajax/aureliagroup.contact@gmail.com';
            
            fetch(endpoint, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => response.json())
            .then(data => {
                btn.disabled = false;
                btn.innerHTML = origText;
                alertBox.style.display = 'block';
                
                if (data.success === "true" || data.success === true) {
                    alertBox.className = 'form-alert success';
                    alertBox.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your project inquiry has been submitted successfully to <strong>aureliagroup.contact@gmail.com</strong>.';
                    contactForm.reset();
                } else if (data.message && data.message.toLowerCase().includes('activate')) {
                    alertBox.className = 'form-alert success';
                    alertBox.innerHTML = '<i class="fas fa-envelope-open-text"></i> <strong>First-Time Activation Required:</strong> FormSubmit sent an automated verification link to <strong>aureliagroup.contact@gmail.com</strong>. Please check your Gmail inbox (or Spam/Promotions folder) and click <strong>"Activate Form"</strong> to start receiving all client inquiries!';
                } else {
                    alertBox.className = 'form-alert success';
                    alertBox.innerHTML = '<i class="fas fa-check-circle"></i> Submission processed! ' + (data.message || 'If this is your first submission, please check aureliagroup.contact@gmail.com to click the one-time Activate Form link.');
                    contactForm.reset();
                }
                
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 10000);
            })
            .catch(error => {
                btn.disabled = false;
                btn.innerHTML = origText;
                alertBox.style.display = 'block';
                alertBox.className = 'form-alert error';
                alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Submission failed: ' + error.message;
            });
        });
    }
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const alertBox = document.getElementById('feedback-alert');
            
            // Show submitting status
            const btn = feedbackForm.querySelector('button[type="submit"]');
            const origText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            // Prepare form data
            const formData = new FormData(feedbackForm);
            const endpoint = feedbackForm.getAttribute('action') || 'https://formsubmit.co/ajax/aureliagroup.contact@gmail.com';
            
            fetch(endpoint, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => response.json())
            .then(data => {
                btn.disabled = false;
                btn.innerHTML = origText;
                alertBox.style.display = 'block';
                
                if (data.success === "true" || data.success === true) {
                    alertBox.className = 'form-alert success';
                    alertBox.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your feedback! It has been delivered to <strong>aureliagroup.contact@gmail.com</strong>.';
                    feedbackForm.reset();
                    starBtns.forEach(s => { s.style.color = '#ffffff'; });
                    if (ratingInput) ratingInput.value = '5';
                } else {
                    alertBox.className = 'form-alert success';
                    alertBox.innerHTML = '<i class="fas fa-envelope-open-text"></i> ' + (data.message || 'Feedback sent! Please check aureliagroup.contact@gmail.com for the one-time FormSubmit activation link if needed.');
                    feedbackForm.reset();
                }
                
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 10000);
            })
            .catch(error => {
                btn.disabled = false;
                btn.innerHTML = origText;
                alertBox.style.display = 'block';
                alertBox.className = 'form-alert error';
                alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Submission failed: ' + error.message;
            });
        });
    }

    // 7. Project Modal Popup & Auto-Fill System
    const projectDetails = {
        'restaurant-services': {
            title: 'Restaurant Services',
            subtitle: 'Fine Dining Digital Experience — The Golden Fork',
            badge: 'E-Commerce',
            overview: 'A full multi-page restaurant website for "The Golden Fork" — a premium fine dining brand. Features online ordering with cart management, a digital menu, table reservations with step-by-step booking, catering & event management, and a franchise application portal.',
            features: [
                'Online food ordering with real-time cart, item customizer, delivery/pickup toggle, and checkout flow.',
                'Interactive digital menu with category filters and instant add-to-cart functionality.',
                'Step-by-step table reservation system with party size picker and time slot selector.',
                'Catering & events portal with package selection and quote request form.',
                'Franchise opportunity page with investment calculator and application form.'
            ],
            tags: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Multi-Page App', 'E-Commerce', 'Responsive Design'],
            impact: '6+ Interactive Pages with Full Restaurant Management Features'
        },
        'car-prediction': {
            title: 'Car Price Predictor',
            subtitle: 'Valuation & Estimations ML Model',
            badge: 'Machine Learning',
            overview: 'An intelligent machine learning regression model engineered to calculate the fair market buying and selling prices of vehicles based on key input parameters.',
            features: [
                'Processes multiple parameters: mileage, manufacturing year, fuel type (Petrol/Diesel/CNG), transmission, and ownership history.',
                'Trained on extensive automotive datasets using Random Forest & Gradient Boosting Regressors.',
                'Instant valuation outputs with price ranges for both vehicle buyers and sellers.',
                'Clean web interface for instant parameter selection and graphical data insights.'
            ],
            tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Flask API', 'Machine Learning'],
            impact: '94.8% Regression Accuracy on Real Vehicle Datasets'
        },
        'maternity-monitor': {
            title: 'Maternity Monitor',
            subtitle: 'Trimester Tracking & Health Care Portal',
            badge: 'Health-Tech',
            overview: 'A specialized digital health system designed to help pregnant women monitor their pregnancy journey week-by-week with comprehensive medical guidance and risk estimation.',
            features: [
                'Detailed knowledge base covering physical changes, nutrition, and care for each trimester.',
                'Precise Estimated Date of Delivery (EDD) calculator estimating exact delivery day and month.',
                'Clinical risk factor assessment engine evaluating vitals, blood pressure, and maternal history.',
                'Symptom logger, appointment tracking reminders, and vital signs monitoring.'
            ],
            tags: ['React.js', 'HTML5/CSS3', 'JavaScript', 'Chart.js', 'Health Analytics Engine'],
            impact: '100% Comprehensive Knowledge Base & Early Risk Indicators'
        },
        'exam-portal': {
            title: 'NGO Practical Exam Portal',
            subtitle: 'Simulator-Based Assessment Platform',
            badge: 'Education & NGOs',
            overview: 'A robust, role-based examination management platform built specifically for non-governmental organizations to conduct theoretical and hands-on practical exams for students.',
            features: [
                'Multi-role access system with distinct workflows for Admin, Teacher, and Student users.',
                'Integrated interactive simulator enabling practical skill-based examinations directly inside the browser.',
                'Automated grading engine for multiple-choice tests and teacher review queue for practical submissions.',
                'Student progress tracking, digital certificates, and detailed NGO performance analytics.'
            ],
            tags: ['Web Technologies', 'Role-Based Access Control (RBAC)', 'Web Simulator JS Engine', 'SQL Database'],
            impact: 'Over 10,000+ Student Examinations Successfully Conducted'
        },
        'mis-system': {
            title: 'Multi-Tenant MIS System',
            subtitle: 'Corporate & NGO Enterprise Reporting',
            badge: 'Enterprise Management',
            overview: 'An all-in-one Management Information System (MIS) engineered for corporate enterprises and NGOs to aggregate operational data, generate automated reports, and track organizational assets.',
            features: [
                'Centralized data aggregation across branches, departments, and field offices.',
                'Automated report generation module with customizable filters and PDF/Excel exports.',
                'Resource allocation tracking, staff/volunteer management, and inventory logs.',
                'Interactive executive dashboard with real-time KPI visualization.'
            ],
            tags: ['Enterprise Architecture', 'RESTful API', 'PostgreSQL / MySQL', 'Data Visualization'],
            impact: '10x Faster Organizational Reporting & Zero Manual Log Errors'
        },
        'birthday-maker': {
            title: 'Birthday Celebration Maker',
            subtitle: 'Personalized Greeting & Memory Portal',
            badge: 'Event Tech',
            overview: 'A custom interactive birthday platform allowing clients to create personalized celebration websites complete with countdown timers, photo timelines, audio players, and guest message walls.',
            features: [
                'Interactive photo timeline showcasing memorable moments with custom caption cards.',
                'Live countdown timer to midnight with surprise video and message reveals.',
                'Digital guestbook allowing friends and family to submit wishes and photos.',
                'Embedded audio player for customized background music playlists.'
            ],
            tags: ['HTML5', 'CSS3 / Animations', 'JavaScript ES6+', 'Local Storage', 'Web Audio API'],
            impact: '100% Unique & Personal Memory Experiences for Clients'
        },
        'career-guidance': {
            title: 'Career Guidance Portal',
            subtitle: 'Stream Recommendation & Aptitude Advisory',
            badge: 'EdTech',
            overview: 'A comprehensive career path advisory platform empowering students and job seekers to discover ideal academic streams and career paths through aptitude assessments and structured roadmaps.',
            features: [
                'Interactive aptitude assessment engine evaluating analytical, creative, and technical skills.',
                'Algorithmic stream matching recommending engineering, IT, medical, and management streams.',
                'Step-by-step career path roadmaps detailing required degrees, certifications, and skills.',
                'Integrated mentor directory and college entrance exam preparation resources.'
            ],
            tags: ['Full-Stack JavaScript', 'Node.js', 'Algorithm Logic', 'REST API', 'MySQL'],
            impact: 'Guided 5,000+ Students to Clear Educational & Skill Roadmaps'
        },
        'maths-solver': {
            title: 'Maths Equation Solver',
            subtitle: 'Step-by-Step Solver & 2D Grapher',
            badge: 'AI Computation',
            overview: 'An advanced mathematical computing web application that parses algebraic, calculus, and arithmetic equations, delivering clear step-by-step solutions and 2D function graphs.',
            features: [
                'LaTeX & natural math expression input parser for intuitive typing of formulas.',
                'Step-by-step solver engine explaining algebraic simplifications, derivatives, and integrals.',
                'Interactive 2D graph plotting engine for polynomial, trigonometric, and exponential curves.',
                'Built-in formula reference library and practice quiz generator for math students.'
            ],
            tags: ['Python / SymPy', 'MathJax / LaTeX', 'Chart.js / Canvas', 'JavaScript', 'Flask API'],
            impact: 'Solved Over 50,000+ Complex Math Problems for Students'
        }
    };

    const misDetails = {
        'corporate': {
            title: 'Corporate MIS System',
            subtitle: 'Enterprise Resource Planning & Multi-Branch Reporting',
            badge: 'Corporate Enterprise',
            url: 'https://corporate-mis.vercel.app/',
            overview: 'A high-performance Corporate Management Information System (MIS) engineered for companies and multi-branch enterprises to unify department operations, employee KPI tracking, financial reporting, and executive decision-making dashboards.',
            features: [
                'Multi-department operational reporting (Sales, Operations, HR, Finance, and IT).',
                'Employee performance tracking, attendance logs, and automated shift analytics.',
                'Enterprise Resource Planning (ERP) pipeline & real-time inventory management.',
                'Executive KPI dashboard with customizable PDF/Excel export capabilities.'
            ],
            tags: ['Corporate ERP', 'Department Analytics', 'SQL Enterprise DB', 'Role-Based Access (RBAC)'],
            impact: '10x Faster Operational Reporting & 100% Audit Compliance'
        },
        'ngo': {
            title: 'NGO-MIS System',
            subtitle: 'Non-Profit Field Operations & Impact Tracking Portal',
            badge: 'NGO & Non-Profit',
            url: 'https://ngo-mis.vercel.app/',
            overview: 'A specialized Management Information System tailored for NGOs, charities, and non-profits to measure field program impact, manage volunteers, track donor funds/grants, and generate transparent beneficiary outcome reports.',
            features: [
                'Beneficiary outcome & field program social impact tracking modules.',
                'Volunteer roster management, hours logging, and field assignment dispatch.',
                'Donor grant tracking, fund allocation logs, and transparent financial audit reporting.',
                'Offline/Online mobile sync engine for field agents operating in remote locations.'
            ],
            tags: ['Non-Profit Tech', 'Social Impact Dashboards', 'Donor & Grant Tracking', 'Volunteer Systems'],
            impact: 'Empowered 50+ NGO Field Campaigns & Transparent Audit Reporting'
        }
    };

    const projectCards = document.querySelectorAll('.kpi-card[data-project]');
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.project-modal-close');
    const modalBackdrop = document.querySelector('.project-modal-backdrop');
    const modalInquireBtn = document.getElementById('modal-inquire-btn');
    const contactTypeInput = document.getElementById('contact-type');
    const misSelector = document.getElementById('modal-mis-selector');
    const btnCorporateMis = document.getElementById('btn-corporate-mis');
    const btnNgoMis = document.getElementById('btn-ngo-mis');

    let currentProjectTitle = '';

    function bindInquireClick() {
        const inquireBtns = document.querySelectorAll('#modal-inquire-btn');
        inquireBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                closeModal();
                if (contactTypeInput) {
                    contactTypeInput.value = currentProjectTitle;
                }
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function renderModalContent(data) {
        if (!data) return;
        currentProjectTitle = data.title;
        
        document.getElementById('modal-badge').textContent = data.badge;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-subtitle').textContent = data.subtitle;
        document.getElementById('modal-overview').textContent = data.overview;
        document.getElementById('modal-impact').textContent = data.impact;

        const modalFooter = document.querySelector('.project-modal-footer');
        if (modalFooter) {
            if (data.url) {
                modalFooter.innerHTML = `
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; width: 100%;">
                        <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1.2; text-align: center; text-decoration: none; font-weight: 600; font-size: 0.95rem;">
                            🚀 Launch ${data.title} <i class="fas fa-external-link-alt" style="margin-left: 6px;"></i>
                        </a>
                        <button id="modal-inquire-btn" class="btn btn-outline" style="flex: 1;">
                            Inquire <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                `;
            } else {
                modalFooter.innerHTML = `
                    <button id="modal-inquire-btn" class="btn btn-primary" style="width:100%;">
                        Inquire / Request Custom Solution <i class="fas fa-paper-plane"></i>
                    </button>
                `;
            }
            bindInquireClick();
        }

        // Features
        const featuresList = document.getElementById('modal-features');
        featuresList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            featuresList.appendChild(li);
        });

        // Tags
        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'modal-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    function selectMisSubtype(type) {
        if (type === 'ngo') {
            if (btnNgoMis) btnNgoMis.classList.add('active');
            if (btnCorporateMis) btnCorporateMis.classList.remove('active');
            renderModalContent(misDetails['ngo']);
        } else {
            if (btnCorporateMis) btnCorporateMis.classList.add('active');
            if (btnNgoMis) btnNgoMis.classList.remove('active');
            renderModalContent(misDetails['corporate']);
        }
    }

    if (btnCorporateMis) {
        btnCorporateMis.addEventListener('click', () => selectMisSubtype('corporate'));
    }

    if (btnNgoMis) {
        btnNgoMis.addEventListener('click', () => selectMisSubtype('ngo'));
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');

            // If card has a real URL (not javascript:void), let it navigate directly
            if (href && href !== 'javascript:void(0)' && href !== '#') {
                return; // allow default link navigation
            }

            e.preventDefault();
            const projectId = card.getAttribute('data-project');
            const data = projectDetails[projectId];

            if (data && modal) {
                if (projectId === 'mis-system') {
                    if (misSelector) misSelector.style.display = 'flex';
                    selectMisSubtype('corporate'); // default to corporate on open
                } else {
                    if (misSelector) misSelector.style.display = 'none';
                    renderModalContent(data);
                }

                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    if (modalInquireBtn) {
        modalInquireBtn.addEventListener('click', () => {
            closeModal();
            if (contactTypeInput) {
                contactTypeInput.value = currentProjectTitle;
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
