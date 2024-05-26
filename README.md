# Cosimulation Studio VS Code Extension
The Cosimulation Studio VS Code Extension seamlessly integrates with the INTO-CPS Maestro cosimulation orchestration engine, enhancing the experience of authoring cosimulation configurations within Visual Studio Code.

## Features
- **Autocompletion**: Autocompletion support for FMU inputs and parameters.
- **Linting**: Linting of correct causality of connection configurations.
- **Integration with Maestro**: Launching simulations directly from VS Code.

## Installation

### Bundling the extension
If a pre-bundled version of the extension hasn't been published to the Visual Studio Code Marketplace, or if you require a build with cutting-edge features, you can bundle the extension locally.

**Prerequisites**
```bash
# The VS Code Extension Manager, used to bundle the extension
npm install -g @vscode/vsce

# Extension dependencies
npm install
```


The extension can then be bundled by running:
```bash
vsce package
```

This will output a `.vsix`-file which can be installed by following the guide [here](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

## Using the extension
For the Maestro-integration to work, so simulations can be launched from within VS Code, a Maestro Web API instance should be running at `http://localhost:8082`.

Then just start editing a cosimulation JSON file. By default, the simulation configuration file should be named `cosim.json` for linting and autocompletion to be enabled. The file name trigger can be configured in your VS Code Preferences:
- Open the command palette `Ctrl+Shift+P`
- Open preferences `Preferences: Open Settings (UI)`
- Then edit `Cosimstudio > Cosim Path`