// Page configuration for five elements
const ELEMENT_CONFIG = {
    'mu': {
        title: 'Spring Unfolding',
        subtitle: 'Wood · Anger',
        icon: `<svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M40 15 L50 35 L40 30 L30 35 Z" stroke="currentColor" fill="none" stroke-width="2"/>
            <line x1="40" y1="30" x2="40" y2="55" stroke="currentColor" stroke-width="2"/>
            <path d="M30 45 Q35 40 40 45" stroke="currentColor" fill="none" stroke-width="2"/>
            <path d="M50 45 Q45 40 40 45" stroke="currentColor" fill="none" stroke-width="2"/>
        </svg>`,
        color: '#6B8E6B',
        shape: 'triangle'
    },
    'huo': {
        title: 'Fire in Bloom',
        subtitle: 'Fire · Joy',
        icon: `<svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M40 20 Q35 30 40 40 Q45 30 40 20" stroke="currentColor" fill="none" stroke-width="2"/>
            <path d="M40 35 Q30 45 35 55 Q40 50 40 55 Q40 50 45 55 Q50 45 40 35" stroke="currentColor" fill="none" stroke-width="2"/>
        </svg>`,
        color: '#D16B6B',
        shape: 'star'
    },
    'tu': {
        title: 'Earth of Calm',
        subtitle: 'Earth · Contemplation',
        icon: `<svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="25" y="25" width="30" height="30" stroke="currentColor" fill="none" stroke-width="2"/>
            <line x1="25" y1="40" x2="55" y2="40" stroke="currentColor" stroke-width="2"/>
            <line x1="40" y1="25" x2="40" y2="55" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        color: '#A88F6B',
        shape: 'square'
    },
    'shui': {
        title: 'Water Dreams',
        subtitle: 'Water · Fear',
        icon: `<svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M20 40 Q30 30 40 40 T60 40" stroke="currentColor" fill="none" stroke-width="2"/>
            <path d="M25 48 Q35 38 45 48 T65 48" stroke="currentColor" fill="none" stroke-width="2"/>
            <circle cx="40" cy="28" r="4" stroke="currentColor" fill="none" stroke-width="2"/>
        </svg>`,
        color: '#6B8FB8',
        shape: 'wave'
    },
    'jin': {
        title: 'Whispers of Metal',
        subtitle: 'Metal · Sorrow',
        icon: `<svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="18" stroke="currentColor" fill="none" stroke-width="2"/>
            <circle cx="40" cy="40" r="10" stroke="currentColor" fill="none" stroke-width="2"/>
            <line x1="40" y1="22" x2="40" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="40" y1="58" x2="40" y2="62" stroke="currentColor" stroke-width="2"/>
            <line x1="58" y1="40" x2="62" y2="40" stroke="currentColor" stroke-width="2"/>
            <line x1="22" y1="40" x2="18" y2="40" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        color: '#9B9B9B',
        shape: 'circle'
    }
};

// Prevent double-click
let isRedirecting = false;

// Initialize hotspot click events
document.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            if (isRedirecting) return;
            
            const element = this.dataset.element;
            const emotion = this.dataset.emotion;
            
            handleRedirect(element, emotion);
        });
    });
});

// Handle page redirect
function handleRedirect(element, emotion) {
    const config = ELEMENT_CONFIG[element];
    
    if (!config) {
        console.error('Unknown element:', element);
        return;
    }
    
    isRedirecting = true;
    showRedirectModal(config);
    
    setTimeout(() => {
        window.location.href = `experience.html?element=${element}&emotion=${emotion}`;
    }, 2000);
}

// Show redirect modal
function showRedirectModal(config) {
    const overlay = createModalOverlay();
    const modal = createModalElement(config);
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    });
}

// Create modal overlay
function createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    return overlay;
}

// Create modal element
function createModalElement(config) {
    const modal = document.createElement('div');
    modal.className = 'redirect-modal';
    modal.style.setProperty('--theme-color', config.color);
    
    modal.innerHTML = `
        <div class="modal-shape ${config.shape}"></div>
        <div class="modal-icon" style="color: ${config.color}">${config.icon}</div>
        <div class="modal-title">${config.title}</div>
        <div class="modal-subtitle">${config.subtitle}</div>
        <div class="modal-progress">
            <div class="progress-bar"></div>
        </div>
    `;
    
    return modal;
}