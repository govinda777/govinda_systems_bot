// Govinda Bot Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- MODAL ---
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close');

    function showModal(icon, title, text) {
        document.getElementById('modal-icon').innerHTML = icon;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').innerHTML = text; // Use innerHTML to allow for line breaks
        modal.classList.add('active');
    }

    function hideModal() {
        modal.classList.remove('active');
    }

    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scrolling for navigation links
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 70; // Height of fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                header.style.borderBottom = '1px solid var(--color-border)';
            } else {
                header.style.background = 'transparent';
                header.style.boxShadow = 'none';
                header.style.borderBottom = '1px solid transparent';
            }
        });
    }

    // Blue Ocean Strategy Chart - Animate on Scroll
    const chartCanvas = document.getElementById('blueOceanChart');
    if (chartCanvas) {
        const createChart = () => {
            const ctx = chartCanvas.getContext('2d');
            const chartData = {
                labels: ['Chatbots Tradicionais', 'Soluções SaaS', 'Govinda Bot Web3'],
                datasets: [
                    {
                        label: 'Propriedade do Cliente',
                        data: [2, 3, 10],
                        backgroundColor: 'rgba(109, 40, 217, 0.2)',
                        borderColor: 'rgba(109, 40, 217, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Inovação Tecnológica',
                        data: [4, 6, 10],
                        backgroundColor: 'rgba(34, 211, 238, 0.2)',
                        borderColor: 'rgba(34, 211, 238, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Descentralização',
                        data: [1, 2, 10],
                        backgroundColor: 'rgba(249, 115, 22, 0.2)',
                        borderColor: 'rgba(249, 115, 22, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Modelo Econômico',
                        data: [3, 5, 10],
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Customização',
                        data: [5, 7, 10],
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2
                    }
                ]
            };

            new Chart(ctx, {
                type: 'radar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    family: 'Inter',
                                    size: 12
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Comparativo: Govinda Bot vs Concorrentes',
                            font: {
                                family: 'Inter',
                                size: 16,
                                weight: '600'
                            },
                            padding: {
                                top: 0,
                                bottom: 20
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                backdropColor: 'transparent',
                                color: 'rgba(0, 0, 0, 0.5)'
                            },
                            pointLabels: {
                                font: {
                                    family: 'Inter',
                                    size: 11,
                                    weight: '500'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            angleLines: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 4,
                            hoverRadius: 6
                        },
                        line: {
                            borderWidth: 2,
                            tension: 0.1
                        }
                    }
                }
            });
        };

        const chartObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createChart();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        chartObserver.observe(chartCanvas);
    }

    // CTA Button Actions - Fixed to work properly
    setupCTAButtons();

    // Scroll animations (fade in on scroll)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.step, .feature-card, .pricing-card, .feature, .security-item, .dao-value');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for hero stats
    const stats = document.querySelectorAll('.stat__number');
    const animateCounters = function() {
        stats.forEach(stat => {
            const target = stat.textContent;
            if (target === '100%') {
                animateCounter(stat, 0, 100, '%');
            } else if (target === '∞') {
                // Keep infinity symbol as is
                return;
            } else if (target === 'NFT') {
                // Keep NFT as is
                return;
            }
        });
    };

    const animateCounter = function(element, start, end, suffix = '') {
        let current = start;
        const increment = (end - start) / 60; // 60 frames
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16); // ~60fps
    };

    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 500);
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        heroObserver.observe(heroSection);
    }

    // Setup footer links
    setupFooterLinks();

