
## a. Package Managers

### What is a package manager?
A package manager is a tool that automates the process of installing, updating, configuring, and removing software libraries (called packages) that your project depends on.

### Why do we need package managers in backend development?
Backend projects often rely on external libraries for tasks like database access, authentication, or API handling. Package managers make it easy to add, manage, and share these dependencies consistently across environments.

### Problems faced if package managers are not used
1. Manual downloading and tracking of libraries becomes error-prone and time-consuming.  
2. Version conflicts between different libraries can break your application.  
3. Collaborating with others becomes difficult since there’s no standard way to share dependencies.

## b. NPM (Node Package Manager)

### What is NPM?
NPM (Node Package Manager) is the default package manager for Node.js. It provides access to a vast registry of open-source JavaScript packages and tools.

### Why is NPM important for Node.js applications?
NPM allows developers to easily reuse code written by others, speeding up development and reducing bugs by using well-tested community libraries.

### How NPM helps in managing dependencies
NPM records all installed packages and their exact versions in `package.json` and `package-lock.json`, ensuring consistent installations across different machines and deployments.

## c. Backend Project Initialization

### What is the command used to initialize a backend (Node.js) project?
The command is `npm init`.

### Explain what `npm init` and `npm init -y` do
- `npm init` starts an interactive setup that asks you questions (like name, version, description) to create a `package.json` file.  
- `npm init -y` skips the questions and creates a `package.json` file with default values instantly.

## d. Files and Folders Created After Project Initialization

### Purpose and importance of:

#### `package.json`
- Stores metadata about your project (name, version, scripts).  
- Lists all project dependencies and devDependencies.  
- Enables others to install required packages by running `npm install`.

#### `node_modules`
- Contains all installed dependency code (libraries/packages).  
- Automatically created when you run `npm install`.  
- Should **not** be edited manually—it’s managed entirely by NPM.

#### `package-lock.json`
- Locks down exact versions of every installed package (including nested dependencies).  
- Ensures everyone on the team gets the same dependency tree.  
- Prevents unexpected breaks due to automatic minor/patch updates.

### Which files/folders should not be pushed to GitHub and why?
- **`node_modules`**: It’s huge, auto-generated, and can be recreated via `npm install`.  
- Including it wastes bandwidth and causes merge conflicts.  
- Dependencies are already defined in `package.json` and `package-lock.json`.

### Which files must be committed and why?
- **`package.json`**: Defines project structure, dependencies, and runnable scripts.  
- **`package-lock.json`**: Guarantees reproducible builds across environments.  
- Both are essential for anyone (or CI/CD systems) to correctly set up the project.