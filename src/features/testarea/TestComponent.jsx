import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import { Icon } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { incrementAsync, decrementAsync, testPermission } from './testActions';
import { openModal } from '../modals/modalActions'

const mapState = (state) => ({
   data: state.test.data,
   loading: state.test.loading
})

const actions = {
   incrementAsync,
   decrementAsync,
   openModal,
   testPermission
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

      const { testPermission, incrementAsync, decrementAsync, data, openModal, loading } = this.props;
      return (
         <div>
            <h1>TEST AREA</h1>
            <h3>THE ANSWER IS: {data}</h3>
            <Button loading={loading} onClick={incrementAsync} color='green' content='INCREMENT' />
            <Button loading={loading} onClick={decrementAsync} color='red' content='DECREMENT' />
            <Button onClick={() => openModal('TestModal', { data: 43 })} color='teal' content='OPEN MODAL' />
            {/* TEST PERMISION: */}
            <Button onClick={testPermission} color='black' content='TEST PERMISION' />
            <br />
            <br />

            {/* Google Place affichage: */}
            <form onSubmit={this.handleFormSubmit}>
               {this.state.scriptLoaded && (
                  <PlacesAutocomplete inputProps={inputProps} />
               )}
               <Button type="submit" content='SUBMIT' />
            </form>

            {/* Google Map affichage: */}

         </div>
      )
   }
}

export default connect(mapState, actions)(TestComponent);