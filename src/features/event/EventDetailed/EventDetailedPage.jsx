import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import EventDatailedHeader from './EventDatailedHeader';
import EventDatailedInfo from './EventDatailedInfo';
import EventDatailedChat from './EventDatailedChat';
import EventDatailedSidebar from './EventDatailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';
import { openModal } from '../../modals/modalActions';


const mapState = (state, ownProps) => {

   let event = {};

   if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
      event = state.firestore.ordered.events[0];
   }


   return {
      requesting: state.firestore.status.requesting,
      event,
      loading: state.async.loading,
      auth: state.firebase.auth,
      eventChat:
         !isEmpty(state.firebase.data.event_chat) &&
         objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
   }
}

const actions = {
   goingToEvent,
   cancelGoingToEvent,
   addEventComment,
   openModal
}

class EventDetailedPage extends Component {

   // Use it for loading:
   state = {
      initialLoading: true
   }

   async componentDidMount() {
      const { firestore, match } = this.props;
      // See if the id of event in the bare exist:
      let event = await firestore.get(`events/${match.params.id}`);
      if (!event.exists) {
         toastr.error('Not found', 'This is not the event you are looking for');
         this.props.history.push('/error');
      }
      await firestore.setListener(`events/${match.params.id}`);
      this.setState({
         initialLoading: false
      })
   }

   async componentWillUnmount() {
      const { firestore, match } = this.props;
      await firestore.unsetListener(`events/${match.params.id}`);
   }

   render() {
      const { openModal, loading, event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat, requesting, match } = this.props;
      const attendees = event && event.attendees && objectToArray(event.attendees).sort(function (a, b) {
         return a.joinDate - b.joinDate;
      });
      const isHost = event.hostUid === auth.uid;
      const isGoing = attendees && attendees.some(a => a.id === auth.uid);
      const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
      const authenticated = auth.isLoaded && !auth.isEmpty;
      // Loading went refrech:
      const loadingEvent = requesting[`events/${match.params.id}`];
      if (loadingEvent || this.state.initialLoading)
         return <LoadingComponent />
      return (
         <Grid>
            <Grid.Column width={10}>
               <EventDatailedHeader
                  event={event}
                  loading={loading}
                  isHost={isHost}
                  isGoing={isGoing}
                  goingToEvent={goingToEvent}
                  cancelGoingToEvent={cancelGoingToEvent}
                  authenticated={authenticated}
                  openModal={openModal}
               />
               <EventDatailedInfo event={event} />
               {authenticated &&
                  <EventDatailedChat
                     eventChat={chatTree}
                     addEventComment={addEventComment}
                     eventId={event.id}
                  />}
            </Grid.Column>
            <Grid.Column width={6}>
               <EventDatailedSidebar
                  attendees={attendees}
                  isHost={isHost}
               />
            </Grid.Column>
         </Grid>
      )
   }
}


export default compose(
   withFirestore,
   connect(mapState, actions),
   firebaseConnect((props) => props.auth.isLoaded && !props.auth.isEmpty && ([`event_chat/${props.match.params.id}`]))
)(EventDetailedPage);
