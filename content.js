let isProcessing = false;
let isPaused = false;
let deleteCount = 0;
let intervalId = null;

// Create persistent UI
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
    <button id="rdc-stop" style="padding: 8px 12px; background: #878a8c; color: white; border: none; border-radius: 4px; cursor: pointer;">
      <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle;">
        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
      Stop
    </button>
  `;

  document.body.appendChild(panel);
}

// Initialize
chrome.storage.local.get(['deleteCount', 'isPaused'], (data) => {
  deleteCount = data.deleteCount || 0;
  isPaused = data.isPaused || false;
  
  createControlPanel();
  updateUI();
  
  if (!isPaused) {
    startProcessing();
  }
});

function startProcessing() {
  intervalId = setInterval(processDeletion, 1000);
}

function updateUI() {
  document.getElementById('rdc-counter').textContent = `Deleted: ${deleteCount}`;
  const toggleBtn = document.getElementById('rdc-toggle');
  toggleBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="${isPaused ? 
        'M8 5v14l11-7z' : 
        'M6 4h4v16H6zm8 0h4v16h-4z'}"/>
    </svg>
    ${isPaused ? 'Resume' : 'Pause'}
  `;
}

// Button handlers
document.addEventListener('click', (e) => {
  if (e.target.closest('#rdc-toggle')) {
    isPaused = !isPaused;
    chrome.storage.local.set({ isPaused });
    
    if (isPaused) {
      clearInterval(intervalId);
    } else {
      startProcessing();
    }
    updateUI();
  }
  
  if (e.target.closest('#rdc-stop')) {
    clearInterval(intervalId);
    isPaused = true;
    deleteCount = 0;
    chrome.storage.local.set({ 
      deleteCount: 0,
      isPaused: true
    });
    updateUI();
  }
});

// Deletion process (same as before)
async function processDeletion() {
  if (isPaused || isProcessing) return;
  
  const deleteLinks = document.querySelectorAll('a[data-event-action="delete"]');
  if (deleteLinks.length === 0) return;

  isProcessing = true;
  
  try {
    deleteLinks[0].click();
    await new Promise(r => setTimeout(r, 1000));
    
    const confirmYes = document.querySelector('form.toggle.del-button a.yes');
    if (confirmYes) {
      confirmYes.click();
      deleteCount++;
      chrome.storage.local.set({ deleteCount });
      updateUI();
      
      if (deleteCount % 25 === 0) {
        const nextButton = document.querySelector('span.next-button a');
        if (nextButton) {
          nextButton.click();
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  } finally {
    isProcessing = false;
  }
}