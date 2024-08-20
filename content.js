(function() {
    const wordSpanId = 'highlighted-word'; // ID for the current highlighted word
    let isRunning = false;
    let index = 0;
    let words = [];
    let currentParagraph = null;
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

        // Set the current paragraph to the parent of the clicked word
        currentParagraph = clickedWord.closest('p');
        console.log("currentParagraph", currentParagraph);

        // Update the words array for the current paragraph
        words = Array.from(currentParagraph.querySelectorAll('.clickable-word'));
        console.log("Updated words array:", words);

        const textBeforeClick = words.slice(0, words.indexOf(clickedWord));
        index = textBeforeClick.length; // Set index to the clicked word's position

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

    // Prepare the paragraph for word click handling
    function prepareParagraph(paragraph) {
        const nodes = Array.from(paragraph.childNodes);
        console.log('Preparing paragraph for highlighting...');

        // Reset the paragraph's HTML
        paragraph.innerHTML = '';

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/\s+/).filter(Boolean);

                words.forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'clickable-word';
                    wordSpan.textContent = word + ' ';
                    paragraph.appendChild(wordSpan);
                });

                console.log(`Text node processed: "${node.textContent.trim()}"`);
            } else {
                paragraph.appendChild(node);
                console.log(`Non-text node preserved: ${node.outerHTML}`);
            }
        });

        // Set the current paragraph
        currentParagraph = paragraph;

        // Add click event listener to all words in this paragraph
        paragraph.querySelectorAll('.clickable-word').forEach(word => {
            word.addEventListener('click', wordClickHandler);
            console.log(`Added click listener to word: "${word.textContent.trim()}"`);
        });
    }

    // Apply the script to all <p> tags
    function initializeParagraphs() {
        document.querySelectorAll('p').forEach(paragraph => {
            prepareParagraph(paragraph);
        });
    }

    // Function to start highlighting from a specific paragraph and word index
    function startHighlighting(paragraphIndex, wordIndex = 0) {
        const paragraphs = document.querySelectorAll('p');
        if (paragraphIndex < 0 || paragraphIndex >= paragraphs.length) {
            console.error('Invalid paragraph index');
            return;
        }
        currentParagraph = paragraphs[paragraphIndex];
        words = Array.from(currentParagraph.querySelectorAll('.clickable-word'));
        console.log("words count is", words.length); // Debug log
        if (words.length === 0) {
            console.error("No words found in the paragraph. Make sure initializeParagraphs() has been called.");
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
            FastReader.start(0, 0);
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
        initialize: initializeParagraphs,
        getState: () => ({ 
            isRunning, 
            currentParagraph: currentParagraph ? currentParagraph.textContent : null, 
            index, 
            wordsCount: words.length,
            words: words.map(w => w.textContent)
        })
    };
})();