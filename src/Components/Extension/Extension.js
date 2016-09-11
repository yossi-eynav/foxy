import injectTapEventPlugin from 'react-tap-event-plugin';
import Popup from '../Popup/Popup';
import Tab from '../Tab/Tab';

injectTapEventPlugin();

class Extension extends React.Component {

    LOCAL_STORAGE_KEY = "foxy_extension";

    constructor() {
        super();
        let state = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));

        state = Object.assign({},{
            accessToken: false,
            matchedFolders: []
        },state);

        this.state = state;
        this.login = this.login.bind(this);
        this.searchFolders = this.searchFolders.bind(this);
        this.setCurrentFolder = this.setCurrentFolder.bind(this)
    }

    componentDidMount() {
        try {
            chrome.identity.getAuthToken({
                'interactive': !this.state.accessToken
            },(token) => {
                this.setState({accessToken: token});
                console.info(token);
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    componentDidUpdate() {
        localStorage.setItem(this.LOCAL_STORAGE_KEY , JSON.stringify(this.state));
    }

    getFolderFiles(folderID) {
        if (folderID) {
            const xhr = new XMLHttpRequest();
            const url = `https://www.googleapis.com/drive/v2/files/${folderID}/children?access_token=${this.state.accessToken}`;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let json = JSON.parse(xhr.response);
                    this.setState({currentFolderFiles: json.items});
                    window.open(`chrome-extension://${chrome.runtime.id}/index.html`);
                }
            }.bind(this);
            xhr.open('GET', url);
            xhr.send(null);
        }
    }

    setCurrentFolder(id) {
        this.getFolderFiles(id);
        this.setState({
            currentFolder: id
        });
    }

    searchFolders(e) {
        const value = e.target.value;
        if (value) {
            const xhr = new XMLHttpRequest();
            const url = `https://www.googleapis.com/drive/v3/files?corpus=user&pageSize=250&access_token=${this.state.accessToken}&orderBy=name&q=name contains '${value}' and mimeType = 'application/vnd.google-apps.folder'`;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let json = JSON.parse(xhr.response);
                    this.setState({matchedFolders: json.files});
                }
            }.bind(this);
            xhr.open('GET', url);
            xhr.send(null);
        } else {
            this.setState({matchedFolders: []});
        }
    }

    login(accessToken) {
        console.info(accessToken);
        this.setState({accessToken});
    }

    render() {
        return (
            window.location.search.match('popup') ?
            <Popup setCurrentFolder={this.setCurrentFolder} accessToken={this.state.accessToken} matchedFolders={this.state.matchedFolders} login={this.login} searchFolders={this.searchFolders}/> :
            <Tab currentFolderFiles={this.state.currentFolderFiles || []} accessToken={this.state.accessToken}/>
        );
    }
}
export default Extension;
