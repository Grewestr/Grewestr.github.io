const statuses = [
    'Planning autonomous backlog execution',
    'Shipping full-stack features with AI integration',
    'Running rapid experiment-to-deployment cycles',
    'Optimizing models and production workflows'
];
const STATUS_ROTATION_INTERVAL_MS = 3200;
const METRIC_ANIMATION_STEPS = 30;
const METRIC_ANIMATION_DURATION_MS = 900;

const recommendations = {
    'autonomous-systems': {
        title: 'CrowdCTRL',
        summary: 'Real-time occupancy detection pipeline with Raspberry Pi capture, YOLO inference, and Firestore-backed mobile visualization.',
        link: 'https://github.com/Grewestr/CrowdCTRL'
    },
    'computer-vision': {
        title: 'Footprint',
        summary: 'Computer vision tool for missing person search with attribute-based filtering and live analysis support.',
        link: 'https://github.com/Grewestr/CSC-4996-Footprint-Public'
    },
    'full-stack': {
        title: 'Live NBA Display',
        summary: 'Django + Raspberry Pi + OCR architecture that transforms fantasy basketball screenshots into physical LED board updates.',
        link: 'https://github.com/WSU-4110/Live-Sports-Display/tree/development'
    },
    'security-ml': {
        title: 'Membership Privacy Research',
        summary: 'Applied secure ML research and presented practical risks in membership inference attacks and privacy-preserving learning.',
        link: 'Machine Learning with Membership Privacy.pptx'
    }
};

const statusElement = document.getElementById('agent-status');
const feedbackElement = document.getElementById('action-feedback');
const selectElement = document.getElementById('interest-select');
const recommendationTitle = document.getElementById('recommendation-title');
const recommendationSummary = document.getElementById('recommendation-summary');
const recommendationLink = document.getElementById('recommendation-link');
const metricValues = document.querySelectorAll('.metric-value');
const actionButtons = document.querySelectorAll('.action-btn');
const metricRow = document.querySelector('.metric-row');
const revealElements = document.querySelectorAll('.impact-item, .summary-card, .agentic-card, .metric-card');

let statusIndex = 0;

const updateStatus = () => {
    if (!statusElement) {
        return;
    }

    statusElement.textContent = statuses[statusIndex];
    statusIndex = (statusIndex + 1) % statuses.length;
};

const updateRecommendation = () => {
    if (!selectElement || !recommendationTitle || !recommendationSummary || !recommendationLink) {
        return;
    }

    const selected = recommendations[selectElement.value];
    if (!selected) {
        return;
    }

    recommendationTitle.textContent = selected.title;
    recommendationSummary.textContent = selected.summary;
    recommendationLink.href = selected.link;
};

const handleAction = (action) => {
    if (!feedbackElement) {
        return;
    }

    if (action === 'github') {
        const openedWindow = window.open('https://github.com/Grewestr', '_blank', 'noopener,noreferrer');
        if (openedWindow) {
            feedbackElement.textContent = 'Opened GitHub profile in a new tab.';
        } else {
            feedbackElement.textContent = 'Popup blocked. Please open https://github.com/Grewestr manually.';
        }
        return;
    }

    if (action === 'projects') {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            feedbackElement.textContent = 'Moved to Featured Projects.';
        }
        return;
    }

    if (action === 'copy-email') {
        const mailLink = document.getElementById('contact-email');
        const emailHref = mailLink ? mailLink.getAttribute('href') : '';
        const email = emailHref && emailHref.startsWith('mailto:') ? emailHref.slice(7) : '';

        if (!email) {
            feedbackElement.textContent = 'Email is unavailable right now.';
            return;
        }

        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            feedbackElement.textContent = `Clipboard is unavailable. Email: ${email}`;
            return;
        }

        navigator.clipboard.writeText(email)
            .then(() => {
                feedbackElement.textContent = 'Email copied to clipboard.';
            })
            .catch(() => {
                feedbackElement.textContent = `Copy failed. Email: ${email}`;
            });
    }
};

const animateMetrics = () => {
    metricValues.forEach((metric) => {
        const target = Number(metric.dataset.target || 0);

        if (target <= METRIC_ANIMATION_STEPS) {
            metric.textContent = String(target);
            return;
        }

        const startTime = performance.now();

        const increment = (timestamp) => {
            const progress = Math.min((timestamp - startTime) / METRIC_ANIMATION_DURATION_MS, 1);
            const value = Math.floor(target * progress);
            metric.textContent = String(value);
            if (progress < 1) {
                requestAnimationFrame(increment);
            } else {
                metric.textContent = String(target);
            }
        };

        increment();
    });
};

const initRevealAnimations = () => {
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
};

const initMetricAnimation = () => {
    if (!metricRow) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        animateMetrics();
        return;
    }

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateMetrics();
                metricObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    metricObserver.observe(metricRow);
};

updateStatus();
updateRecommendation();
initRevealAnimations();
initMetricAnimation();
setInterval(updateStatus, STATUS_ROTATION_INTERVAL_MS);

if (selectElement) {
    selectElement.addEventListener('change', updateRecommendation);
}

actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        handleAction(button.dataset.action);
    });
});
