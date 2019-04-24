import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import cuid from 'cuid';
import EventList from '../EventList/EventList';
import EventForm from '../EventForm/EventForm';

const eventsDashboard = [
   {
      id: '1',
      title: 'Trip to Tower of London',
      date: '2019-03-27',
      category: 'culture',
      description:
         'A software engineer develops various applications that enable users to accomplish tasks on their personal computers and electronic devices. Often, software engineers are employed by software publishers or computer systems design firms.',
      city: 'London, UK',
      venue: "Tower of London, St Katharine's & Wapping, London",
      hostedBy: 'Firas',
      hostPhotoURL: '/assets/firas.jpg',
      attendees: [
         {
            id: 'a',
            name: 'David',
            photoURL: '/assets/davidcunha.xyz.jpg'
         },
         {
            id: 'b',
            name: 'Jeffnhorner',
            photoURL: '/assets/jeffnhorner.jpg'
         }
      ]
   },
   {
      id: '2',
      title: 'Trip to Punch and Judy Pub',
      date: '2019-04-24',
      category: 'drinks',
      description:
         'A programmer, developer, coder, or software engineer is a person who creates computer software. The term computer programmer can refer to a specialist in one area of computers, or to a generalist who writes code for many kinds of software.',
      city: 'London, UK',
      venue: 'Punch & Judy, Henrietta Street, London, UK',
      hostedBy: 'Vegangirlthatcodes',
      hostPhotoURL: '/assets/vegangirlthatcodes.jpg',
      attendees: [
         {
            id: 'b',
            name: 'Fidalgo',
            photoURL: '/assets/fidalgo.dev.jpg'
         },
         {
            id: 'a',
            name: 'Luca',
            photoURL: '/assets/lucabockmann.jpg'
         }
      ]
   }
]


class EventDashboard extends Component {
   state = {
      events: eventsDashboard,
      isOpen: false,
      selectedEvent: null
   };

   handleFormOpen = () => {
      this.setState({
         selectedEvent: null,
         isOpen: true
      });
   };

   handleCancel = () => {
      this.setState({
         isOpen: false
      });
   };

   handleUpdateEvent = (updatedEvent) => {
      this.setState({
         events: this.state.events.map(event => {
            if (event.id === updatedEvent.id) {
               return Object.assign({}, updatedEvent);
            } else {
               return event
            }
         }),
         isOpen: false,
         selectedEvent: null
      })
   }

   handleOpenEvent = (eventToOpen) => () => {
      this.setState({
         selectedEvent: eventToOpen,
         isOpen: true
      })
   }

   handleCreateEvent = (newEvent) => {
      newEvent.id = cuid();
      newEvent.hostPhotoURL = '/assets/user.png';
      const updatedEvents = [...this.state.events, newEvent];
      this.setState({
         events: updatedEvents,
         isOpen: false
      })
   }

   handleDeleteEvent = (eventId) => () => {
      const updatedEvents = this.state.events.filter(e => e.id !== eventId);
      this.setState({
         events: updatedEvents
      })
   }

   render() {
      const { selectedEvent } = this.state;
      return (
         <Grid>
            <Grid.Column width={10}>
               <EventList deleteEvent={this.handleDeleteEvent} onEventOpen={this.handleOpenEvent} events={this.state.events} />
            </Grid.Column>
            <Grid.Column width={6}>
               <Button onClick={this.handleFormOpen} positive content="Create Event" />
               {this.state.isOpen && <EventForm updateEvent={this.handleUpdateEvent} selectedEvent={selectedEvent} createEvent={this.handleCreateEvent} handleCancel={this.handleCancel} />}
            </Grid.Column>
         </Grid>
      )
   }
}

export default EventDashboard;