# Changelog

All notable changes to the "Cosimulation Studio" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Linting: causality rule did not apply to inputs.

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
