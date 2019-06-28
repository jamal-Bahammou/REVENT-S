import React, { Component } from 'react'; // imrc
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase'; // for the photos
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import { userDetailedQuery } from './userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';

// query function:
// Listen to the photos from firestore:


//  mapState function: 
const mapState = (state, ownProps) => {
   let userUid = null;
   let profile = {};

   if (ownProps.match.params.id === state.auth.uid) {
      profile = state.firesbase.profile
   } else {
      profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
      userUid = ownProps.match.params.id;
   }

   return {
      profile,
      userUid,
      auth: state.firebase.auth,
      photos: state.firestore.ordered.photos,
      requesting: state.firestore.status.requesting
   }
}

// Class of root page UserDetailedPage:
class UserDetailedPage extends Component {
   render() {
      const { profile, photos, auth, match, requesting } = this.props;
      const isCurrentUser = auth.uid === match.params.id;
      const loading = Object.values(requesting).some(a => a === true);

      // Loading animation:
      if (loading) return <LoadingComponent />

      return (
         <Grid>

            {/* UserDetailedHeader: */}
            <UserDetailedHeader profile={profile} />

            {/* UserDetailedDescription: */}
            <UserDetailedDescription profile={profile} />

            {/* UserDetailedSidebar: */}
            <UserDetailedSidebar isCurrentUser={isCurrentUser} />

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
   firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid)),
)(UserDetailedPage);
