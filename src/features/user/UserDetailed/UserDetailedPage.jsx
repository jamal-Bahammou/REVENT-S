import React, { Component } from 'react'; // imrc
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'; // for the photos
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';

// query function:
// Listen to the photos from firestore:
const query = ({ auth }) => {
   return [
      {
         collection: 'users',
         doc: auth.uid,
         subcollections: [{ collection: 'photos' }],
         storeAs: 'photos'
      }
   ]
}

//  mapState function: 
const mapState = (state) => ({
   profile: state.firebase.profile,
   auth: state.firebase.auth,
   photos: state.firestore.ordered.photos
})

// Class of root page UserDetailedPage:
class UserDetailedPage extends Component {
   render() {
      const { profile, photos } = this.props;
      return (
         <Grid>

            {/* UserDetailedHeader: */}
            <UserDetailedHeader profile={profile} />

            {/* UserDetailedDescription: */}
            <UserDetailedDescription profile={profile} />

            {/* UserDetailedSidebar: */}
            <UserDetailedSidebar />

            {/* UserDetailedPhotos: */}
            {photos && photos.length > 0 &&
               <UserDetailedPhotos photos={photos} />}

            {/* UserDetailedEvents: */}
            <UserDetailedEvents />

         </Grid>
      )
   }
}

export default compose(
   connect(mapState),
   firestoreConnect(auth => query(auth)),
)(UserDetailedPage);
