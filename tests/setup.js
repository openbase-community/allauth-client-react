const storage = new Map();

globalThis.window = {
  location: { assign() {} },
  sessionStorage: {
    getItem(key) {
      return storage.get(key) ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  },
};
