// Variáveis globais
let lastScroll = 0;
let ticking = false;
let header = null;

// Função para inicializar os componentes
function initComponents() {
    header = document.querySelector('header');
    
    // Mostra o conteúdo quando a página estiver totalmente carregada
    document.body.style.opacity = '1';
    
    // Inicializa outras funcionalidades
    initScrollHandler();
    initJobListings();
    initSearchFunctionality();
    initDropdowns();
}

// Inicializa o manipulador de rolagem
function initScrollHandler() {
    if (!header) return;
    
    // Mostra o header quando a página carrega se estiver no topo
    if (window.scrollY <= 10) {
        header.classList.add('visible');
    } else {
        header.classList.add('scrolled');
    }
}

// Função otimizada para o scroll
function handleScroll() {
    lastScroll = window.scrollY;
    
    // Usa requestAnimationFrame para melhor performance
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Se estiver no topo, mostra o header
            if (lastScroll <= 10) {
                header.classList.add('visible');
                header.classList.remove('hidden');
            } 
            // Se estiver rolando para cima, mostra o header
            else if (lastScroll < window.scrollY) {
                header.classList.add('hidden');
                header.classList.remove('visible');
            } 
            // Se estiver rolando para baixo, esconde o header
            else {
                header.classList.add('visible');
                header.classList.remove('hidden');
            }
            
            // Adiciona sombra quando o header está visível e não está no topo
            if (lastScroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
}

// Adiciona os event listeners quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    // DOM já está pronto
    initComponents();
}

// Adiciona o event listener para o scroll
window.addEventListener('scroll', handleScroll, { passive: true });

// Inicializa a lista de vagas
function initJobListings() {
    // Dados das vagas (pode ser carregado via API no futuro)
    const jobs = [
        {
            id: 1,
            title: 'Chefe de Cozinha',
            company: 'Restaurante Sabor & Arte',
            location: 'São Paulo, SP',
            type: 'Tempo Integral',
            salary: 'R$ 8.000 - R$ 10.000',
            date: 'Há 2 dias',
            description: 'Estamos buscando um Chefe de Cozinha experiente para liderar nossa equipe e garantir a excelência em todos os pratos servidos.'
        },
        {
            id: 2,
            title: 'Confeiteiro(a)',
            company: 'Doces Delícias',
            location: 'Rio de Janeiro, RJ',
            type: 'Meio Período',
            salary: 'R$ 3.000 - R$ 4.000',
            date: 'Há 1 semana',
            description: 'Procuramos um(a) confeiteiro(a) criativo(a) para preparar sobremesas e doces especiais para nosso cardápio.'
        },
        {
            id: 3,
            title: 'Garçom/Garçonete',
            company: 'Bistrô Francês',
            location: 'Belo Horizonte, MG',
            type: 'Tempo Integral',
            salary: 'R$ 2.500 + gorjetas',
            date: 'Há 3 dias',
            description: 'Vaga para garçom/garçonete com experiência em restaurantes requintados. Necessário conhecimento em vinhos.'
        },
        {
            id: 4,
            title: 'Auxiliar de Cozinha',
            company: 'Comida Caseira Ltda',
            location: 'Curitiba, PR',
            type: 'Estágio',
            salary: 'R$ 1.500',
            date: 'Há 5 dias',
            description: 'Vaga para auxiliar de cozinha em restaurante familiar. Ótima oportunidade para quem está começando na área.'
        },
        {
            id: 5,
            title: 'Barista',
            company: 'Café Aconchego',
            location: 'Porto Alegre, RS',
            type: 'Tempo Integral',
            salary: 'R$ 2.200 + benefícios',
            date: 'Ontem',
            description: 'Procuramos um(a) barista apaixonado(a) por café para se juntar à nossa equipe. Experiência com métodos de preparo artesanais é um diferencial.'
        },
        {
            id: 6,
            title: 'Pizzaiolo',
            company: 'Forno da Vila',
            location: 'Salvador, BA',
            type: 'Tempo Integral',
            salary: 'R$ 3.500 - R$ 4.500',
            date: 'Há 1 dia',
            description: 'Vaga para pizzaiolo experiente em forno a lenha. Oferecemos treinamento e ambiente de trabalho agradável.'
        }
    ];

    // Render jobs function
    function renderJobs(jobsToRender) {
        const jobsContainer = document.getElementById('jobsContainer');
        jobsContainer.innerHTML = '';

        jobsToRender.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3 class="job-title">${job.title}</h3>
                <span class="job-company">${job.company}</span>
                <div class="job-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="far fa-clock"></i> ${job.type}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-footer">
                    <span class="job-date">${job.date}</span>
                    <a href="#" class="job-apply" data-id="${job.id}">Candidatar-se <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });
    }

    // Initial render
    renderJobs(jobs);

    // Search functionality
    const searchInput = document.querySelector('.search-input input');
    const locationInput = document.querySelector('.search-location input');
    const searchButton = document.querySelector('.btn-search');
    const popularTags = document.querySelectorAll('.tag');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const locationTerm = locationInput.value.toLowerCase();

        const filteredJobs = jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                               job.company.toLowerCase().includes(searchTerm) ||
                               job.description.toLowerCase().includes(searchTerm);
            
            const matchesLocation = locationTerm === '' || 
                                 job.location.toLowerCase().includes(locationTerm);
            
            return matchesSearch && matchesLocation;
        });

        renderJobs(filteredJobs);
    }

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    locationInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Popular tags click handler
    popularTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = tag.textContent;
            performSearch();
        });
    });

    // Apply button handler
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('job-apply') || e.target.closest('.job-apply')) {
            e.preventDefault();
            const jobId = e.target.closest('.job-apply').dataset.id;
            // Redireciona para a página de login com o ID da vaga como parâmetro
            window.location.href = `login.html?jobId=${jobId}`;
        }
    });
}

