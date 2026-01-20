import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";
import type { Mock } from "vitest";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock as unknown as Storage;
globalThis.fetch = vi.fn() as Mock;

afterEach(() => {
  vi.clearAllMocks();
});
