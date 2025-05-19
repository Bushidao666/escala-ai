// --- Sistema de partículas minimalistas independentes (otimizado para responsividade) ---
const particlesCanvas = document.getElementById('particles-canvas');
const ctx = particlesCanvas.getContext('2d');
let particlesArray = [];
let animationFrame;
let isSmallScreen = false; // Flag para detectar telas menores

// Configuração das partículas com ajustes responsivos
const particleSettings = {
    // Configurações base
    count: 60, // Quantidade base para telas grandes
    minSize: 1,
    maxSize: 4,
    minSpeed: 0.2,
    maxSpeed: 0.8,
    shapes: ['circle', 'square', 'triangle', 'diamond'],
    colors: [
        { r: 255, g: 255, b: 255, a: 0.3 },
        { r: 200, g: 200, b: 200, a: 0.2 },
        { r: 150, g: 150, b: 150, a: 0.15 }
    ],
    rotationSpeed: 0.01,
    
    // Configurações para telas menores
    notebook: {
        count: 40, // Menos partículas para notebooks
        minSize: 1,
        maxSize: 3, // Tamanho máximo menor
        minSpeed: 0.15, // Velocidade reduzida
        maxSpeed: 0.6
    },
    
    // Configurações para telas bem pequenas
    mobile: {
        count: 25, // Ainda menos partículas para mobile
        minSize: 1,
        maxSize: 2, // Tamanho ainda menor
        minSpeed: 0.1, // Velocidade mais reduzida
        maxSpeed: 0.4
    }
};

// Redimensionar o canvas e ajustar configurações para responsividade
function setupCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    
    // Detectar tamanho de tela e ajustar configurações
    const screenWidth = window.innerWidth;
    const oldSmallScreen = isSmallScreen;
    
    // Atualizar flag de tamanho de tela
    if (screenWidth <= 768) {
        isSmallScreen = 'mobile';
    } else if (screenWidth <= 1366) {
        isSmallScreen = 'notebook';
    } else {
        isSmallScreen = false;
    }
    
    // Somente recriar partículas se o breakpoint mudou
    if (oldSmallScreen !== isSmallScreen || particlesArray.length === 0) {
        particlesArray = [];
        createParticles();
    }
}

// Ouvir redimensionamento da janela
window.addEventListener('resize', setupCanvas);

// Classe de Partícula refinada com suporte a responsividade
class Particle {
    constructor() {
        // Aplicar configurações baseadas no tamanho da tela
        let settings = particleSettings;
        if (isSmallScreen === 'notebook') {
            settings = {...particleSettings, ...particleSettings.notebook};
        } else if (isSmallScreen === 'mobile') {
            settings = {...particleSettings, ...particleSettings.mobile};
        }
        
        // Tamanho aleatório
        this.size = settings.minSize + Math.random() * (settings.maxSize - settings.minSize);
        
        // Posição inicial aleatória
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        
        // Velocidade e direção aleatórias, ajustadas para o tamanho da tela
        this.speedX = (Math.random() - 0.5) * (settings.minSpeed + Math.random() * settings.maxSpeed);
        this.speedY = (Math.random() - 0.5) * (settings.minSpeed + Math.random() * settings.maxSpeed);
        
        // Escolher forma aleatoriamente
        this.shape = settings.shapes[Math.floor(Math.random() * settings.shapes.length)];
        
        // Escolher cor aleatoriamente
        const colorIndex = Math.floor(Math.random() * settings.colors.length);
        this.color = settings.colors[colorIndex];
        
        // Rotação (para shapes não-círculos)
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * settings.rotationSpeed;
        
        // Pulsação
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.baseSize = this.size;
    }
    
    // Atualizar posição e aparência
    update() {
        // Movimento
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebater nas bordas com amortecimento suave
        if (this.x < 0) {
            this.x = 0;
            this.speedX = Math.abs(this.speedX) * 0.9; // Amortecimento
        } else if (this.x > particlesCanvas.width) {
            this.x = particlesCanvas.width;
            this.speedX = -Math.abs(this.speedX) * 0.9; // Amortecimento
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.speedY = Math.abs(this.speedY) * 0.9; // Amortecimento
        } else if (this.y > particlesCanvas.height) {
            this.y = particlesCanvas.height;
            this.speedY = -Math.abs(this.speedY) * 0.9; // Amortecimento
        }
        
        // Rotação
        if (this.shape !== 'circle') {
            this.rotation += this.rotationSpeed;
        }
        
        // Pulsação sutil
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * (this.baseSize * 0.2);
    }
    
