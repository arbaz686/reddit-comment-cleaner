document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter');
    const toggleBtn = document.getElementById('toggleBtn');
    const stopBtn = document.getElementById('stopBtn');
    let isPaused = false;
  
    // Initialize from storage
    chrome.storage.local.get(['deleteCount', 'isPaused'], (data) => {
      counter.textContent = `Deleted: ${data.deleteCount || 0}`;
      isPaused = data.isPaused || false;
      updateButtonState();
    });
  
    // Toggle button handler
    toggleBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      chrome.runtime.sendMessage({
        action: isPaused ? 'pause' : 'resume'
      });
      chrome.storage.local.set({ isPaused });
      updateButtonState();
    });
  
    // Stop button handler
    stopBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'stop' });
      chrome.storage.local.set({
        deleteCount: 0,
        isPaused: true
      });
      counter.textContent = 'Deleted: 0';
      isPaused = true;
      updateButtonState();
    });
  
    // Update button appearance
    function updateButtonState() {
      toggleBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="${isPaused ? 
            'M8 5v14l11-7z' : 
            'M6 4h4v16H6zm8 0h4v16h-4z'}"/>
        </svg>
        ${isPaused ? 'Resume' : 'Pause'}
      `;
      toggleBtn.style.opacity = isPaused ? '0.8' : '1';
      stopBtn.style.opacity = '1';
    }
  
    // Handle storage updates
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.deleteCount) {
        counter.textContent = `Deleted: ${changes.deleteCount.newValue}`;
      }
      if (changes.isPaused) {
        isPaused = changes.isPaused.newValue;
        updateButtonState();
      }
    });
  });