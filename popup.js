document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Load stored delete count
    chrome.storage.local.get(['deleteCount'], (data) => {
        counter.textContent = `Deleted: ${data.deleteCount || 0}`;
    });

    // Start deletion and close popup
    startBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: startDeletion
            });
        });

        // Close the popup automatically
        window.close();
    });

    // Reset deletion count
    resetBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: resetDeletion
            });
        });
        chrome.storage.local.set({ deleteCount: 0 }, () => {
            counter.textContent = `Deleted: 0`;
        });
    });
});

// Function injected into the page
function startDeletion() {
    localStorage.setItem('deleteActive', 'true');
    location.reload();
}

function resetDeletion() {
    localStorage.removeItem('deleteActive');
    localStorage.setItem('deleteCount', '0');
    location.reload();
}
