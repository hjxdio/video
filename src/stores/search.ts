import { defineStore } from 'pinia';

export const useSearchHistoryStore = defineStore('searchhistory', {
  state: () => ({
    history: [],
  }),
  actions: {
    addHistory(keyword: string) {
      const index = this.history.indexOf(keyword);
      if (index !== -1) {
        this.history.splice(index, 1);
      }
      this.history.unshift(keyword);
    },
    removeHistory(keyword: string) {
      this.history = this.history.filter((item) => item !== keyword);
    },
    clearHistory() {
      this.history = [];
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
});