    // Desenhar a partícula
    draw() {
        // Não desenhar se estiver fora da tela com uma margem
        const margin = 20;
        if (
            this.x < -margin || 
            this.x > particlesCanvas.width + margin || 
            this.y < -margin || 
            this.y > particlesCanvas.height + margin
        ) {
            return;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.shape !== 'circle') {
            ctx.rotate(this.rotation);
        }
        
        const fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        ctx.fillStyle = fillStyle;
        
        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'square':
                ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
                break;
                
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -this.size * 1.5);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size * 1.5);
                ctx.lineTo(-this.size, 0);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }
}

// Criar partículas com quantidade ajustada por tamanho de tela
function createParticles() {
    // Escolher configurações baseadas no tamanho da tela
    let settings = particleSettings;
    if (isSmallScreen === 'notebook') {
        settings = {...particleSettings, ...particleSettings.notebook};
    } else if (isSmallScreen === 'mobile') {
        settings = {...particleSettings, ...particleSettings.mobile};
    }
    
    // Criar a quantidade apropriada de partículas
    for (let i = 0; i < settings.count; i++) {
        particlesArray.push(new Particle());
    }
}

// Loop de animação principal otimizado
function animateParticles() {
    // Uso de requestAnimationFrame para sincronia com taxa de atualização do monitor
    animationFrame = requestAnimationFrame(animateParticles);
    
    // Limpar o canvas com uma leve trilha (efeito de persistência)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; // Persistência muito sutil
    ctx.fillRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    // Atualizar e desenhar cada partícula
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}

// Iniciar o sistema de partículas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupCanvas();
    animateParticles();
    
    // Inicializar gerenciamento de abas
    initTabs();
    
    // Inicializar limpeza de fila
    initCleanQueue();
    
    // Inicializar o manipulador de formulário
    initFormHandler();
    
    // Initialize color pickers
    initColorPickers();
    
    // Initialize image previews
    initImagePreviews();
    
    // Garantir que as classes Tailwind não interfiram com o CSS personalizado
    document.querySelectorAll('.input-glow').forEach(input => {
        // Remover classes de cores específicas do Tailwind
        if (input.classList.contains('bg-white/50')) {
            input.classList.remove('bg-white/50');
        }
        if (input.classList.contains('border-gray-300/50')) {
            input.classList.remove('border-gray-300/50');
        }
        if (input.classList.contains('shadow-sm')) {
            input.classList.remove('shadow-sm');
        }
    });
    
    // Adicionar classe de resposta visual ao clicar nos cards
    document.querySelectorAll('.format-card-container').forEach(container => {
        const card = container.querySelector('.format-card');
        const checkbox = container.querySelector('.format-checkbox');
        
        // Adicionar click explícito nos cards para melhor experiência móvel
        card.addEventListener('click', function(e) {
            // Evitar propagação múltipla
            e.preventDefault();
            e.stopPropagation();
            
            // Alternar estado do checkbox
            checkbox.checked = !checkbox.checked;
            
            // Disparar evento change manualmente para acionar a validação
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        });
        
        // Adicionar feedback visual instantâneo ao passar o mouse
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!checkbox.checked) {
                this.style.transform = '';
            }
        });
    });
    
    // Inicializar a validação de formatos
    validateFormats();
    
    // Restante do código de inicialização
    const form = document.getElementById('creative-form');
    const formatCheckboxes = document.querySelectorAll('input[name="formats"]');
    const formatError = document.getElementById('format-error');
    const mainContainer = document.getElementById('main-container');

    // Adicionar efeito de perspectiva ao container principal
    document.addEventListener('mousemove', function(e) {
        if (!mainContainer) return;
        
        // Calcular posição relativa do mouse dentro da janela
        const rect = mainContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        // Calcular rotação (valor pequeno para efeito sutil)
        const rotateY = mouseX * 0.01; // Reduzido para efeito mais sutil
        const rotateX = -mouseY * 0.01; // Negativo para movimento natural
        
        // Aplicar transformação com transição suave
        mainContainer.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
    });
    
    // Retornar à posição normal quando o mouse sair
    document.addEventListener('mouseleave', function() {
        if (!mainContainer) return;
        mainContainer.style.transform = 'perspective(2000px) rotateX(0) rotateY(0)';
    });

    // Ensure validateFormats is called or listeners are set up for format checkboxes
    formatCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateFormats);
    });
    validateFormats(); // Initial validation call

    const submitButton = document.getElementById('submit-creative-button');
    if (submitButton) {
        originalSubmitButtonHTML = submitButton.innerHTML; // Store original HTML
    } else {
        console.error("Submit button not found on DOMContentLoaded for storing original HTML.");
    }
});

