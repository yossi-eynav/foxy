import React, { Component } from 'react';
import random from 'random-js';
import Loader from '../Loader/Loader';
import authentication from '../../lib/autentication';
import googleDriveAPI from '../../lib/googleDriveAPI';
import Settings from '../../lib/Settings';
import './index.scss';

export default class Tab extends Component {

  constructor() {
    super();
    this.state = {currentImage: null, isImageLoaded: false, currentFolderID: null, accessToken: null}
  }

  componentDidMount() {

    const settings = Settings.get();
    this.setState({currentFolderID: settings.currentFolderID });

    authentication
      .authenticate()
          .then((accessToken) => { this.setState({accessToken}) })
          .then(() => googleDriveAPI.getFolderFiles(this.state.currentFolderID, this.state.accessToken))
          .then(() => this.getImage())
          .catch((e) => {
            console.info(e);
            console.info('You should probably go to the option page');
          })
  }

  selectCurrentFile() {
      return googleDriveAPI
          .getFolderFiles(this.state.currentFolderID, this.state.accessToken)
          .then((files) => {
              if (files.length === 0) { return }

              const filesCount = files.length;
              const currentFile = random().integer(0, filesCount-1);
              console.info('currentFile: ', currentFile);

              return files[currentFile];
          })

  }

  getImage() {
      this.selectCurrentFile()
          .then((file) => {
            if (!file) {return}

            const url = googleDriveAPI.getImageURL(file.id, this.state.accessToken);
            this.setState({currentImage: url});
          })
  }

  render() {
    return (
          <div>
            {this.state.isImageLoaded ||  <Loader />}
            <div id="image-container">
                <img className={this.state.isImageLoaded ? '' : 'hidden'}  src={this.state.currentImage} onLoad={() => {this.setState({isImageLoaded: true})}} />
            </div>
         </div>
    );
  }
}
