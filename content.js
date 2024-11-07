const observer = new MutationObserver((mutation) => {
    // Select the submit button
    const submitButton = document.querySelector('[data-e2e-locator="console-submit-button"]');
    
    // If the button is found, log it and disconnect the observer
    if (submitButton) {
        console.log('Button found:', submitButton); // Correct variable name
        observer.disconnect(); // Stop observing once the button is found

        // Now you can attach your event listener to the submit button
        submitButton.addEventListener('click', async () => {
            // Wait for a brief moment to allow for the code editor to be ready
            setTimeout(async () => {
                showFloatingWindow("success!");
            }, 3000);
        });
    }
});

// Start observing for changes in the DOM
observer.observe(document.body, {
    childList: true, // Observe direct child elements being added or removed
    subtree: true    // Observe the entire DOM subtree
});


// Function to display the result in a floating window
function showFloatingWindow(result) {
    const floatingWindow = document.createElement("div");
    floatingWindow.style.position = "fixed";
    floatingWindow.style.top = "20px"; // Distance from the top of the page
    floatingWindow.style.right = "20px"; // Distance from the right of the page
    floatingWindow.style.width = "300px"; // Adjust width as needed
    floatingWindow.style.padding = "20px";
    floatingWindow.style.backgroundColor = "#fff";
    floatingWindow.style.borderRadius = "8px";
    floatingWindow.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    floatingWindow.style.zIndex = "9999"; // Ensure the window is on top
    floatingWindow.style.textAlign = "center";
    floatingWindow.style.overflow = "auto"; // Allow scrolling if needed
    floatingWindow.style.maxHeight = "80%"; // Prevent it from growing too large

  
    floatingWindow.innerHTML = `
      <h4>Time Complexity Analysis</h4>
      <p>Estimated Time Complexity: <strong>${result}</strong></p>
      <button id="closeFloatingWindow" style="margin-top: 10px; padding: 8px 12px;">Close</button>
    `;
  
    document.body.appendChild(floatingWindow);
  
    document.getElementById("closeFloatingWindow").addEventListener("click", () => {
      floatingWindow.remove();
      overlay.remove();
    });

    // Drag and Drop Implementation
    let offsetX, offsetY;
    let isDragging = false;

    // Function to start dragging
    floatingWindow.addEventListener("mousedown", (e) => {
        isDragging = true;
        // Calculate the offset of the mouse from the top-left corner of the floating window
        offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
        offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;

        // Change cursor to indicate dragging
        floatingWindow.style.cursor = "move";
    });

    // Function to drag the window
    window.addEventListener("mousemove", (e) => {
        if (isDragging) {
            // Update the position of the floating window based on the mouse movement
            floatingWindow.style.left = `${e.clientX - offsetX}px`;
            floatingWindow.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Function to stop dragging
    window.addEventListener("mouseup", () => {
        isDragging = false;
        floatingWindow.style.cursor = "default"; // Reset cursor
    });

    // Make sure the overlay is semi-transparent, but doesn't prevent interaction
    overlay.addEventListener('click', (e) => {
        // If the user clicks on the overlay, we can close the floating window or handle other events.
        if (e.target === overlay) {
            floatingWindow.remove();
            overlay.remove();
        }
    });
}