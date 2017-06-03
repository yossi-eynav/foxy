export default class GoogleDriveAPI {

    static getFolderFiles(folderID, accessToken) {
        if(!folderID) { throw 'folder ID is not exists'}

        return fetch(`https://www.googleapis.com/drive/v2/files/${folderID}/children?access_token=${accessToken}`)
            .then(response => response.json())
            .then(json => json.items)
    }

    static searchFolders(query, accessToken) {
        if(!query) { return; }
        return fetch(`https://www.googleapis.com/drive/v3/files?corpus=user&pageSize=250&access_token=${accessToken}&orderBy=name&q=name contains '${query}' and mimeType = 'application/vnd.google-apps.folder'`)
                .then((response) => response.json())
    }

    static getImageURL(fileID, accessToken) {
        return `https://www.googleapis.com/drive/v2/files/${fileID}?alt=media&access_token=${accessToken}`
    }
}