// --- Gerenciamento de abas ---
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Esconder todos os conteúdos
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Mostrar o conteúdo correspondente
            const tabId = this.id.replace('tab-', 'content-');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
}

// --- Limpar fila de requisições ---
function initCleanQueue() {
    const cleanButton = document.getElementById('clean-queue-button');
    
    if (cleanButton) {
        cleanButton.addEventListener('click', function() {
            // Confirmar antes de limpar
            if (confirm('Tem certeza que deseja limpar a fila de solicitações?')) {
                // Limpar objeto de requisições
                Object.keys(requestsQueue).forEach(reqId => {
                    // Manter apenas as requisições concluídas para referência na galeria
                    if (requestsQueue[reqId].status !== 'completed') {
                        delete requestsQueue[reqId];
                    }
                });
                
                // Atualizar a exibição
                displayRequestsQueue();
                
                // Mostrar mensagem
                showInfoMessage("Fila de solicitações limpa com sucesso!");
            }
        });
    }
}

// Objeto global para rastrear requisições e seus criativos gerados
const requestsQueue = {};
const creativeGallery = {};

// --- Global variables ---
let originalSubmitButtonHTML = ''; // To store the original button content

// --- Custom Notification Functions ---
function showCustomNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);

    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => removeNotification(notification);
    notification.appendChild(closeButton);

    container.appendChild(notification);

    // Trigger reflow to enable animation
    void notification.offsetWidth;

    notification.classList.add('show');

    if (duration !== null) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
}

function removeNotification(notificationElement) {
    if (notificationElement) {
        notificationElement.classList.remove('show');
        // Wait for fade-out animation to complete before removing
        setTimeout(() => {
            notificationElement.remove();
        }, 300); // Must match CSS transition duration
    }
}

// Wrapper functions for different notification types
function showInfoMessage(message, duration = 3000) {
    showCustomNotification(message, 'info', duration);
}

function showSuccessMessage(message, duration = 3000) {
    showCustomNotification(message, 'success', duration);
}

function showErrorMessage(message, duration = 5000) {
    showCustomNotification(message, 'error', duration);
}

// --- Funções de Interface ---

// Função para atualizar o status da requisição
function updateRequestStatus(requestId, status, message) {
    console.log(`Atualizando status da requisição ${requestId} para ${status}: ${message}`);
    
    // Armazenar o status atual
    requestsQueue[requestId] = {
        status: status,
        message: message,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    };
    
    // Exibir fila de requisições
    displayRequestsQueue();
    
    // Atualizar contador de notificação na aba
    updateRequestsTabCounter();
}

