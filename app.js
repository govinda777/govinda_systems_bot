// Govinda Bot Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Blue Ocean Strategy Chart
    const chartCanvas = document.getElementById('blueOceanChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        const chartData = {
            labels: ['Chatbots Tradicionais', 'Soluções SaaS', 'Govinda Bot Web3'],
            datasets: [
                {
                    label: 'Propriedade do Cliente',
                    data: [2, 3, 10],
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 2
                },
                {
                    label: 'Inovação Tecnológica',
                    data: [4, 6, 10],
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    borderWidth: 2
                },
                {
                    label: 'Descentralização',
                    data: [1, 2, 10],
                    backgroundColor: '#B4413C',
                    borderColor: '#B4413C',
                    borderWidth: 2
                },
                {
                    label: 'Modelo Econômico',
                    data: [3, 5, 10],
                    backgroundColor: '#5D878F',
                    borderColor: '#5D878F',
                    borderWidth: 2
                },
                {
                    label: 'Customização',
                    data: [5, 7, 10],
                    backgroundColor: '#DB4545',
                    borderColor: '#DB4545',
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
                            font: {
                                family: 'Inter',
                                size: 10
                            }
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
});

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
                    alert('🔗 Link em construção\n\nEste link será ativado em breve!');
                }
            });
        }
    });
}

// Modal functions (placeholders - would integrate with actual Web3 functionality)
function showNFTModal() {
    alert('🚀 Marketplace NFT\n\nRedirecionando para nossa plataforma de compra de NFTs onde você poderá adquirir seu passe vitalício do Govinda Bot!\n\n✨ Benefícios do NFT:\n• Acesso vitalício ao chatbot\n• Criação ilimitada de fluxos\n• Configuração personalizada\n• Suporte premium');
}

function handlePrivyLogin() {
    alert('🔐 Privy Login\n\nConectando com Privy.io para autenticação descentralizada...\n\n🛡️ Segurança garantida:\n• Autenticação Web3\n• Controle total dos dados\n• Sem senhas centralizadas');
}

function showTokenModal() {
    alert('🪙 Loja de Tokens\n\nCompre tokens para créditos do sistema!\n\n💰 Benefícios:\n• Sistema flexível de créditos\n• Staking para recompensas\n• Participação na governança DAO\n• Sem mensalidades fixas');
}

function showDemoModal() {
    alert('🎯 Demonstração Interativa\n\nConheça todas as funcionalidades do Govinda Bot:\n\n🤖 Recursos disponíveis:\n• Fluxos complexos de atendimento\n• LLM especializado\n• Respostas contextualizadas\n• Interface visual intuitiva');
}

function showDiscordModal() {
    alert('💬 Comunidade Discord\n\nJunte-se à nossa comunidade no Discord!\n\n🎮 Benefícios:\n• Suporte em tempo real\n• Networking com outros usuários\n• Atualizações exclusivas\n• Participação em eventos');
}

function showTelegramModal() {
    alert('📱 Canal Telegram\n\nSiga nosso canal oficial no Telegram!\n\n📢 Conteúdo:\n• Notícias e atualizações\n• Tutoriais e dicas\n• Anúncios importantes\n• Suporte direto');
}

function showGitHubModal() {
    alert('💻 Código Open Source\n\nConfira nosso código no GitHub!\n\n🔧 Disponível:\n• Documentação técnica\n• Código fonte\n• Guias de contribuição\n• Issues e roadmap');
}

function showDocsModal() {
    alert('📚 Documentação Técnica\n\nAcesse nossa documentação completa!\n\n📖 Conteúdo:\n• Guias de instalação\n• API Reference\n• Tutoriais passo a passo\n• FAQ técnico');
}

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

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.tagName === 'BUTTON') {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        if (!button.style.position || button.style.position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.6;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);