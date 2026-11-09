import { CONFIG } from '../config.js';
export class StormTracker {
    async fetchActiveStorms() {
        try {
            const res = await fetch(CONFIG.NHC_STORMS_URL);
            const data = await res.json();
            return data.activeStorms || [];
        } catch (e) {
            console.warn('Không thể tải dữ liệu bão:', e);
            return [];
        }
    }
}