// Função para exibir a fila de requisições
function displayRequestsQueue() {
    console.log("Exibindo fila de requisições");
    
    // Obter a lista de requisições
    const requestsList = document.getElementById('requests-list');
    
    if (!requestsList) return;
    
    // Limpar lista atual
    requestsList.innerHTML = '';
    
    const requestIds = Object.keys(requestsQueue);
    console.log("Requisições na fila:", requestIds.length);
    
    // Verificar se há requisições
    if (requestIds.length === 0) {
        requestsList.innerHTML = `
            <div class="text-center text-white/60 py-8">
                Nenhuma solicitação na fila.
            </div>
        `;
        return;
    }
    
    // Ordenar requisições com as mais recentes primeiro
    const sortedRequestIds = requestIds.sort((a, b) => {
        return parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]);
    });
    
    // Adicionar cada requisição à lista em formato minimalista
    sortedRequestIds.forEach(reqId => {
        const req = requestsQueue[reqId];
        
        // Classes e ícones baseados no status
        let statusClass, statusIcon;
        let clickAction = '';
        
        switch (req.status) {
            case 'pending':
                statusClass = 'bg-yellow-400/20 border-yellow-400/40';
                statusIcon = `<div class="w-2 h-2 rounded-full bg-yellow-400"></div>`;
                break;
            case 'processing':
                statusClass = 'bg-blue-400/20 border-blue-400/40';
                statusIcon = `<div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>`;
                break;
            case 'completed':
                statusClass = 'bg-green-400/20 border-green-400/40';
                statusIcon = `<div class="w-2 h-2 rounded-full bg-green-400"></div>`;
                clickAction = `onclick="viewCreative('${reqId}')"`;
                break;
            case 'error':
                statusClass = 'bg-red-400/20 border-red-400/40';
                statusIcon = `<div class="w-2 h-2 rounded-full bg-red-400"></div>`;
                break;
        }
        
        // Criar item minimalista da lista
        const reqItem = document.createElement('div');
        reqItem.className = `request-item flex items-center p-3 rounded-lg border ${statusClass} backdrop-blur-sm transition hover:bg-white/5 ${req.status === 'completed' ? 'cursor-pointer' : ''}`;
        reqItem.setAttribute('data-request-id', reqId);
        
        if (clickAction) {
            reqItem.setAttribute('onclick', clickAction.replace('onclick="', '').replace('"', ''));
        }
        
        reqItem.innerHTML = `
            <div class="flex-shrink-0 mr-3">
                ${statusIcon}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">${req.message}</p>
                <p class="text-xs text-white/60">${req.timestamp}</p>
            </div>
            ${req.status === 'completed' ? `
                <div class="flex-shrink-0 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            ` : ''}
        `;
        
        requestsList.appendChild(reqItem);
    });
}

// Função para atualizar contador de notificações na aba de solicitações
function updateRequestsTabCounter() {
    const requestTab = document.getElementById('tab-requests');
    const activeRequests = Object.values(requestsQueue).filter(req => 
        req.status === 'pending' || req.status === 'processing'
    ).length;
    
    if (!requestTab) return;
    
    // Remover contador existente se houver
    const existingCounter = requestTab.querySelector('.requests-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Adicionar novo contador se necessário
    if (activeRequests > 0) {
        const counter = document.createElement('span');
        counter.className = 'requests-counter inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-500 text-white rounded-full ml-2';
        counter.textContent = activeRequests;
        requestTab.appendChild(counter);
    }
}

// Função para exibir os resultados das imagens
function displayResults(imageBlob, requestId) {
    console.log(`Exibindo resultados para requisição ${requestId}`);
    
    // Criar uma URL temporária para o Blob
    const objectURL = URL.createObjectURL(imageBlob);
    
    // Armazenar na galeria para referência futura
    creativeGallery[requestId] = {
        url: objectURL,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    };
    
    // Atualizar a galeria
    updateGalleryDisplay();
    
    // Atualizar contador na aba da galeria
    updateGalleryTabCounter();
    
    // Verificar se estamos na aba de resultados, se não, mostrar notificação
    const galleryTab = document.getElementById('tab-gallery');
    const isGalleryTabActive = galleryTab && galleryTab.classList.contains('active');
    
    if (!isGalleryTabActive) {
        // Mostrar notificação indicando que um novo criativo foi gerado
        showSuccessMessage("Criativo gerado! Clique na aba Galeria para visualizar.");
    } else {
        // Se já estamos na aba de galeria, rolar para o novo item
        setTimeout(() => {
            viewCreative(requestId);
        }, 500);
    }
}

// Função para limpar a área de resultados e revogar Object URL
function clearResults() {
    console.log("Limpando resultados anteriores");
    
    // Remover referências antigas ao atualizar a galeria
    updateGalleryDisplay();
    
    // Revoga URLs de objetos que não estão mais em uso
    Object.keys(creativeGallery).forEach(key => {
        if (!document.querySelector(`[data-request-id="${key}"]`)) {
            URL.revokeObjectURL(creativeGallery[key].url);
            delete creativeGallery[key];
        }
    });
}

// Função para atualizar a galeria
function updateGalleryDisplay() {
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!galleryContainer) return;
    
    // Verificar se há imagens
    if (Object.keys(creativeGallery).length === 0) {
        galleryContainer.innerHTML = `
            <div class="text-center text-white/60 py-8 col-span-full">
                Nenhum criativo gerado ainda.
            </div>
        `;
        return;
    }
    
    // Limpar container
    galleryContainer.innerHTML = '';
    
    // Ordenar por data/hora (mais recentes primeiro)
    const sortedKeys = Object.keys(creativeGallery).sort((a, b) => {
        return parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]);
    });
    
    // Agrupar por data
    const groupedByDate = {};
    
    sortedKeys.forEach(key => {
        const item = creativeGallery[key];
        if (!groupedByDate[item.date]) {
            groupedByDate[item.date] = [];
        }
        groupedByDate[item.date].push({id: key, ...item});
    });
    
    // Adicionar cada grupo
    Object.keys(groupedByDate).sort((a, b) => {
        // Ordenar datas em ordem decrescente
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB - dateA;
    }).forEach(date => {
        // Adicionar cabeçalho da data
        const dateHeader = document.createElement('div');
        dateHeader.className = 'col-span-full mt-6 mb-3 first:mt-0';
        
        // Formatar data de forma amigável
        let friendlyDate;
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
        
        if (date === today) {
            friendlyDate = 'Hoje';
        } else if (date === yesterday) {
            friendlyDate = 'Ontem';
        } else {
            friendlyDate = date;
        }
        
        dateHeader.innerHTML = `
            <h3 class="text-lg font-medium text-white border-b border-white/10 pb-2">${friendlyDate}</h3>
        `;
        galleryContainer.appendChild(dateHeader);
        
        // Adicionar criativos deste dia
        groupedByDate[date].forEach(item => {
            const creativeCard = document.createElement('div');
            creativeCard.className = 'p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transform transition hover:translate-y-[-5px] hover:shadow-lg';
            creativeCard.setAttribute('data-request-id', item.id);
            
            creativeCard.innerHTML = `
                <div class="relative aspect-square mb-3 overflow-hidden rounded">
                    <img src="${item.url}" alt="Criativo gerado" class="object-cover w-full h-full rounded">
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-white/60">${item.timestamp}</span>
                    <a href="${item.url}" download="criativo_${item.id}.png" class="text-white/80 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                </div>
            `;
            
            galleryContainer.appendChild(creativeCard);
        });
    });
}

// Função para atualizar contador na aba de galeria
function updateGalleryTabCounter() {
    const galleryTab = document.getElementById('tab-gallery');
    const creativeCount = Object.keys(creativeGallery).length;
    
    if (!galleryTab) return;
    
    // Remover contador existente se houver
    const existingCounter = galleryTab.querySelector('.gallery-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Adicionar novo contador se necessário
    if (creativeCount > 0) {
        const counter = document.createElement('span');
        counter.className = 'gallery-counter inline-flex items-center justify-center w-5 h-5 text-xs bg-green-500 text-white rounded-full ml-2';
        counter.textContent = creativeCount;
        galleryTab.appendChild(counter);
    }
}

// Função para visualizar criativo específico da requisição
function viewCreative(requestId) {
    // Verificar se existe o criativo na galeria
    if (creativeGallery[requestId]) {
        // Alternar para a aba da galeria
        document.getElementById('tab-gallery').click();
        
        // Destacar temporariamente o criativo
        setTimeout(() => {
            const creativeCard = document.querySelector(`[data-request-id="${requestId}"]`);
            if (creativeCard) {
                creativeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Adicionar animação de destaque
                creativeCard.classList.add('ring-4', 'ring-blue-400/50');
                
                // Remover após 3 segundos
                setTimeout(() => {
                    creativeCard.classList.remove('ring-4', 'ring-blue-400/50');
                }, 3000);
            }
        }, 300);
    }
}

// --- Button Spinner Functions ---
function showButtonSpinner(buttonElement) {
    if (buttonElement) {
        buttonElement.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="relative z-10">Enviando...</span>`;
        // As per user request, do not disable the button:
        // buttonElement.disabled = true; 
    }
}

