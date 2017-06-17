import React, { Component } from 'react';
import random from 'random-js';
import Loader from '../Loader/Loader';
import authentication from '../../lib/autentication';
import googleDriveAPI from '../../lib/googleDriveAPI';
import Settings from '../../lib/Settings';
import './index.scss';

export default class Tab extends Component {

  constructor(props) {
    super(props);
    this.state = {currentImage: null, isImageLoaded: false, currentFolderID: null, accessToken: null}
  }

  getFetchedImage() {
     return Settings.get('fetchedImageDataSchema')
                    .then((data) => data.fetchedImageDataSchema)
  }

  pullFetchedImage() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        this.getFetchedImage()
        .then((fetchedImageDataSchema) => {
            if(fetchedImageDataSchema) {
                  clearInterval(interval);
                  resolve(fetchedImageDataSchema)
              }
        })}, 3000)
    });
  }

  componentDidMount() {
    authentication.authenticate();
      this.pullFetchedImage()
          .then((fetchedImageDataSchema) => {
              this.setState({ currentImage: fetchedImageDataSchema });
              Settings.set({fetchedImageDataSchema: null})
          });
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