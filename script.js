document.getElementById('searchForm').addEventListener('submit', async function(e) {
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
                    ''
                );
                sections.push(...insertEmptyLines(data.frameworks[searchTerm]));
                sections.push('');
            }
            if (data.os[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getOSDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.os[searchTerm]));
                sections.push('');
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
            resultDiv.innerHTML = `<pre>${formattedOutput}</pre>`;
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

// Helper function for environment descriptions
function getEnvironmentDescription(environment) {
    const descriptions = {
        docker: 'Docker environment specific files and directories',
        kubernetes: 'Kubernetes configuration and deployment files',
        terraform: 'Terraform state and configuration files'
    };
    return descriptions[environment] || `${environment} environment specific files`;
}

// Helper function to get editor descriptions
function getEditorDescription(editor) {
    const descriptions = {
        vscode: 'Visual Studio Code editor settings and workspace files',
        intellij: 'IntelliJ IDEA editor files and settings',
        eclipse: 'Eclipse IDE specific files and settings',
        sublime: 'Sublime Text editor files and workspace settings',
        vim: 'Vim editor swap and temporary files',
        atom: 'Atom editor settings and workspace files',
        webstorm: 'WebStorm IDE specific files and settings',
        phpstorm: 'PhpStorm IDE specific files and settings',
        xcode: 'Xcode IDE files and build settings',
        androidstudio: 'Android Studio IDE files and settings'
    };
    return descriptions[editor] || `${editor} editor specific files`;
}

// Helper function to get version control system descriptions
function getVCSDescription(vcs) {
    const descriptions = {
        git: 'Git version control system files and directories',
        svn: 'Subversion version control system files',
        mercurial: 'Mercurial version control system files',
        cvs: 'CVS version control system files',
        bazaar: 'Bazaar version control system files'
    };
    return descriptions[vcs] || `${vcs} version control system files`;
}

// Helper function to get build tool descriptions
function getBuildToolDescription(buildTool) {
    const descriptions = {
        maven: 'Maven build tool files and directories',
        gradle: 'Gradle build tool files and directories',
        ant: 'Apache Ant build tool files',
        webpack: 'Webpack build configuration and cache',
        gulp: 'Gulp build tool files and dependencies',
        grunt: 'Grunt build tool files and configurations',
        babel: 'Babel transpiler configuration and cache',
        make: 'Make build system files and outputs',
        cmake: 'CMake build system files and cache'
    };
    return descriptions[buildTool] || `${buildTool} build tool specific files`;
}

// Helper function to get package manager descriptions
function getPackageManagerDescription(packageManager) {
    const descriptions = {
        npm: 'NPM package manager files and directories',
        yarn: 'Yarn package manager files and cache',
        pip: 'Python pip package manager files',
        composer: 'PHP Composer package manager files',
        nuget: 'NuGet package manager files and packages',
        cargo: 'Rust Cargo package manager files',
        gem: 'Ruby gems package manager files',
        maven: 'Maven package manager repository files',
        cocoapods: 'CocoaPods package manager files',
        pub: 'Dart/Flutter pub package manager files'
    };
    return descriptions[packageManager] || `${packageManager} package manager specific files`;
}

// Helper function to get security and credentials descriptions
function getSecurityAndCredentialsDescription(securityItem) {
    const descriptions = {
        ssh: 'SSH keys and configuration files',
        ssl: 'SSL certificates and private keys',
        apikeys: 'API keys and access tokens',
        env: 'Environment files containing sensitive data',
        credentials: 'Various credential files and tokens',
        certificates: 'Digital certificates and related files',
        secrets: 'Secret management files and configurations',
        keys: 'Encryption and signing keys',
        passwords: 'Password files and configurations',
        tokens: 'Authentication and access tokens'
    };
    return descriptions[securityItem] || `${securityItem} security related files`;
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
