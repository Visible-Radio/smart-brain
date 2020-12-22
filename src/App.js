import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'b5bbef8b332d497e8ca62d532d15df47'
});

const particlesOptions = {
  particles: {
    number: {
      value: 10,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {        
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    console.log("calculateFaceLocation called");
    console.log("API returned: ", data);   
    const clarifaiFace = (data.outputs[0].data.regions[0].region_info.bounding_box);    
    const image = document.getElementById('inputimage');    
    const width = Number(image.width);
    const height = Number(image.height); 
    const boxCoordinates = {      
      leftX: parseInt(clarifaiFace.left_col * width, 10),
      topY: parseInt(clarifaiFace.top_row * height, 10),   
      rightX: parseInt(clarifaiFace.right_col * width, 10),      
      bottomY: parseInt(clarifaiFace.bottom_row * height, 10),
    };    
    return boxCoordinates;
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log('onButtonSubmit Called');
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response => {

      //hit the entries update endpoint and get back the user's entry count
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(count => count.json())
        .then(count => {
          // Need to use Object.assign due to weirdness with nested objects inside the state object
          this.setState(Object.assign(this.state.user, {entries: count}))
        });
      }

      // update State with box coordinates from submitted image
      this.setState({box: this.calculateFaceLocation(response)})
    })
    .then(() => this.render())   
    .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    console.log('onRouteChange called');
    if (route === 'signin') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box, user } = this.state;    
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}              
              />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div className='conditionalWrapper'>
              <Logo />
              <Rank userName={user.name} userEntries={user.entries}/>
              https://pbs.twimg.com/media/ENNGne_W4AAFxVY.jpg
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
          : (
              this.state.route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )          
        }
      </div>
    )
  }
}

export default App;
