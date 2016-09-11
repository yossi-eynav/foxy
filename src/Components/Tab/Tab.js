import React, { Component } from 'react';
import './tab.css';
import random from 'random-js';
import Loader from '../Loader/Loader';

export default class Tab extends Component {

  constructor() {
    super();
    this.state = {currentImage: "",isImageSet: false}
  }
  //

  componentDidMount() {
    const file = this.selectCurrentFile();
    this.getImage(file.id);
  }

  selectCurrentFile() {

    const {
        currentFolderFiles
    } = this.props;

    if (currentFolderFiles.length === 0){
      return {}
    }

    const filesCount = currentFolderFiles.length;
    const currentFile = random().integer(0, filesCount-1);
    console.info('currentFile: ', currentFile);
    return currentFolderFiles[currentFile];
  }

  getImage(fileID) {
    if (fileID) {
      this.setState({currentImage: `https://www.googleapis.com/drive/v2/files/${fileID}?alt=media&access_token=${this.props.accessToken}`});
    }
  }

  render() {
    return (
          <div>
          {this.state.isImageSet ||  <Loader />}
            <div className="tab">
            <div id="image-container">
                <img className={this.state.isImageSet ? '' : 'hidden'}  src={this.state.currentImage} onLoad={() => {this.setState({'isImageSet': true})}} />
              </div>
            </div>
         </div>
    );
  }
}
//