(function() {
    const wordSpanId = 'highlighted-word'; // ID for the current highlighted word
    let isRunning = false;
    let index = 0;
    let words = [];
    let highlightTimeout = null;
    let delay = 250; // Default delay (250 WPM)

    // Function to highlight a word
    function highlightWord() {
        if (!isRunning || index >= words.length) {
            console.log('Highlighting completed or stopped.');
            isRunning = false;
            return;
        }

        // Restore the previous word to normal (remove highlight)
        if (index > 0) {
            const previousWord = words[index - 1];
            if (previousWord) {
                console.log(`Removing highlight from: "${previousWord.textContent.trim()}"`);
                previousWord.style.background = '';
                previousWord.id = '';
            }
        }

        // Highlight the current word
        const wordSpan = words[index];
        console.log("Now, highlight word with yellow", wordSpan);
        wordSpan.style.background = 'yellow';
        wordSpan.id = wordSpanId;
        console.log(`Highlighting word: "${wordSpan.textContent.trim()}"`);

        index++;
        highlightTimeout = setTimeout(highlightWord, delay);
    }

    // Function to handle word click
    function wordClickHandler(event) {
        const clickedWord = event.target;
        console.log(`Clicked word: "${clickedWord.textContent.trim()}"`);

        // Stop the current highlighting
        stopHighlighting();

        // Update the words array to include all clickable words in the document
        words = Array.from(document.querySelectorAll('.clickable-word'));
        console.log("Updated words array:", words);

        // Set index to the clicked word's position
        index = words.indexOf(clickedWord);

        console.log(`Starting index set to: ${index}`);
        isRunning = true;
        highlightWord();
    }

    // Function to stop highlighting
    function stopHighlighting() {
        isRunning = false;
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
            highlightTimeout = null;
        }
        const highlightedWord = document.getElementById(wordSpanId);
        if (highlightedWord) {
            highlightedWord.style.background = '';
            highlightedWord.id = '';
        }
    }

    // Rename and modify this function
    function initializeTextElements() {
        const textElements = document.body.querySelectorAll('*:not(script):not(style)');
        textElements.forEach(element => {
            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.textContent.trim().length > 0) {
                prepareTextElement(element);
            }
        });
    }

    // Modify this function to work with any element
    function prepareTextElement(element) {
        const nodes = Array.from(element.childNodes);
        console.log('Preparing element for highlighting...');

        // Reset the element's HTML
        element.innerHTML = '';

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/\s+/).filter(Boolean);

                words.forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'clickable-word';
                    wordSpan.textContent = word + ' ';
                    element.appendChild(wordSpan);
                });

                console.log(`Text node processed: "${node.textContent.trim()}"`);
            } else {
                element.appendChild(node);
                window.console.log(`Non-text node preserved: ${node.outerHTML}`);
            }
        });

        // Add click event listener to all words in this element
        element.querySelectorAll('.clickable-word').forEach(word => {
            word.addEventListener('click', wordClickHandler);
            console.log(`Added click listener to word: "${word.textContent.trim()}"`);
        });
    }

    // Modify the startHighlighting function
    function startHighlighting(wordIndex = 0) {
        words = Array.from(document.querySelectorAll('.clickable-word'));
        console.log("words count is", words.length); // Debug log
        if (words.length === 0) {
            console.error("No words found. Make sure initializeTextElements() has been called.");
            return;
        }
        index = wordIndex;
        isRunning = true;
        highlightWord();
    }

    // Modify the window.FastReader object to use message passing
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "initialize") {
            FastReader.initialize();
        } else if (request.action === "start") {
            delay = request.delay || delay;
            FastReader.start(0);
        } else if (request.action === "stop") {
            FastReader.stop();
        } else if (request.action === "updateDelay") {
            delay = request.delay;
            if (highlightTimeout) {
                stopHighlighting();
                highlightWord();
            }
        }
    });

    // Make functions and variables accessible from the console
    window.FastReader = {
        start: startHighlighting,
        stop: stopHighlighting,
        initialize: initializeTextElements,
        getState: () => ({ 
            isRunning, 
            index, 
            wordsCount: words.length,
            words: words.map(w => w.textContent)
        })
    };
})();