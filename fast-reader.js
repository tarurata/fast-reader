(function() {
    const delay = 500; // Set delay in milliseconds (adjust to change speed)
    const wordSpanId = 'highlighted-word'; // ID for the current highlighted word
    let isRunning = false;
    let index = 0;
    let words = [];
    let currentParagraph = null;

    // Function to highlight a word
    function highlightWord() {
        console.log("index is ", index);
        console.log("words.length is ", words.length);
        if (index >= words.length) {
            console.log('Highlighting completed.');
            isRunning = false;
            return;
        }

        // Restore the previous word to normal (remove highlight)
        if (index > 0) {
            const previousWord = document.getElementById(wordSpanId);
            if (previousWord) {
                console.log(`Removing highlight from: "${previousWord.textContent.trim()}"`);
                previousWord.style.background = '';
                previousWord.id = '';
            }
        }

        // Highlight the current word
        const wordSpan = currentParagraph.querySelectorAll('.clickable-word')[index];
        console.log("Now, highlight word with yellow", wordSpan);
        wordSpan.style.background = 'yellow';
        wordSpan.id = wordSpanId;
        console.log(`Highlighting word: "${wordSpan.textContent.trim()}"`);

        index++;
        setTimeout(highlightWord, delay);
    }

    // Function to handle word click
    function wordClickHandler(event) {
        if (isRunning) return; // Prevent starting again if already running

        const clickedWord = event.target;
        console.log(`Clicked word: "${clickedWord.textContent.trim()}"`);

        // Set the current paragraph to the parent of the clicked word
        currentParagraph = clickedWord.closest('p');
        console.log("currentParagraph", currentParagraph);

        const words = Array.from(currentParagraph.querySelectorAll('.clickable-word'));
        console.log("words", words);
        const textBeforeClick = words.slice(0, words.indexOf(clickedWord));
        index = textBeforeClick.length; // Set index to the clicked word's position

        console.log(`Starting index set to: ${index}`);
        isRunning = true;
        highlightWord();
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
        index = wordIndex;
        isRunning = true;
        highlightWord();
    }

    // Function to stop highlighting
    function stopHighlighting() {
        isRunning = false;
        const highlightedWord = document.getElementById(wordSpanId);
        if (highlightedWord) {
            highlightedWord.style.background = '';
            highlightedWord.id = '';
        }
    }

    // Initialize paragraphs
    initializeParagraphs();

    // Make functions and variables accessible from the console
    window.FastReader = {
        start: startHighlighting,
        stop: stopHighlighting,
        initialize: initializeParagraphs,
        getState: () => ({ isRunning, currentParagraph, index, wordsCount: words.length })
    };

    console.log('FastReader is now accessible from the console. Use FastReader.start(paragraphIndex, wordIndex) to begin.');
})();