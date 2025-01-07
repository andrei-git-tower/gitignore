document.getElementById('searchForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        try {
            const searchTerms = document.getElementById('searchInput').value
                .toLowerCase()
                .split(',')
                .map(term => term.trim())
                .filter(term => term);

            const response = await fetch('/data/templates.json');
            const data = await response.json();

            const resultDiv = document.getElementById('result');

            // Create sections for each term
            let sections = [];
            const timestamp = new Date().toISOString().split('T')[0];

            // Add header
            sections.push(
                `# gitignore file created for free with Git Tower`,
                `# Generated on ${timestamp}`,
                `# Includes: ${searchTerms.join(', ')}`,
                '' // Add an empty line after the header
            );

            // Process each search term
            searchTerms.forEach(searchTerm => {
                if (data.frameworks[searchTerm]) {
                    sections.push(
                        `### ${capitalize(searchTerm)} ###`,
                        `# ${getFrameworkDescription(searchTerm)}`,
                        '' // Add an empty line before the patterns section
                    );

                    // Add patterns with empty lines between logical groups
                    sections.push(...insertEmptyLines(data.frameworks[searchTerm]));
                    sections.push(''); // Add an empty line after the section
                }

                if (data.os[searchTerm]) {
                    sections.push(
                        `### ${capitalize(searchTerm)} ###`,
                        `# ${getOSDescription(searchTerm)}`,
                        '' // Add an empty line before the patterns section
                    );

                    // Add patterns with empty lines between logical groups
                    sections.push(...insertEmptyLines(data.os[searchTerm]));
                    sections.push(''); // Add an empty line after the section
                }

                if (data.environment_specific_files[searchTerm]) {
                    sections.push(
                        `### ${capitalize(searchTerm)} ###`,
                        `# ${getEnvironmentDescription(searchTerm)}`,
                        ''
                    );
                    sections.push(...insertEmptyLines(data.environment_specific_files[searchTerm]));
                    sections.push('');
                }
            });

            if (sections.length > 4) { // More than just the header
                const formattedOutput = sections.join('\n');
                resultDiv.innerHTML = `
                    <pre>${formattedOutput}</pre>
                `;
                
                // Add the copy button after the result div
                resultDiv.insertAdjacentHTML('afterend', `
                    <button class="copy-button" onclick="copyToClipboard()">Copy to Clipboard</button>
                `);
            } else {
                resultDiv.innerHTML = 'No matching templates found';
            }
        } catch (error) {
            console.error('Error:', error);
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = 'Error loading templates';
        }
    });

    // Helper function to get framework descriptions
    function getFrameworkDescription(framework) {
        const descriptions = {
            node: 'Node.js dependency directory, logs, and environment files',
            react: 'React build directory and environment files',
            python: 'Python compiled files, virtual environments, and cache',
            java: 'Java compiled files, build directories, and IDE files',
            angular: 'Angular build files, dependencies, and IDE settings',
            vue: 'Vue.js build files and development artifacts',
            django: 'Django specific files, database, and media files',
            dotnet: '.NET build outputs and development files',
            flutter: 'Flutter/Dart build files and dependencies',
            laravel: 'Laravel framework specific files and directories'
        };
        return descriptions[framework] || `${framework} specific files`;
    }

    // Helper function to get OS descriptions
    function getOSDescription(os) {
        const descriptions = {
            windows: 'Windows operating system specific files',
            macos: 'macOS operating system specific files',
            linux: 'Linux operating system specific files'
        };
        return descriptions[os] || `${os} specific files`;
    }

    // Add this new helper function for environment descriptions
    function getEnvironmentDescription(environment) {
        const descriptions = {
            docker: 'Docker environment specific files and directories',
            kubernetes: 'Kubernetes configuration and deployment files',
            terraform: 'Terraform state and configuration files'
        };
        return descriptions[environment] || `${environment} environment specific files`;
    }

    // Helper function to capitalize terms
    function capitalize(term) {
        return term.charAt(0).toUpperCase() + term.slice(1);
    }

    // Helper function to add empty lines between logical groups of patterns
    function insertEmptyLines(patterns) {
        const groupedPatterns = [];
        patterns.forEach((pattern, index) => {
            groupedPatterns.push(pattern);
            
            // Add an empty line after every logical group (you can customize this logic)
            if ((index + 1) % 5 === 0 && index !== patterns.length - 1) {
                groupedPatterns.push('');
            }
        });
        return groupedPatterns;
    }

    function copyToClipboard() {
        const preElement = document.querySelector('#result pre');
        if (preElement) {
            const textToCopy = preElement.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const copyButton = document.querySelector('.copy-button');
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }