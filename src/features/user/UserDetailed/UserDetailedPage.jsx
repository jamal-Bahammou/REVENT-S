import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents, followUser, unfollowUser } from '../userActions';

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
      events: state.events,
      eventsLoading: state.async.loading,
      auth: state.firebase.auth,
      photos: state.firestore.ordered.photos,
      requesting: state.firestore.status.requesting,
      following: state.firestore.ordered.following
   }
}

const actions = {
   getUserEvents,
   followUser,
   unfollowUser
}

// Class of root page UserDetailedPage:
class UserDetailedPage extends Component {
   async componentDidMount() {
      let events = await this.props.getUserEvents(this.props.userUid);
      console.log(events);
   }

   changeTab = (e, data) => {
      this.props.getUserEvents(this.props.userUid, data.activeIndex)
   }

   render() {
      const { profile, photos, auth, match, requesting, events, eventsLoading, followUser, following, unfollowUser } = this.props;
      const isCurrentUser = auth.uid === match.params.id;
      const loading = Object.values(requesting).some(a => a === true);
      const isFollowing = !isEmpty(following);

      // Loading animation:
      if (loading) return <LoadingComponent />

      return (
         <Grid>

            {/* UserDetailedHeader: */}
            <UserDetailedHeader profile={profile} />

            {/* UserDetailedDescription: */}
            <UserDetailedDescription profile={profile} />

            {/* UserDetailedSidebar: */}
            <UserDetailedSidebar
               isFollowing={isFollowing}
               isCurrentUser={isCurrentUser}
               profile={profile}
               followUser={followUser}
               unfollowUser={unfollowUser}
            />

            {/* UserDetailedPhotos: */}
            {photos && photos.length > 0 &&
               <UserDetailedPhotos photos={photos} />}

            {/* UserDetailedEvents: */}
            <UserDetailedEvents events={events} eventsLoading={eventsLoading} changeTab={this.changeTab} />

         </Grid>
      )
   }
}

export default compose(
   connect(mapState, actions),
   firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match)),
)(UserDetailedPage);