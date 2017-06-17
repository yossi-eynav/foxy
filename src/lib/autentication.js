export default class Authentication {

    static authenticate(interactive = true) {
        return new Promise((resolve, reject) => {
            try {
                chrome.identity.getAuthToken({
                    'interactive': interactive
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