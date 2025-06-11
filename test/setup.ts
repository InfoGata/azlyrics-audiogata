// Test setup file for vitest
import { beforeEach, vi } from 'vitest';
import { application } from './application';
import fetch from 'node-fetch';

// Set up global application object
(global as any).application = application;

// Set up global window and fetch for tests
(global as any).window = {
  fetch: fetch as any
};

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  // Reset window.fetch
  (global as any).window.fetch = fetch as any;
});