function resetButtonSpinner(buttonElement) {
    if (buttonElement && originalSubmitButtonHTML) {
        buttonElement.innerHTML = originalSubmitButtonHTML;
        // buttonElement.disabled = false;
    }
}

// Função para inicializar o manipulador de formulário
function initFormHandler() {
    console.log('Iniciando configuração do manipulador de formulário...');
    
    const form = document.getElementById('creative-form');
    const submitButton = document.getElementById('submit-creative-button');
    
    if (!form) {
        console.error('ERRO: Formulário não encontrado!');
        return;
    }
    
    if (!submitButton) {
        console.error('ERRO: Botão de submit não encontrado!');
        return;
    }

    // Store original button HTML if not already stored (e.g., if DOMContentLoaded runs later)
    // This is already done in DOMContentLoaded, but as a fallback:
    if (!originalSubmitButtonHTML && submitButton) {
        originalSubmitButtonHTML = submitButton.innerHTML;
    }
    
    // The button has an onclick="enviarFormulario()" in HTML.
    // The form has onsubmit="handleFormSubmit(event); return false;" in HTML.
    // We need to ensure `enviarFormulario` is the one being called correctly.
    // `handleFormSubmit` will now just call `enviarFormulario`.

    console.log('Handler de formulário inicializado com sucesso.');
}

