import "@testing-library/jest-dom/vitest";

let localBrowserStorage = {};

globalThis.chrome = {
  storage: {
    local: {
      set: async (items) => {
        localBrowserStorage = items;
      },
      get: async () => {
        return localBrowserStorage;
      },
    },
  },
};

globalThis.window.alert = (message) => {
  globalThis.console.log(message);
};

globalThis.resetBrowserStorage = () => {
  localBrowserStorage = {};
};
