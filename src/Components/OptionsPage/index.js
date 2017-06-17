import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import TextField from 'material-ui/TextField';
import { red500, red200, brown50, grey500 } from 'material-ui/styles/colors';
import GoogleDriveAPI from '../../lib/googleDriveAPI';
import Autentication from '../../lib/autentication';
import Setting from '../../lib/settings';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: null,
            matchedFolders: [],
            notification: null
    }
    }

    componentDidMount() {
        Autentication
            .authenticate()
            .then((accessToken) => {
                this.setState({accessToken})
            });
    }

    searchFolders(query) {
        GoogleDriveAPI
            .searchFolders(query, this.state.accessToken)
            .then((results) => {
                const matchedFolders = results.files;
                if(!matchedFolders) {return;}

                this.setState({matchedFolders})
            })
    }

    setCurrentFolder(folderID) {
        Setting.set({currentFolderID: folderID});
    }

  render() {
        const { matchedFolders} = this.state;

      return(
          <div>
              <Card>
                  <CardTitle title="Welcome to Just Photos!" subtitle="" />
                  <CardText>
                      Start typing your photos folder name.
                  </CardText>
                  <CardActions>
                      <TextField
                          floatingLabelText='Search Google Drive Folder'
                          onKeyUp={ elm => { this.searchFolders(elm.target.value) }} />
                  </CardActions>
                  <List>
                      <Subheader>{matchedFolders.length} Matching Folders</Subheader>
                      {matchedFolders.map((folder) =>
                           <ListItem key={folder.id}
                                     leftAvatar={<Avatar icon={<FileFolder/>}/>}
                                     primaryText={folder.name.substring(0,30)}
                                     onClick={()=> {
                                        this.setCurrentFolder(folder.id)
                                        this.setState({notification: {message: `The folder ${folder.name} selected!`}})
                                        setTimeout(() => {this.setState({notification: null})}, 3000)
                                     }} />)}
                  </List>
              </Card>
              {this.state.notification &&  <Snackbar open={true}  
                                                    message={this.state.notification.message}
                                                    autoHideDuration={3000} />} 
            </div>

      )
  }
}
