chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'showCodeLength') {
        // Send the length to the popup script
        chrome.runtime.sendMessage({ type: 'displayLength', length: request.length });
    }
});