// Setup CTA Buttons - Fixed function
function setupCTAButtons() {
    // Get all buttons and add event listeners based on their text content
    const allButtons = document.querySelectorAll('button, .btn');
    
    allButtons.forEach(button => {
        const buttonText = button.textContent.trim();
        
        // NFT Purchase buttons
        if (buttonText.includes('Comprar NFT') || buttonText.includes('Comprar Pacote')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showNFTModal();
            });
        }
        
        // Privy Login buttons  
        if (buttonText.includes('Login Privy')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handlePrivyLogin();
            });
        }
        
        // Token purchase buttons
        if (buttonText.includes('Comprar Tokens')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showTokenModal();
            });
        }
        
        // Demo buttons
        if (buttonText.includes('Ver Demonstração')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showDemoModal();
            });
        }
    });
}

// Setup footer links
function setupFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer__section a, .footer__social a');
    
    footerLinks.forEach(link => {
        const linkText = link.textContent.trim();
        const href = link.getAttribute('href');
        
        // Handle specific footer links
        if (linkText === 'Discord' || href === '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (linkText === 'Discord') {
                    showDiscordModal();
                } else if (linkText === 'Telegram') {
                    showTelegramModal();
                } else if (linkText === 'GitHub') {
                    showGitHubModal();
                } else if (linkText === 'Documentação') {
                    showDocsModal();
                } else {
                    showModal('🔗', 'Link em Construção', 'Este link será ativado em breve!');
                }
            });
        }
    });
}

// Modal functions (placeholders - would integrate with actual Web3 functionality)
function showNFTModal() {
    showModal('🚀', 'Marketplace NFT', 'Redirecionando para nossa plataforma de compra de NFTs onde você poderá adquirir seu passe vitalício do Govinda Bot!<br><br><b>Benefícios do NFT:</b><br>• Acesso vitalício ao chatbot<br>• Criação ilimitada de fluxos<br>• Configuração personalizada<br>• Suporte premium');
}

function handlePrivyLogin() {
    showModal('🔐', 'Privy Login', 'Conectando com Privy.io para autenticação descentralizada...<br><br><b>Segurança garantida:</b><br>• Autenticação Web3<br>• Controle total dos dados<br>• Sem senhas centralizadas');
}

function showTokenModal() {
    showModal('🪙', 'Loja de Tokens', 'Compre tokens para créditos do sistema!<br><br><b>Benefícios:</b><br>• Sistema flexível de créditos<br>• Staking para recompensas<br>• Participação na governança DAO<br>• Sem mensalidades fixas');
}

function showDemoModal() {
    showModal('🎯', 'Demonstração Interativa', 'Conheça todas as funcionalidades do Govinda Bot:<br><br><b>Recursos disponíveis:</b><br>• Fluxos complexos de atendimento<br>• LLM especializado<br>• Respostas contextualizadas<br>• Interface visual intuitiva');
}

function showDiscordModal() {
    showModal('💬', 'Comunidade Discord', 'Junte-se à nossa comunidade no Discord!<br><br><b>Benefícios:</b><br>• Suporte em tempo real<br>• Networking com outros usuários<br>• Atualizações exclusivas<br>• Participação em eventos');
}

function showTelegramModal() {
    showModal('📱', 'Canal Telegram', 'Siga nosso canal oficial no Telegram!<br><br><b>Conteúdo:</b><br>• Notícias e atualizações<br>• Tutoriais e dicas<br>• Anúncios importantes<br>• Suporte direto');
}

function showGitHubModal() {
    showModal('💻', 'Código Open Source', 'Confira nosso código no GitHub!<br><br><b>Disponível:</b><br>• Documentação técnica<br>• Código fonte<br>• Guias de contribuição<br>• Issues e roadmap');
}

function showDocsModal() {
    showModal('📚', 'Documentação Técnica', 'Acesse nossa documentação completa!<br><br><b>Conteúdo:</b><br>• Guias de instalação<br>• API Reference<br>• Tutoriais passo a passo<br>• FAQ técnico');
}

});

// Utility function for smooth animations
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Add loading state for buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Carregando...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Form validation (if needed for contact forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Cleaned-up ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.querySelectorAll(".btn, button");
buttons.forEach(button => {
    button.addEventListener("click", createRipple);
});