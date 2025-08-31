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
