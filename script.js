const statuses = [
    'Planning autonomous backlog execution',
    'Shipping full-stack features with AI integration',
    'Running rapid experiment-to-deployment cycles',
    'Optimizing models and production workflows'
];
const STATUS_ROTATION_INTERVAL_MS = 3200;

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
        window.open('https://github.com/Grewestr', '_blank', 'noopener,noreferrer');
        feedbackElement.textContent = 'Opened GitHub profile in a new tab.';
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
        const email = 'jgrewe3@gatech.edu';
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
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));

        const increment = () => {
            current = Math.min(target, current + step);
            metric.textContent = String(current);
            if (current < target) {
                requestAnimationFrame(increment);
            }
        };

        increment();
    });
};

updateStatus();
updateRecommendation();
animateMetrics();
setInterval(updateStatus, STATUS_ROTATION_INTERVAL_MS);

if (selectElement) {
    selectElement.addEventListener('change', updateRecommendation);
}

actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        handleAction(button.dataset.action);
    });
});
