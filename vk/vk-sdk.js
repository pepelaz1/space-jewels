// VK Bridge SDK Integration
// Handles: initialization, ads, player data saving

const VKSDK = {
    bridge: null,
    userId: null,

    // Initialize VK Bridge
    async init() {
        try {
            // Load VK Bridge script if not loaded
            if (!window.VKBridge) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js';
                document.head.appendChild(script);
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
            }

            this.bridge = window.VKBridge;
            await this.bridge.send('VKWebAppInit');
            console.log('VK Bridge initialized');

            // Get user info (optional, may fail outside VK)
            try {
                const userInfo = await this.bridge.send('VKWebAppGetAuthToken', {
                    app_id: 0, // Will be set by VK when deployed
                    scope: 'offline'
                });
                this.userId = userInfo.user_id;
            } catch (e) {
                console.log('Could not get user token (expected outside VK):', e);
            }

            return true;
        } catch (e) {
            console.log('VK Bridge init error:', e);
            return false;
        }
    },

    // Show interstitial ad (between games, on game over)
    async showInterstitial() {
        if (!this.bridge) return;
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
        if (!this.bridge) {
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
        if (!this.bridge) {
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
            // Fallback to localStorage
            localStorage.setItem('cosmicGemsData', JSON.stringify(data));
        }
    },

    // Load player data
    async loadData() {
        if (!this.bridge) {
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
