import '@testing-library/jest-dom';

// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './__mocks__/node.ts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

import { vi } from 'vitest';
// @ts-expect-error config setup
globalThis.jest = vi;

// Error: Not implemented: HTMLMediaElement.prototype.play/pause
// https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395

window.HTMLMediaElement.prototype.load = () => {
  /* do nothing */
};
// @ts-expect-error config setup
window.HTMLMediaElement.prototype.play = () => {
  /* do nothing */
};
window.HTMLMediaElement.prototype.pause = () => {
  /* do nothing */
};
// @ts-expect-error config setup
window.HTMLMediaElement.prototype.addTextTrack = () => {
  /* do nothing */
};
