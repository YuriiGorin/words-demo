export default class Service {
    constructor(options = {}) {
        this._RESTORE_KEY = options.storageKey || "GAME_APP_STATE";
    }

    hasRestoreData() {
        return this._getItemFromStorage(this._RESTORE_KEY) !== null;
    }

    saveRestoreData(data) {
        return this._saveItemToStorage(this._RESTORE_KEY, data);
    }

    getRestoreData() {
        return this._getItemFromStorage(this._RESTORE_KEY);
    }

    clearRestoreData() {
        console.log("test");
        return this._removeItemFromStorage(this._RESTORE_KEY);
    }

    async getTasksData(options, cb) {
        return ["apple", "function", "timeout", "task", "application", "data"];
    }

    _getItemFromStorage(key) {
        let item = localStorage.getItem(key);
        if (item !== null) {
            return JSON.parse(item);
        }
        return null;
    }

    _saveItemToStorage(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }

    _removeItemFromStorage(key) {
        localStorage.removeItem(key);
    }
}
