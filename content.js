// find the submit button and listen to the event
const submitButtonObserver = new MutationObserver((mutation) => {
    console.log("Mutation observed in DOM for submit button.");
    
    // Select the submit button
    const submitButton = document.querySelector('[data-e2e-locator="console-submit-button"]');
    
    // If the button is found, log it and disconnect the observer
    if (submitButton) {
        console.log("Submit button found:", submitButton);
        submitButtonObserver.disconnect(); // Stop observing once the button is found

        // Now you can attach your event listener to the submit button
        submitButton.addEventListener('click', async () => {
            console.log("Submit button clicked.");
            
            // Wait for a brief moment to allow for the code editor to be ready
            setTimeout(async () => {
                console.log("Checking if the user code is accepted...");
                const userCodeIsAccepted = await isAccepted();
                
                if (userCodeIsAccepted) {
                    console.log("User code accepted.");
                    const userCode = await extractUserCode();
                    showFloatingWindow(userCode.length);
                } else {
                    console.log("User code is not accepted.");
                }
            }, 1000);
        });
    } else {
        console.log("Submit button not yet available in the DOM.");
    }
});

// Start observing for changes in the DOM
submitButtonObserver.observe(document.body, {
    childList: true, // Observe direct child elements being added or removed
    subtree: true    // Observe the entire DOM subtree
});

// check if the code is accepted
async function isAccepted() {
    return new Promise((resolve) => {
        console.log("Starting observer to check if submission result is accepted.");
        const submitResultObserver = new MutationObserver((mutation) => {
            const resultNode = document.querySelector('[data-e2e-locator="submission-result"]');
            
            if (resultNode) {
                console.log("Submission result found:", resultNode.textContent);
                submitResultObserver.disconnect();
                resolve(resultNode.textContent === 'Accepted'); // Resolve the promise with the extracted code
            }
        });

        submitResultObserver.observe(document.body, {
            childList: true, // Observe direct child elements being added or removed
            subtree: true    // Observe the entire DOM subtree
        });
    });
}

// Extract user code
async function extractUserCode() {
    return new Promise((resolve) => {
        console.log("Starting observer to extract user code.");
        const submitStateObserver = new MutationObserver((mutation) => {
            const codeParentNode = document.querySelector('[class="group relative"]');
            
            if (codeParentNode) {
                console.log("Code parent node found:", codeParentNode);
                submitStateObserver.disconnect();
                
                const userCode = getUserCode(codeParentNode);
                console.log("User code gathered from parent node");
                resolve(userCode); // Resolve the promise with the extracted code
            }
        });

        submitStateObserver.observe(document.body, {
            childList: true, // Observe direct child elements being added or removed
            subtree: true    // Observe the entire DOM subtree
        });
    });
}

function getUserCode(parentNode) {
    let codeLines = [];
    const codeEditorLines = parentNode.getElementsByTagName('span');
    if (codeEditorLines) {
        for (const line of codeEditorLines) {
            let text = line.textContent;
            if (text) codeLines.push(text);
        }
    }
    return codeLines.join('\n');
}


// Function to display the result in a floating window
function showFloatingWindow(result) {
    console.log("Displaying floating window with result:", result);
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
    console.log("Floating window appended to body.");

    document.getElementById("closeFloatingWindow").addEventListener("click", () => {
      console.log("Closing floating window.");
      floatingWindow.remove();
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
}