// VK Bridge SDK Integration
// Handles: initialization, ads, player data saving

const VKSDK = {
    bridge: null,
    userId: null,
    isLocal: false,

    // Initialize VK Bridge
    async init() {
        try {
            this.bridge = window.vkBridge || window.VKBridge;
            if (!this.bridge) {
                console.log('VK Bridge not available (local development)');
                this.isLocal = true;
                return true; // Allow game to run locally
            }

            // Try to init VK Bridge (will fail outside VK)
            try {
                await this.bridge.send('VKWebAppInit');
                console.log('VK Bridge initialized');
            } catch (e) {
                console.log('VKWebAppInit failed (expected outside VK):', e.message);
                this.isLocal = true;
            }

            // Get user info (only works inside VK)
            if (!this.isLocal) {
                try {
                    const userInfo = await this.bridge.send('VKWebAppGetAuthToken', {
                        app_id: 0,
                        scope: 'offline'
                    });
                    this.userId = userInfo.user_id;
                } catch (e) {
                    console.log('Could not get user token:', e.message);
                }
            }

            return true;
        } catch (e) {
            console.log('VK SDK init error:', e);
            this.isLocal = true;
            return true; // Allow game to run locally
        }
    },

    // Show interstitial ad (between games, on game over)
    async showInterstitial() {
        if (this.isLocal || !this.bridge) return;
        try {
            await this.bridge.send('VKWebAppShowNativeAds', {
                ad_format: 'interstitial'
            });
            console.log('Interstitial ad shown');
        } catch (e) {
            console.log('Interstitial error:', e);
        }
    },

    // Show rewarded video ad (for boosters, extra time, etc.)
    async showRewarded(callback) {
        if (this.isLocal || !this.bridge) {
            // Local dev: just give reward
            if (callback) callback();
            return;
        }
        try {
            const result = await this.bridge.send('VKWebAppShowNativeAds', {
                ad_format: 'rewarded'
            });
            if (result && result.result) {
                console.log('Rewarded video completed');
                if (callback) callback();
            }
        } catch (e) {
            console.log('Rewarded error:', e);
        }
    },

    // Save player data
    async saveData(data) {
        if (this.isLocal || !this.bridge) {
            // Local fallback
            localStorage.setItem('cosmicGemsData', JSON.stringify(data));
            return;
        }
        try {
            await this.bridge.send('VKWebAppStorageSet', {
                key: 'cosmicGemsData',
                value: JSON.stringify(data)
            });
            console.log('Data saved to VK');
        } catch (e) {
            console.log('Save error:', e);
            localStorage.setItem('cosmicGemsData', JSON.stringify(data));
        }
    },

    // Load player data
    async loadData() {
        if (this.isLocal || !this.bridge) {
            // Local fallback
            const data = localStorage.getItem('cosmicGemsData');
            return data ? JSON.parse(data) : null;
        }
        try {
            const result = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['cosmicGemsData']
            });
            if (result && result.keys && result.keys[0] && result.keys[0].value) {
                return JSON.parse(result.keys[0].value);
            }
            return null;
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

    // Pause game on visibility change
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
