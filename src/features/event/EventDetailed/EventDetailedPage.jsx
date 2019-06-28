import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { Grid } from 'semantic-ui-react';
import EventDatailedHeader from './EventDatailedHeader';
import EventDatailedInfo from './EventDatailedInfo';
import EventDatailedChat from './EventDatailedChat';
import EventDatailedSidebar from './EventDatailedSidebar';
import { objectToArray } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';

const mapState = (state) => {

   let event = {};

   if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
      event = state.firestore.ordered.events[0];
   }


   return {
      event,
      auth: state.firebase.auth
   }
}

const actions = {
   goingToEvent,
   cancelGoingToEvent
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
      const { event, auth, goingToEvent, cancelGoingToEvent } = this.props;
      const attendees = event && event.attendees && objectToArray(event.attendees);
      const isHost = event.hostUid === auth.uid;
      const isGoing = attendees && attendees.some(a => a.id === auth.uid);
      return (
         <Grid>
            <Grid.Column width={10}>
               <EventDatailedHeader
                  event={event}
                  isHost={isHost}
                  isGoing={isGoing}
                  goingToEvent={goingToEvent}
                  cancelGoingToEvent={cancelGoingToEvent}
               />
               <EventDatailedInfo event={event} />
               <EventDatailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
               <EventDatailedSidebar attendees={attendees} />
            </Grid.Column>
         </Grid>
      )
   }
}


export default withFirestore(connect(mapState, actions)(EventDetailedPage));