// Função para realizar a busca
function performSearch() {
    const searchInput = document.querySelector('.search-input input');
    const locationInput = document.querySelector('.search-location input');
    const jobsContainer = document.getElementById('jobsContainer');
    
    if (!searchInput || !locationInput || !jobsContainer) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    const locationTerm = locationInput.value.trim().toLowerCase();
    
    // Aqui você pode adicionar a lógica de busca real
    // Por enquanto, apenas mostra um feedback visual
    jobsContainer.innerHTML = `
        <div class="search-feedback">
            <i class="fas fa-search"></i>
            <h3>Buscando por "${searchTerm}"${locationTerm ? ` em ${locationTerm}` : ''}</h3>
            <p>Aguarde enquanto encontramos as melhores vagas para você.</p>
        </div>
    `;
    
    // Simula um atraso de rede
    setTimeout(() => {
        // Aqui você pode adicionar a lógica para filtrar as vagas
        // Por enquanto, apenas mostra uma mensagem de sucesso
        jobsContainer.innerHTML = `
            <div class="search-feedback success">
                <i class="fas fa-check-circle"></i>
                <h3>Busca concluída!</h3>
                <p>Encontramos 15 vagas para "${searchTerm}"${locationTerm ? ` em ${locationTerm}` : ''}.</p>
                <button class="btn btn-primary" onclick="window.location.href='vagas.html?q=${encodeURIComponent(searchTerm)}${locationTerm ? `&location=${encodeURIComponent(locationTerm)}` : ''}'">
                    Ver todas as vagas
                </button>
            </div>
        `;
    }, 1000);
}

// Inicializa a funcionalidade de busca
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input input');
    const locationInput = document.querySelector('.search-location input');
    const searchButton = document.querySelector('.btn-search');
    const popularTags = document.querySelectorAll('.tag');

    if (!searchInput || !locationInput || !searchButton) return;

    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    locationInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Popular tags click handler
    popularTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) {
                searchInput.value = tag.textContent;
                performSearch();
            }
        });
    });
}

