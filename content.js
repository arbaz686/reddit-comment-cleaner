let isProcessing = false;
let isPaused = false;
let deleteCount = 0;
let intervalId = null;

// Create a persistent control panel UI
function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = "rdc-controls";
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.backgroundColor = 'white';
    panel.style.padding = '15px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    panel.style.zIndex = '10000';
    panel.style.display = 'flex';
    panel.style.gap = '10px';
    panel.style.alignItems = 'center';

    panel.innerHTML = `
        <div id="rdc-counter" style="font-weight: bold; color: #ff4500;">Deleted: 0</div>
        <button id="rdc-toggle" style="padding: 8px 12px; background: #ff4500; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle;">
                <path fill="currentColor" d="M6 4h4v16H6zm8 0h4v16h-4z"/>
            </svg>
            Pause
        </button>
        <button id="rdc-reset" style="padding: 8px 12px; background: #878a8c; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
        <button id="rdc-close" style="padding: 4px 8px; background: #ff4500; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 14px; font-weight: bold;">✕</button>
    `;

    document.body.appendChild(panel);
}

// Initialize UI and stored data
chrome.storage.local.get(['deleteCount', 'isPaused'], (data) => {
    deleteCount = data.deleteCount || 0;
    isPaused = data.isPaused || false;

    createControlPanel();
    updateUI();
});

// Start deleting if the user triggered it from the popup
if (localStorage.getItem('deleteActive') === 'true') {
    startProcessing();
}

function startProcessing() {
    isProcessing = true;
    localStorage.removeItem('deleteActive');

    intervalId = setInterval(async () => {
        if (isPaused || !isProcessing) return;

        const deleteLinks = document.querySelectorAll('a[data-event-action="delete"]');
        if (deleteLinks.length === 0) {
            clearInterval(intervalId);
            isProcessing = false;
            return;
        }

        // Click the delete button
        deleteLinks[0].click();
        await new Promise(r => setTimeout(r, 1000));

        // Click the confirmation "Yes" button
        const confirmYes = document.querySelector('form.toggle.del-button a.yes');
        if (confirmYes) {
            confirmYes.click();
            deleteCount++;
            chrome.storage.local.set({ deleteCount });
            updateUI();

            // Wait to ensure the comment is deleted before continuing
            await new Promise(r => setTimeout(r, 1500));
        }
    }, 3000);
}

function updateUI() {
    document.getElementById('rdc-counter').textContent = `Deleted: ${deleteCount}`;
    
    const toggleBtn = document.getElementById('rdc-toggle');
    toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle;">
            <path fill="currentColor" d="${isPaused ? 
                'M8 5v14l11-7z' :  // ▶ Play Icon
                'M6 4h4v16H6zm8 0h4v16h-4z' // ⏸ Pause Icon
            }"/>
        </svg>
        ${isPaused ? 'Resume' : 'Pause'}
    `;
}

// Handle button actions
document.addEventListener('click', (e) => {
    if (e.target.closest('#rdc-toggle')) {
        isPaused = !isPaused;
        chrome.storage.local.set({ isPaused });
        updateUI();

        if (!isPaused && !isProcessing) {
            startProcessing();
        }
    }

    if (e.target.closest('#rdc-reset')) {
        deleteCount = 0;
        chrome.storage.local.set({ deleteCount: 0 });
        updateUI();
    }

    if (e.target.closest('#rdc-close')) {
        // Stop all processes, keep counter, and hide the panel
        clearInterval(intervalId);
        isProcessing = false;
        isPaused = true;
        chrome.storage.local.set({ isPaused });

        document.getElementById('rdc-controls').remove();
    }
});
