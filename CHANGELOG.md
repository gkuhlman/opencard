# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-03-03

### Added
- Toggle to show/hide inning column labels
- Configurable number of substitution lines per row (0-3)
- Option to hide header on second page (home page)
- Tests for inning labels, substitution lines, second-page header, and consolidated scoreboard

### Changed
- Substitution lines now support multiple evenly-spaced dividers instead of a single fixed line
- Scoreboard R/H/E totals consolidated into the same table as innings
- Toggle component now accepts and applies `className` prop

### Fixed
- `className` prop (e.g. `mb-2`) on Toggle component was silently ignored

## [1.0.0] - 2025-02-14

Initial release.