// Função para manipular o envio do formulário (chamada pelo onsubmit do HTML)
function handleFormSubmit(event) {
    console.log('handleFormSubmit chamado, redirecionando para enviarFormulario...');
    if (event) {
        event.preventDefault(); // Sempre previnir o comportamento padrão do form aqui
        event.stopPropagation();
    }
    enviarFormulario(); // Chamar a função principal de envio
    return false; // Para garantir que o formulário não submeta da forma tradicional
}

// Função para resetar o formulário
function resetForm() {
    console.log("Resetando formulário...");
    const form = document.getElementById('creative-form');
    if (form) {
        form.reset(); // Resets basic input fields like text, textarea

        // Clear file inputs more reliably and hide previews
        const logoInput = document.getElementById('logo');
        const logoPreviewContainer = document.getElementById('logo-preview-container');
        if (logoInput) logoInput.value = '';
        if (logoPreviewContainer) logoPreviewContainer.classList.add('hidden');
        
        const productImageInput = document.getElementById('product-image');
        const productImagePreviewContainer = document.getElementById('product-image-preview-container');
        if (productImageInput) productImageInput.value = '';
        if (productImagePreviewContainer) productImagePreviewContainer.classList.add('hidden');

        // Reset color pickers to default and update previews/hex
        const primaryColorPicker = document.getElementById('primary-color-picker');
        const primaryColorPreview = document.getElementById('primary-color-preview');
        const primaryColorHex = document.getElementById('primary-color-hex');
        const defaultPrimaryColor = '#000080'; // Default from HTML
        if (primaryColorPicker) primaryColorPicker.value = defaultPrimaryColor;
        if (primaryColorPreview) primaryColorPreview.style.backgroundColor = defaultPrimaryColor;
        if (primaryColorHex) primaryColorHex.textContent = defaultPrimaryColor.toUpperCase();

        const secondaryColorPicker = document.getElementById('secondary-color-picker');
        const secondaryColorPreview = document.getElementById('secondary-color-preview');
        const secondaryColorHex = document.getElementById('secondary-color-hex');
        const defaultSecondaryColor = '#03B5CB'; // Default from HTML
        if (secondaryColorPicker) secondaryColorPicker.value = defaultSecondaryColor;
        if (secondaryColorPreview) secondaryColorPreview.style.backgroundColor = defaultSecondaryColor;
        if (secondaryColorHex) secondaryColorHex.textContent = defaultSecondaryColor.toUpperCase();

        // Uncheck all format checkboxes
        const formatCheckboxes = document.querySelectorAll('input[name="formats"]');
        formatCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        // Trigger change event on checkboxes to update any visual styles tied to being checked/unchecked.
        // This also ensures validateFormats (if it relies on change) is aware.
        formatCheckboxes.forEach(checkbox => {
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        });


        // Hide format error message
        const formatError = document.getElementById('format-error');
        if (formatError) {
            formatError.classList.add('hidden');
        }
        
        // Focus on the first input field as a good UX practice after reset
        const firstInput = document.getElementById('text1');
        if (firstInput) firstInput.focus();

        showInfoMessage("Formulário limpo. Pronto para uma nova criação!");
    } else {
        console.error("Formulário 'creative-form' não encontrado para resetar.");
    }
}

