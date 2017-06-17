export default (function Settings() {

    function set(payload) {
        return new Promise((resolve,reject)=> {
            chrome.storage.local.set(payload, () => {
                resolve();
            });
        })
    }

    function get(...keys) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(keys, (data) => {
                resolve(data);
            });
        })
    }

    return {
        set,
        get,
    }

}());