// Inicializa os menus suspensos
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    // Fecha os dropdowns ao clicar fora
    document.addEventListener('click', function(event) {
        // Verifica se o clique foi no botão de login
        if (event.target.closest('.login-button')) {
            return; // Permite o comportamento padrão do link
        }
        
        // Verifica se o clique foi em um dropdown toggle
        const isDropdownToggle = Array.from(dropdownToggles).some(toggle => toggle.contains(event.target));
        if (isDropdownToggle) {
            return; // Deixa o manipulador de clique do toggle lidar com isso
        }
        
        // Fecha todos os dropdowns
        closeAllMenus();
    });
    
    // Configura os toggles dos dropdowns
    dropdownToggles.forEach(toggle => {
        // Configura atributos ARIA
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Adiciona eventos de teclado
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'Escape') {
                closeMenu(this);
            }
        });
        
        // Adiciona eventos de clique
        toggle.addEventListener('click', function(e) {
            // Verifica se o clique foi no botão de login
            if (e.target.closest('.login-button')) {
                return; // Permite o comportamento padrão do link
            }
            
            e.preventDefault();
            const menu = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Fecha outros menus abertos
            if (!isExpanded) {
                closeAllMenus();
            }
            
            // Alterna o menu atual
            this.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('active');
        });
    });
    
    // Fecha menus ao clicar fora
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown > a')) {
            closeAllMenus();
        }
    });
    
    // Fecha menus ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
    
    // Função para fechar um menu específico
    function closeMenu(toggle) {
        const menu = toggle.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(15px)';
            toggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Função para fechar todos os menus
    function closeAllMenus() {
        dropdownToggles.forEach(toggle => {
            closeMenu(toggle);
        });
    }
}

// Efeito de digitação para o texto em destaque
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const words = ['FOOD SERVICE', 'RESTAURANTES', 'FAST FOOD', 'DELIVERY'];
    let currentIndex = 0;
    const transitionTime = 800; // Tempo de transição em ms
    const displayTime = 2000;   // Tempo que cada palavra fica visível

    function changeWord() {
        // Adiciona classe para esmaecer o texto atual
        typingText.classList.add('hidden');
        
        // Após a transição de saída, muda o texto e mostra o novo
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            typingText.textContent = words[currentIndex];
            typingText.classList.remove('hidden');
        }, transitionTime);

        // Agenda a próxima troca de palavra
        setTimeout(changeWord, displayTime + transitionTime);
    }
    
    // Inicia o efeito
    setTimeout(changeWord, displayTime);
}

// Inicializa o modal de login
function initLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const loginButtons = document.querySelectorAll('[href="login.html"], .btn-login-trigger');
    const closeButton = document.querySelector('.close-modal');
    
    if (!loginModal || !closeButton) return;
    
    // Abrir modal
    loginButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede o scroll da página
        });
    });
    
    // Fechar modal
    closeButton.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaura o scroll da página
    });
    
    // Fechar ao clicar fora do modal
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura o scroll da página
        }
    });
    
    // Prevenir fechamento ao clicar dentro do modal
    const modalContent = document.querySelector('.login-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Fechar com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura o scroll da página
        }
    });
    
    // Prevenir envio do formulário (apenas para demonstração)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aqui você pode adicionar a lógica de autenticação
            console.log('Formulário enviado');
        });
    }
}

// Inicializa o menu mobile
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!mobileMenuToggle || !mainNav) return;
    
    // Configura atributos ARIA
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    
    // Adiciona evento de clique no botão do menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        
        // Atualiza o ícone
        const icon = this.querySelector('i');
        if (icon) {
            if (isExpanded) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    });
    
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                
                // Restaura o ícone
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Fecha o menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024 && 
            !mainNav.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // Restaura o ícone
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Fecha o menu ao redimensionar a tela para desktop
    function handleResize() {
        if (window.innerWidth > 1024) {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // Restaura o ícone
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
    
    // Adiciona listener para redimensionamento da tela
    window.addEventListener('resize', handleResize);
}

// Inicializa todos os componentes
function initAll() {
    initComponents();
    initTypingEffect();
    initLoginModal();
    initMobileMenu();
    
    // Garante que o botão de login funcione corretamente
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            // Permite que o link funcione normalmente
            window.location.href = this.getAttribute('href');
        });
    }
    
    initDropdowns();
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM já está pronto
    initAll();
}