// Função para validar os formatos (chamada no change e antes do submit)
function validateFormats() {
    console.log("Validando formatos selecionados...");
    const formatCheckboxes = document.querySelectorAll('input[name="formats"]');
    
    if (!formatCheckboxes || formatCheckboxes.length === 0) {
        console.error("ERRO: Checkboxes de formato não encontrados!");
        return false; // Should not happen if HTML is correct
    }
    
    const isAnyChecked = Array.from(formatCheckboxes).some(cb => cb.checked);
    const formatError = document.getElementById('format-error');
    
    if (!isAnyChecked) {
        console.log("Validação: Nenhum formato selecionado.");
        if (formatError) {
            formatError.classList.remove('hidden');
        }
        return false;
    } else {
        console.log("Validação: Formatos OK.");
        if (formatError) {
            formatError.classList.add('hidden');
        }
        return true;
    }
}

// Função direta para enviar o formulário (MODIFIED for Spinner and Reset)
function enviarFormulario() {
    console.log("enviarFormulario() INICIADO!");
    
    const submitButton = document.getElementById('submit-creative-button');

    // --- Validações ---
    const text1Input = document.getElementById('text1');
    const text2Input = document.getElementById('text2');
    const text3Input = document.getElementById('text3');
    const descriptionInput = document.getElementById('description');

    if (!text1Input || !text2Input || !text3Input || !descriptionInput) {
        showErrorMessage("Erro interno: Campos de texto essenciais não encontrados.");
        return; // Early exit
    }

    const text1 = text1Input.value.trim();
    const text2 = text2Input.value.trim();
    const text3 = text3Input.value.trim();
    const description = descriptionInput.value.trim();

    if (!text1) {
        showErrorMessage("Por favor, preencha o Texto 1.");
        text1Input.focus();
        return;
    }
    if (!text2) {
        showErrorMessage("Por favor, preencha o Texto 2.");
        text2Input.focus();
        return;
    }
    if (!text3) {
        showErrorMessage("Por favor, preencha o Texto 3.");
        text3Input.focus();
        return;
    }
    if (!description) {
        showErrorMessage("Por favor, preencha a Explicação do produto.");
        descriptionInput.focus();
        return;
    }

    if (!validateFormats()) { // Use a função de validação de formatos
        showErrorMessage("Por favor, selecione pelo menos um formato.");
        const firstFormatCheckbox = document.querySelector('input[name="formats"]');
        if (firstFormatCheckbox) firstFormatCheckbox.focus();
        return;
    }

    // --- Se tudo OK, mostrar spinner e enviar ---
    showButtonSpinner(submitButton); 
    showInfoMessage("Enviando sua solicitação...");

    const requestId = 'req_' + Date.now();

    const formData = new FormData();
    formData.append('text1', text1);
    formData.append('text2', text2);
    formData.append('text3', text3);
    formData.append('description', description);
    formData.append('primary-color', document.getElementById('primary-color-picker').value);
    formData.append('secondary-color', document.getElementById('secondary-color-picker').value);

    const logoFile = document.getElementById('logo').files[0];
    if (logoFile) formData.append('logo', logoFile, logoFile.name);
    
    const productImageFile = document.getElementById('product-image').files[0];
    if (productImageFile) formData.append('product-image', productImageFile, productImageFile.name);

    const formatCheckboxes = document.querySelectorAll('input[name="formats"]');
    formatCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const key = `format_${checkbox.value.replace(':', '_')}`;
            formData.append(key, checkbox.value);
        }
    });
    formData.append('requestId', requestId);

    // Mover para a aba de solicitações e atualizar status
    try {
        const requestsTab = document.getElementById('tab-requests');
        if (requestsTab) requestsTab.click();
        updateRequestStatus(requestId, 'pending', 'Solicitação enviada, aguardando processamento...');
    } catch (tabError) {
        console.error("Erro ao mudar para aba de solicitações:", tabError);
    }

    const webhookUrl = 'https://n8n-n8n.vy2cfb.easypanel.host/webhook/gerador-de-criativos';
    console.log("Enviando requisição para:", webhookUrl);

    fetch(webhookUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Resposta recebida do servidor:", response.status);
        updateRequestStatus(requestId, 'processing', 'Servidor processando sua solicitação...');
        if (!response.ok) {
            return response.text().then(text => { // Ler o corpo do erro para mais detalhes
                throw new Error(`Erro ${response.status}: ${response.statusText}. Detalhes: ${text}`);
            });
        }
        return response.blob();
    })
    .then(imageBlob => {
        console.log('Sucesso do Webhook: Blob recebido', imageBlob);
        updateRequestStatus(requestId, 'completed', 'Criativo gerado com sucesso!');
        showSuccessMessage('Criativo gerado com sucesso!');
        
        if (imageBlob && imageBlob.size > 0 && imageBlob.type.startsWith('image/')) {
            displayResults(imageBlob, requestId);
            resetForm(); // Limpar formulário após sucesso
        } else {
            const errorMsg = "Resposta do servidor não é uma imagem válida.";
            console.error(errorMsg, "Blob type:", imageBlob.type, "Blob size:", imageBlob.size);
            showErrorMessage(errorMsg);
            updateRequestStatus(requestId, 'error', errorMsg);
        }
    })
    .catch(error => {
        console.error('Erro detalhado ao chamar o Webhook:', error);
        let errorMessage = "Ocorreu um erro ao processar sua solicitação.";
        if (error.message) {
            errorMessage = error.message.includes("Failed to fetch") ? 
                           "Não foi possível conectar ao servidor. Verifique sua conexão." : 
                           `Erro: ${error.message}`;
        }
        showErrorMessage(errorMessage);
        updateRequestStatus(requestId, 'error', errorMessage);
    })
    .finally(() => {
        resetButtonSpinner(submitButton); // Restaurar botão SEMPRE
    });
}

