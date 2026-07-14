const DEFAULT_DELAY_MS = 500;

export function mockResolve(data, delay = DEFAULT_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
}

export function mockReject(message = "Something went wrong", delay = DEFAULT_DELAY_MS) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
}

export function generateMockId() {
  return `mock_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}