import { defineStore } from 'pinia';

// https://github.com/BayBreezy/nuxt-3-server-api

export const useAppStore = defineStore('AppStore', {
    // state
    state: () => {
        return {
            submittalView: 'cards',
            submittalSearch: false
        }
    }
})