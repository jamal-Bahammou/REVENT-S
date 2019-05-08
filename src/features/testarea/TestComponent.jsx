import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import GoogleMapReact from 'google-map-react';
// import { Icon } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { incrementAsync, decrementAsync } from './testActions';
import { openModal } from '../modals/modalActions'

const mapState = (state) => ({
   data: state.test.data,
   loading: state.test.loading
})

const actions = {
   incrementAsync,
   decrementAsync,
   openModal
}

// const Marker = () => <Icon name='marker' size='big' color='red' />

class TestComponent extends Component {

   static defaultProps = {
      center: {
         lat: 35.1686165,
         lng: -2.9275835999999344
      },
      zoom: 11
   };

   state = {
      address: '',
      scriptLoaded: false
   };

   handleScriptLoad = () => {
      this.setState({ scriptLoaded: true });
   };

   handleFormSubmit = event => {
      event.preventDefault();

      geocodeByAddress(this.state.address)
         .then(results => getLatLng(results[0]))
         .then(latLng => console.log('Success', latLng))
         .catch(error => console.error('Error', error));
   };

   onChange = address => this.setState({ address });

   render() {

      const inputProps = {
         value: this.state.address,
         onChange: this.onChange
      };

      const { incrementAsync, decrementAsync, data, openModal, loading } = this.props;
      return (
         <div>
            {/* <Script
               url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDkOJIIkRJyV0WBneMwzIXAZO4yNsYGLj4&libraries=places"
               onLoad={this.handleScriptLoad}
            /> */}
            <h1>Test Area</h1>
            <h3>The answer is : {data}</h3>
            <Button loading={loading} onClick={incrementAsync} color='green' content='INCREMENT' />
            <Button loading={loading} onClick={decrementAsync} color='red' content='DECREMENT' />
            <Button onClick={() => openModal('TestModal', { data: 43 })} color='teal' content='OPEN MODAL' />
            <br />
            <br />

            {/* Google Place affichage: */}
            <form onSubmit={this.handleFormSubmit}>
               {this.state.scriptLoaded && (
                  <PlacesAutocomplete inputProps={inputProps} />
               )}
               <button type="submit">Submit</button>
            </form>

            {/* Google Map affichage: */}
            {/* <div style={{ height: '300px', width: '100%' }}>
               <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyDkOJIIkRJyV0WBneMwzIXAZO4yNsYGLj4' }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
               >
                  <Marker
                     lat={35.1686165}
                     lng={-2.9275835999999344}
                     text={'Kreyser Avrora'}
                  />
               </GoogleMapReact>
            </div> */}

         </div>
      )
   }
}

export default connect(mapState, actions)(TestComponent);