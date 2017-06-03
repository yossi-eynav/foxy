const LocalStorageKey = 'just_photos';

export default class Settings {

    static set(payload) {
        localStorage.setItem(LocalStorageKey, JSON.stringify(payload));
    }

    static get() {
        const payload = localStorage.getItem(LocalStorageKey);
        return JSON.parse(payload) || {};
    }
}