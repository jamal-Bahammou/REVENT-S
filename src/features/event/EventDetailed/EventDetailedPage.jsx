import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import EventDatailedHeader from './EventDatailedHeader';
import EventDatailedInfo from './EventDatailedInfo';
import EventDatailedChat from './EventDatailedChat';
import EventDatailedSidebar from './EventDatailedSidebar';
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';

const mapState = (state, ownProps) => {

   let event = {};

   if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
      event = state.firestore.ordered.events[0];
   }


   return {
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
   addEventComment
}

class EventDetailedPage extends Component {

   async componentDidMount() {
      const { firestore, match } = this.props;
      await firestore.setListener(`events/${match.params.id}`);
   }

   async componentWillUnmount() {
      const { firestore, match } = this.props;
      await firestore.unsetListener(`events/${match.params.id}`);
   }

   render() {
      const { loading, event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;
      const attendees = event && event.attendees && objectToArray(event.attendees);
      const isHost = event.hostUid === auth.uid;
      const isGoing = attendees && attendees.some(a => a.id === auth.uid);
      const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
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
               />
               <EventDatailedInfo event={event} />
               <EventDatailedChat
                  eventChat={chatTree}
                  addEventComment={addEventComment}
                  eventId={event.id}
               />
            </Grid.Column>
            <Grid.Column width={6}>
               <EventDatailedSidebar attendees={attendees} />
            </Grid.Column>
         </Grid>
      )
   }
}


export default compose(
   withFirestore,
   connect(mapState, actions),
   firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
)(EventDetailedPage);
