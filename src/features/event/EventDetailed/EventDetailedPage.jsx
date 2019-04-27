import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventDatailedHeader from './EventDatailedHeader';
import EventDatailedInfo from './EventDatailedInfo';
import EventDatailedChat from './EventDatailedChat';
import EventDatailedSidebar from './EventDatailedSidebar';

const mapState = (state, ownProps) => {
   const eventId = ownProps.match.params.id;

   let event = {};

   if (eventId && state.events.length > 0) {
      event = state.events.filter(event => event.id === eventId)[0]
   }


   return {
      event
   }
}

const EventDetailedPage = ({ event }) => {
   return (
      <Grid>
         <Grid.Column width={10}>
            <EventDatailedHeader event={event} />
            <EventDatailedInfo event={event} />
            <EventDatailedChat />
         </Grid.Column>
         <Grid.Column width={6}>
            <EventDatailedSidebar attendees={event.attendees} />
         </Grid.Column>
      </Grid>
   )
}

export default connect(mapState)(EventDetailedPage);