// --- Initialize Color Pickers ---
function initColorPickers() {
    const primaryColorPicker = document.getElementById('primary-color-picker');
    const primaryColorPreview = document.getElementById('primary-color-preview');
    const primaryColorHex = document.getElementById('primary-color-hex');

    const secondaryColorPicker = document.getElementById('secondary-color-picker');
    const secondaryColorPreview = document.getElementById('secondary-color-preview');
    const secondaryColorHex = document.getElementById('secondary-color-hex');

    if (primaryColorPicker && primaryColorPreview && primaryColorHex) {
        primaryColorPicker.addEventListener('input', function() {
            const newColor = this.value;
            primaryColorPreview.style.backgroundColor = newColor;
            primaryColorHex.textContent = newColor.toUpperCase();
        });
    } else {
        console.error("Primary color picker elements not found!");
    }

    if (secondaryColorPicker && secondaryColorPreview && secondaryColorHex) {
        secondaryColorPicker.addEventListener('input', function() {
            const newColor = this.value;
            secondaryColorPreview.style.backgroundColor = newColor;
            secondaryColorHex.textContent = newColor.toUpperCase();
        });
    } else {
        console.error("Secondary color picker elements not found!");
    }
}

// --- Image Preview Functions ---
function setupImagePreview(inputId, previewImgId, previewContainerId, removeButtonId) {
    const inputElement = document.getElementById(inputId);
    const previewImgElement = document.getElementById(previewImgId);
    const previewContainerElement = document.getElementById(previewContainerId);
    const removeButtonElement = document.getElementById(removeButtonId);

    if (!inputElement || !previewImgElement || !previewContainerElement || !removeButtonElement) {
        console.error(`Erro ao configurar a pré-visualização: um ou mais elementos não encontrados para ${inputId}`);
        return;
    }

    inputElement.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImgElement.src = e.target.result;
                previewContainerElement.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        } else {
            // Clear preview if the file is not an image or no file is selected
            previewImgElement.src = '#';
            previewContainerElement.classList.add('hidden');
            inputElement.value = ''; // Clear the file input if not an image
            if (file) { // if a file was selected but wasn't an image
                showErrorMessage("Por favor, selecione um arquivo de imagem válido.");
            }
        }
    });

    removeButtonElement.addEventListener('click', function() {
        previewImgElement.src = '#';
        previewContainerElement.classList.add('hidden');
        inputElement.value = ''; // Clear the file input
        // Manually trigger change event on input for any other listeners (e.g. validation)
        const changeEvent = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(changeEvent);
    });
}

function initImagePreviews() {
    setupImagePreview('logo', 'logo-preview-img', 'logo-preview-container', 'remove-logo-button');
    setupImagePreview('product-image', 'product-image-preview-img', 'product-image-preview-container', 'remove-product-image-button');
}

// Placeholder for showLoader and hideLoader if they are not defined
// ... existing code ...

// ... existing code ... 