document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const searchTerms = document.getElementById('searchInput').value
            .toLowerCase()
            .split(',')
            .map(term => term.trim())
            .filter(term => term);

        let response;
        try {
            response = await fetch('/data/templates.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            throw new Error('Failed to fetch templates file');
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            throw new Error('Failed to parse templates data');
        }
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
            if (data.editors[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getEditorDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.editors[searchTerm]));
                sections.push('');
            }
            if (data.vcs[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getVCSDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.vcs[searchTerm]));
                sections.push('');
            }
            if (data.build_tools[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getBuildToolDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.build_tools[searchTerm]));
                sections.push('');
            }
            if (data.package_managers[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getPackageManagerDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.package_managers[searchTerm]));
                sections.push('');
            }
            if (data.security_and_credentials[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getSecurityAndCredentialsDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.security_and_credentials[searchTerm]));
                sections.push('');
            }

            if (data.game_engines[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getGameEngineDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.game_engines[searchTerm]));
                sections.push('');
            }
        
            if (data.data_science[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getDataScienceDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.data_science[searchTerm]));
                sections.push('');
            }
        
            if (data.cloud_providers[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getCloudProviderDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.cloud_providers[searchTerm]));
                sections.push('');
            }
        
            if (data.cicd_tools[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getCICDToolDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.cicd_tools[searchTerm]));
                sections.push('');
            }
        
            if (data.basic[searchTerm]) {
                sections.push(
                    `### ${capitalize(searchTerm)} ###`,
                    `# ${getBasicDescription(searchTerm)}`,
                    ''
                );
                sections.push(...insertEmptyLines(data.basic[searchTerm]));
                sections.push('');
            }
        });

        if (sections.length > 4) { // More than just the header
            const formattedOutput = sections.join('\n');
            resultDiv.innerHTML = `<pre>${formattedOutput}</pre>`;
            
            // Remove any existing copy buttons
            const existingButtons = document.querySelectorAll('.copy-button');
            existingButtons.forEach(button => button.remove());
            
            // Add new copy button
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

function getGameEngineDescription(engine) {
    const descriptions = {
        unreal_engine: 'Unreal Engine generated files and build artifacts',
        unity: 'Unity engine generated files and build outputs',
        godot: 'Godot engine project files and build artifacts',
        cryengine: 'CryEngine generated files and build outputs',
        lumberyard: 'Amazon Lumberyard engine files and artifacts',
        gamemaker: 'GameMaker Studio files and build outputs',
        rpg_maker: 'RPG Maker project files and artifacts',
        construct: 'Construct engine files and backups',
        phaser: 'Phaser framework build files and artifacts',
        cocos2d: 'Cocos2d engine files and build outputs'
    };
    return descriptions[engine] || `${engine} specific files`;
}

function getDataScienceDescription(tool) {
    const descriptions = {
        jupyter: 'Jupyter Notebook checkpoints and temporary files',
        rstudio: 'RStudio project files and R environment',
        spyder: 'Spyder IDE project settings and files',
        anaconda: 'Anaconda environment files and configurations',
        sagemath: 'SageMath specific files and outputs',
        matlab: 'MATLAB autosave and temporary files',
        tableau: 'Tableau workbook and data files',
        powerbi: 'Power BI template and data files'
    };
    return descriptions[tool] || `${tool} specific files`;
}

function getCloudProviderDescription(provider) {
    const descriptions = {
        aws: 'AWS credentials and configuration files',
        gcp: 'Google Cloud Platform service accounts and configs',
        azure: 'Azure configuration and credential files',
        oracle_cloud: 'Oracle Cloud Infrastructure configurations',
        ibm_cloud: 'IBM Cloud credentials and settings',
        digitalocean: 'DigitalOcean configuration files',
        heroku: 'Heroku configuration and environment files',
        cloudflare: 'Cloudflare credentials and configurations'
    };
    return descriptions[provider] || `${provider} specific files`;
}

function getCICDToolDescription(tool) {
    const descriptions = {
        jenkins: 'Jenkins pipeline and configuration files',
        github_actions: 'GitHub Actions workflows and configurations',
        gitlab_ci: 'GitLab CI configuration and cache files',
        circle_ci: 'CircleCI configuration and build files',
        travis_ci: 'Travis CI configuration and build files',
        azure_devops: 'Azure DevOps pipeline configurations',
        teamcity: 'TeamCity build configurations and settings',
        bamboo: 'Bamboo CI server configurations and specs'
    };
    return descriptions[tool] || `${tool} specific files`;
}

function getBasicDescription(type) {
    const descriptions = {
        universal: 'Universal patterns that should be in every .gitignore'
    };
    return descriptions[type] || `${type} specific files`;
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

// Add this at the start of your script
let allTerms = [];

// Function to initialize terms from your JSON data
async function initializeTerms() {
    try {
        const response = await fetch('./data/templates.json');
        const data = await response.json();
        
        // Collect all terms from different categories
        allTerms = [
            ...Object.keys(data.frameworks || {}),
            ...Object.keys(data.os || {}),
            ...Object.keys(data.environment_specific_files || {}),
            ...Object.keys(data.editors || {}),
            ...Object.keys(data.vcs || {}),
            ...Object.keys(data.build_tools || {}),
            ...Object.keys(data.package_managers || {}),
            ...Object.keys(data.security_and_credentials || {})
        ];
        
        // Remove duplicates
        allTerms = [...new Set(allTerms)];
    } catch (error) {
        console.error('Error initializing terms:', error);
    }
}

// Call this when your script loads
initializeTerms();

// Add event listener for input changes
document.getElementById('searchInput').addEventListener('input', function(e) {
    const input = e.target.value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions');
    
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    // If input is less than 2 characters, hide suggestions
    if (input.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    // Filter terms based on input
    const matchingTerms = allTerms.filter(term => 
        term.toLowerCase().includes(input)
    );
    
    // Display suggestions
    if (matchingTerms.length > 0) {
        matchingTerms.forEach(term => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = term;
            div.addEventListener('click', () => {
                // Get current input value and split it into terms
                const currentTerms = e.target.value.split(',').map(t => t.trim());
                // Replace the last term with the selected suggestion
                currentTerms[currentTerms.length - 1] = term;
                // Update input value
                e.target.value = currentTerms.join(', ');
                // Hide suggestions
                suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(div);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
});

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        document.getElementById('suggestions').style.display = 'none';
    }
});
