chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'displayLength') {
        document.getElementById('output').textContent = `Length of <span> text: ${request.length}`;
    }
});