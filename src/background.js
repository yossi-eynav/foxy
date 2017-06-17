import googleDriveAPI from './lib/googleDriveAPI';
import Settings from './lib/settings';
import authentication from './lib/autentication';
import random from 'random-js';

const Errors = {
    FOLDER_ID_NOT_SELECTED: {
        type: 'FOLDER_ID_NOT_SELECTED',
        message: 'You should go to the setting page and choose a folder.',
    },
    UNUSED_FETCHED_IMAGE: {
        type: 'UNUSED_FETCHED_IMAGE',
        message: 'Aborting! Image fetched and still not presented.'
    },
    IN_THE_PROCESS_OF_FETCHING_AN_IMAGE: {
        type: 'IN_THE_PROCESS_OF_FETCHING_AN_IMAGE',
         message: 'In the process of fetching an image.',
    },
    IMAGES_NOT_FOUND_IN_FOLDER: {
        type: 'IMAGES_NOT_FOUND_IN_FOLDER',
        message: 'Images not found in the selected folder. please add images or change the chosen folder.',
    },
    FILE_OBJECT_IS_NOT_EXISTS: {
        type: 'FILE_OBJECT_IS_NOT_EXISTS',
        message: 'The file object is not exists.',
    },
    ERROR_WHILE_FETCHING_THE_IMAGE: {
        type: 'ERROR_WHILE_FETCHING_THE_IMAGE',
        message: 'An error ocurred while fetching the resource.',
    },
};

(()=>{
    let fetching = false;

    chrome.browserAction.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage()
    });


    setInterval(() => {

            let token, currentFolderID;

            Settings.get('currentFolderID', 'fetchedImageDataSchema')
            .then(data => {
                if(!data.currentFolderID) { throw Errors.FOLDER_ID_NOT_SELECTED }
                if(data.fetchedImageDataSchema) { throw Errors.UNUSED_FETCHED_IMAGE }
                if(fetching) { throw Errors.IN_THE_PROCESS_OF_FETCHING_AN_IMAGE }

                fetching = true;
                currentFolderID = data.currentFolderID;
            })
            .then(() => authentication.authenticate(false))
            .then((accessToken) => {
                token = accessToken;
                return googleDriveAPI.getFolderFiles(currentFolderID, accessToken)
            })
            .then(() => getImage())
            .catch((e) => {
                if(e.type !== Errors.IN_THE_PROCESS_OF_FETCHING_AN_IMAGE.type) { fetching = false; }
                console.info(e);
            })


        function selectCurrentFile() {
            return googleDriveAPI
                .getFolderFiles(currentFolderID, token)
                .then((files) => {
                    if (files.length === 0) { throw Errors.IMAGES_NOT_FOUND_IN_FOLDER }

                    const filesCount = files.length;
                    const currentFile = random().integer(0, filesCount-1);
                    console.info('currentFile: ', currentFile);
                    return files[currentFile];
                })
        }

        function getImage() {
            selectCurrentFile()
                .then((file) => {
                    if (!file) {throw Errors.FILE_OBJECT_IS_NOT_EXISTS}

                    const url = googleDriveAPI.getImageURL(file.id, token);
                    const img = document.createElement('img')
                    img.crossOrigin = 'Anonymous';
                    img.src = url;
                    img.addEventListener('error', () => { throw Errors.ERROR_WHILE_FETCHING_THE_IMAGE }, false);
                    img.addEventListener('load', () => {
                        console.info('Image loaded!');
                        Settings.set({fetchedImageDataSchema: getBase64Image(img)})
                                .then(() => { fetching = false; })
                    }, false);
                })
        }

        function getBase64Image(img) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            return  canvas.toDataURL('image/png');
        }

    },5000)

})()