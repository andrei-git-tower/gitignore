document.addEventListener('DOMContentLoaded', function() {
    let selectedTags = new Set();
    let allTerms = [];
    let currentSuggestions = []; // Array to store current suggestions
    let selectedSuggestionIndex = -1; // Track which suggestion is selected
    let visibleSuggestions = []; // Store current visible suggestions

    initializeTerms();

    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Use the selectedTags Set directly instead of getting value from input
        const searchTerms = Array.from(selectedTags)
            .map(term => term.toLowerCase())
            .filter(term => term);

        if (searchTerms.length === 0) {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<div class="error-message">⚠️ Please select at least one item to generate a .gitignore file</div>';
            resultDiv.classList.add('show');
            const existingButtons = document.querySelectorAll('.copy-button, .download-button');
            existingButtons.forEach(button => button.remove());
            resultDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        fetch('./gitignore-data/gitignore-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const resultDiv = document.getElementById('result');
                let sections = [];
                const timestamp = new Date().toISOString().split('T')[0];
                document.getElementById('result').classList.add('show');

                // Add header
                sections.push(
                    `# gitignore file created for free with Git Tower`,
                    `# Generated on ${timestamp}`,
                    `# Includes: ${searchTerms.join(', ')}`,
                    ''
                );

                // Add universal patterns first
                sections.push(
                    `### Universal ###`,
                    `# Common files that should be ignored in all projects`,
                    ''
                );
                sections.push(...insertEmptyLines(data.basic.universal));
                sections.push('');

                // Process each search term
                searchTerms.forEach(searchTerm => {
                    if (data.frameworks[searchTerm]) {
                        sections.push(
                            `### ${capitalize(searchTerm)} ###`,
                            `# ${getFrameworkDescription(searchTerm)}`,
                            ''
                        );
                        sections.push(...insertEmptyLines(data.frameworks[searchTerm]));
                        sections.push('');
                    }
                    // ... [Continue with all other category checks]
                    // Note: All the if blocks for different categories would go here
                    // I'll include them in Part 2 for better organization
                });

                if (sections.length > 4) {
                    const formattedOutput = sections.join('\n');
                    resultDiv.innerHTML = `<pre>${formattedOutput}</pre>`;
                    const existingButtons = document.querySelectorAll('.copy-button, .download-button');
                    existingButtons.forEach(button => button.remove());
                    resultDiv.insertAdjacentHTML('afterend', `
                        <div class="button-container">
                            <button class="download-button" onclick="downloadFile()">Download File</button>
                            <button class="copy-button" onclick="copyToClipboard()">Copy to Clipboard</button>
                        </div>
                    `);
                } else {
                    resultDiv.innerHTML = 'No matching templates found';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = 'Error loading templates';
            });
    });

    // Input event listeners
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const input = e.target.value.toLowerCase();
        const suggestionsContainer = document.getElementById('suggestions');
        suggestionsContainer.innerHTML = '';
        selectedSuggestionIndex = -1;

        if (input.length < 2) {
            suggestionsContainer.style.display = 'none';
            visibleSuggestions = [];
            return;
        }

        visibleSuggestions = allTerms.filter(term =>
            term.toLowerCase().includes(input) && !selectedTags.has(term)
        );

        if (visibleSuggestions.length > 0) {
            visibleSuggestions.forEach((term, index) => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = term;
                div.setAttribute('data-index', index);
                div.addEventListener('click', () => {
                    addTag(term);
                    suggestionsContainer.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
            visibleSuggestions = [];
        }
    });

      // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            document.getElementById('suggestions').style.display = 'none';
        }
    });

    // Keyboard navigation for suggestions
    document.getElementById('searchInput').addEventListener('keydown', function(e) {
        const suggestionsContainer = document.getElementById('suggestions');
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (suggestionsContainer.style.display === 'block') {
                    selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, visibleSuggestions.length - 1);
                    updateSuggestionHighlight();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (suggestionsContainer.style.display === 'block') {
                    selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                    updateSuggestionHighlight();
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (!this.value.trim()) {
                    document.getElementById('searchForm').dispatchEvent(new Event('submit'));
                    return;
                }
                if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < visibleSuggestions.length) {
                    addTag(visibleSuggestions[selectedSuggestionIndex]);
                    suggestionsContainer.style.display = 'none';
                    selectedSuggestionIndex = -1;
                    this.value = '';
                } else if (visibleSuggestions.length > 0) {
                    addTag(visibleSuggestions[0]);
                    suggestionsContainer.style.display = 'none';
                    this.value = '';
                }
                break;
        }
    });

    // Helper Functions
    function updateSuggestionHighlight() {
        const suggestions = document.querySelectorAll('.suggestion-item');
        suggestions.forEach((suggestion, index) => {
            if (index === selectedSuggestionIndex) {
                suggestion.classList.add('selected');
            } else {
                suggestion.classList.remove('selected');
            }
        });
    }

    function initializeTerms() {
        fetch('./gitignore-data/gitignore-data.json')
            .then(response => response.json())
            .then(data => {
                allTerms = [
                    ...Object.keys(data.frameworks || {}),
                    ...Object.keys(data.os || {}),
                    ...Object.keys(data.environment_specific_files || {}),
                    ...Object.keys(data.editors || {}),
                    ...Object.keys(data.vcs || {}),
                    ...Object.keys(data.build_tools || {}),
                    ...Object.keys(data.package_managers || {}),
                    ...Object.keys(data.security_and_credentials || {}),
                    ...Object.keys(data.cicd_tools || {}),
                    ...Object.keys(data.cloud_providers || {}),
                    ...Object.keys(data.data_science || {}),
                    ...Object.keys(data.game_engines || {})
                ];
                allTerms = [...new Set(allTerms)];
            })
            .catch(error => {
                console.error('Error initializing terms:', error);
            });
    }

    function copyToClipboard() {
        const preElement = document.querySelector('#result pre');
        if (preElement) {
            const textToCopy = preElement.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const copyButton = document.querySelector('.copy-button');
                        const originalText = copyButton.textContent;
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            } else {
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const copyButton = document.querySelector('.copy-button');
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
                document.body.removeChild(textArea);
            }
        }
    }

    function downloadFile() {
        const preElement = document.querySelector('#result pre');
        if (preElement) {
            const content = preElement.textContent;
            const blob = new Blob([content], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gitignore';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            const downloadButton = document.querySelector('.download-button');
            const originalText = downloadButton.textContent;
            downloadButton.textContent = 'Downloaded!';
            setTimeout(() => {
                downloadButton.textContent = originalText;
            }, 2000);
        }
    }

    // Tag Management Functions
    function addTag(term) {
        if (!selectedTags.has(term)) {
            selectedTags.add(term);
            renderTags();
        }
        document.getElementById('searchInput').value = '';
        document.getElementById('suggestions').innerHTML = '';
    }

    function removeTag(term) {
        selectedTags.delete(term);
        renderTags();
    }

    function renderTags() {
        const tagsContainer = document.getElementById('selectedTags');
        tagsContainer.innerHTML = '';
        selectedTags.forEach(term => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${term}
                <button class="tag-remove" onclick="removeTag('${term}')">&times;</button>
            `;
            tagsContainer.appendChild(tagElement);
        });
    }

    // Make functions globally accessible
    window.copyToClipboard = copyToClipboard;
    window.downloadFile = downloadFile;
    window.removeTag = removeTag;
    window.handleSuggestionClick = handleSuggestionClick;
});



                          
