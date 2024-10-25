# Changelog

All notable changes to the "Cosimulation Studio" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Variable completion items in cosimulation configuration files are now context-aware, only showing the relevant variables, i.e. either inputs, outputs or parameters.

## [0.1.2] - 2024-10-03

### Fixed

- Linting: causality rule did not apply to inputs.
- Linting: references to valid FMU files were detected as invalid on Windows.
- Simulation: running a simulation on Windows would cause an error as the paths to the FMUs were invalid.

### Changed

- All error reporting and information about a running simulation has been moved to the output channel rather than a notification.

## [0.1.1] - 2024-08-30

### Added

- A guide for developers, `DEVELOPER.md`, on how to get a development environment set up.

### Changed

- Improved the `README.md` to make it helpful for the end-user.
- Update `CHANGELOG.md` to reflect the changes in each version.

## [0.1.0] - 2024-08-20

### Added

- Basic integration with Maestro Web API to start simulations from within VS Code.
- A linter that catches simple errors: incorrect FMU naming, incorrect causality of connections, and invalid references to FMU files.
- Autocompletion of FMU variables in connection definitions.
