import "@testing-library/jest-dom/vitest";

let syncStorage = {};

globalThis.chrome = {
  storage: {
    sync: {
      set: async (items) => {
        syncStorage = items;
      },
      get: async () => {
        return syncStorage;
      },
    },
  },
};

globalThis.window.alert = (message) => {
  globalThis.console.log(message);
};

globalThis.resetBrowserStorage = () => {
  syncStorage = {};
};
