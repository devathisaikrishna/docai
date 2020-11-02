import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './Marker.css';

const AnyReactComponent = ({ text }) => 
      <div>
        <div
          className="pin bounce"
          style={{ backgroundColor: 'yellow', cursor: 'pointer' }}
          title={'CSS India'}
        />
        <div className="pulse" />
      </div>
      // <div><h3 style={{"color":"white", "text-align":"center"}}>{text}</h3></div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 22.7189,
      lng: 75.8769
    },
    zoom: 11
  };
 
  render() {
    return (

      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDf9PrAM0666ICXX8gjcOoyjM68oXJ_ijY' }}
          defaultCenter={this.props.center}
          // bounds= {{"nw", "se"}}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
        >
          <AnyReactComponent
            lat={22.7189}
            lng={75.8769}
            text="CSS"
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;