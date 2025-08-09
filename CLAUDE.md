# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AudioGata plugin that fetches song lyrics from azlyrics.com. AudioGata is a music player platform that supports plugins for various audio sources and metadata.

## Development Commands

```bash
# Build the plugin (creates dist/index.js)
npm run build

# Run tests with Vitest
npm test

# Run tests with coverage
npm run test:coverage
```

## Architecture

### Plugin Structure
- `src/index.ts` - Main plugin entry point that exports the `getLyrics` function
- `manifest.json` - AudioGata plugin manifest defining the plugin metadata
- `dist/index.js` - Built plugin file (single-file bundle created by vite-plugin-singlefile)

### Key Implementation Details

1. **Network Requests**: The plugin uses a monkey-patched `fetch` that routes through `application.networkRequest` to bypass CORS restrictions in the AudioGata environment.

2. **CORS Requirement**: The plugin requires the InfoGata browser extension to be enabled for CORS bypassing, otherwise shows an error notification.

3. **Query Processing**: 
   - If both artist and track name provided: uses format `"${artistName} - ${trackName}"`
   - If only track name: removes parenthetical content like "(Official Video)"

4. **External Dependency**: Uses `js-azlyrics` npm package for actual lyrics fetching, with custom type definitions in `src/js-azlyrics.d.ts`

### Testing Setup
- Tests use Vitest with jsdom environment
- Mock `application` object in `test/application.ts` provides network request capabilities
- Global setup in `test/setup.ts` configures test environment globals

### Build Configuration
- Vite builds a single minified file (`dist/index.js`) using vite-plugin-singlefile
- TypeScript targeting es2015 with modern JS features
- No linting configuration present