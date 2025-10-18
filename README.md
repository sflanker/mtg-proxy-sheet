# MTG Proxy Card Sheet Generator

## Overview

A web application that generates printable Magic: The Gathering proxy card sheets from .dck files. Users can upload their deck files, and the app fetches card images from the Scryfall API to create print-ready proxy sheets.

## Project Architecture

- **Type**: Frontend-only static web application
- **Stack**: Vanilla HTML/CSS/JavaScript (ES Modules)
- **Package Manager**: npm
- **Dev Server**: serve (static file server)
- **Port**: 5000

## Key Features

- Upload .dck deck files
- Parse deck lists (main deck and sideboard)
- Fetch card images from Scryfall API
- Generate printable proxy sheets (9 cards per page)
- Responsive design with print-optimized CSS
- Support for multi-face cards

## Project Structure

```
.
├── index.html       # Main HTML page
├── index.js         # Core application logic (ES module)
├── index.css        # Styling and print layout
├── package.json     # Dependencies and scripts
└── LICENSE.txt      # License file
```

## Dependencies

- `serve` (v14.2.5) - Static file server for development

## Workflow

- **Dev Server**: `npm start` Runs `npx serve -l 5000 --no-clipboard --no-port-switching` which serves static content on port 5000

## External APIs

- **Scryfall API**: `https://api.scryfall.com/cards/{setCode}/{cardId}`
  - Used to fetch card metadata and images
  - No API key required

## Recent Changes

- **2025-10-18**: Initial setup in Replit environment
  - Configured workflow to serve on port 5000
  - Added .gitignore for Node.js files
  - Installed dependencies with npm

## Development

The app runs on a static server (serve) that serves the HTML/CSS/JS files. No build step is required as it uses native ES modules.
