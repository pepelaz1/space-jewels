// Yandex Games SDK Integration
// Handles: initialization, ads, player data saving

const YandexSDK = {
    ysdk: null,
    player: null,

    // Initialize SDK
    async init() {
        try {
            if (window.YaGames && typeof window.YaGames.init === 'function') {
                this.ysdk = await window.YaGames.init();
                console.log('Yandex Games SDK initialized');
                
                // Set language from SDK
                if (this.ysdk.environment && this.ysdk.environment.i18n) {
                    window.userLang = this.ysdk.environment.i18n.lang;
                    console.log('Language set to:', window.userLang);
                }
                
                // Signal game is ready
                if (this.ysdk.features && this.ysdk.features.LoadingAPI) {
                    this.ysdk.features.LoadingAPI.ready();
                    console.log('Game Ready signaled');
                }
                return true;
            } else {
                console.log('Yandex Games SDK not available (local development)');
                return false;
            }
        } catch (e) {
            console.log('Yandex Games SDK init error:', e);
            return false;
        }
    },

    // Show interstitial ad (between games, on game over)
    async showInterstitial() {
        if (!this.ysdk) return;
        try {
            await this.ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onOpen: () => console.log('Interstitial ad opened'),
                    onClose: (wasShown) => console.log('Interstitial closed:', wasShown),
                    onError: (error) => console.log('Interstitial error:', error),
                }
            });
        } catch (e) {
            console.log('Interstitial error:', e);
        }
    },

    // Show rewarded video ad (for boosters, extra time, etc.)
    async showRewarded(callback) {
        if (!this.ysdk) {
            // Local dev: just give reward
            if (callback) callback();
            return;
        }
        try {
            await this.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => console.log('Rewarded video opened'),
                    onRewarded: () => {
                        console.log('Rewarded video completed');
                        if (callback) callback();
                    },
                    onClose: (wasShown) => console.log('Rewarded closed:', wasShown),
                    onError: (error) => console.log('Rewarded error:', error),
                }
            });
        } catch (e) {
            console.log('Rewarded error:', e);
        }
    },

    // Save player data
    async saveData(data) {
        if (!this.ysdk) {
            // Local fallback
            localStorage.setItem('cosmicGemsData', JSON.stringify(data));
            return;
        }
        try {
            this.player = this.player || await this.ysdk.getPlayer({ scopes: false });
            await this.player.setData(data, true);
            console.log('Data saved to Yandex');
        } catch (e) {
            console.log('Save error:', e);
            // Fallback to localStorage
            localStorage.setItem('cosmicGemsData', JSON.stringify(data));
        }
    },

    // Load player data
    async loadData() {
        if (!this.ysdk) {
            // Local fallback
            const data = localStorage.getItem('cosmicGemsData');
            return data ? JSON.parse(data) : null;
        }
        try {
            this.player = this.player || await this.ysdk.getPlayer({ scopes: false });
            const data = await this.player.getData();
            return data;
        } catch (e) {
            console.log('Load error:', e);
            const data = localStorage.getItem('cosmicGemsData');
            return data ? JSON.parse(data) : null;
        }
    },

    // Auto-save (called periodically)
    autoSave: null,
    startAutoSave(getState) {
        this.autoSave = setInterval(() => {
            const state = getState();
            this.saveData(state);
        }, 30000); // Save every 30 seconds
    },
    stopAutoSave() {
        if (this.autoSave) clearInterval(this.autoSave);
    },

    // Pause game on visibility change (Yandex requirement 1.3)
    initVisibilityHandler(pauseCallback, resumeCallback) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Game paused (tab hidden)');
                if (pauseCallback) pauseCallback();
            } else {
                console.log('Game resumed (tab visible)');
                if (resumeCallback) resumeCallback();
            }
        });
    }
};
