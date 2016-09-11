import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import TextField from 'material-ui/TextField';
import { red500, red200, brown50, grey500 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';




import './popup.css';

export default class Popup extends Component {

  constructor() {
    super();
    this.loginClickHandler = this.loginClickHandler.bind(this)
  }
  

  loginClickHandler() {

      const {
          accessToken
      } = this.props;
      
      try {
      chrome.identity.getAuthToken({
        'interactive': !!accessToken
      },this.props.login);
    }
    catch (e) {
      console.log(e);
    }
  }

  unLoggedPopup() {
      return (
          <Card style={{height:'100%',background:' linear-gradient(to left, #cb2d3e , #ef473a)'}}>
            <CardTitle style={{color:grey500}} title="Welcome to Just Photos!" subtitle="" />
            <CardActions>
                <RaisedButton label="Login!" style={{width: '100%',color: red500}} onClick={this.loginClickHandler} />
            </CardActions>
          </Card>
      )
  }

  loggedInPopup() {

    const {
        matchedFolders,
        setCurrentFolder
    } = this.props;

    return (
    <Card>
      <CardTitle title="Welcome to Just Photos!" subtitle="" />
      <CardText>
        Start typing your photos folder name.
      </CardText>
      <CardActions>
          <TextField
              floatingLabelText='Type Here!'
              floatingLabelFocusStyle={{color:red200}}
              underlineFocusStyle={{borderColor:red200}}
              onKeyUp={this.props.searchFolders} />
      </CardActions>
        <List style={{background:'linear-gradient(to left, #EB3349 , #F45C43)',minHeight: '100%'}}>
          <Subheader style={{color: brown50}}>{matchedFolders.length} Matching Folders</Subheader>
           {matchedFolders && matchedFolders.map((folder) =>
                <ListItem
                  key={folder.id}
                  leftAvatar={<Avatar color={grey500} backgroundColor={brown50} icon={<FileFolder/>}/>}
                  primaryText={folder.name.substring(0,30)}
                  onClick={()=>setCurrentFolder(folder.id)}
                  style={{color: brown50}} />
            )}
        </List>
    </Card>
    )
  }

  render() {

    const {
        accessToken
    } = this.props;

    return (
        <div className="popup">
          { accessToken ? this.loggedInPopup() : this.unLoggedPopup()}
        </div>
    );
  }
}
