export default class Authentication {

    static authenticate() {
        return new Promise((resolve, reject) => {
            try {
                chrome.identity.getAuthToken({
                    'interactive': true
                },(token) => {
                    resolve(token);
                });
            }
            catch (e) {
                console.log(e);
                reject(e)
            }

        })

    }
}