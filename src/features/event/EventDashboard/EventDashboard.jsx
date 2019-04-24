import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventForm from '../EventForm/EventForm';

const eventsDashboard = [
   {
      id: '1',
      title: 'Trip to Tower of London',
      date: '2019-03-27T11:00:00+00:00',
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
      date: '2019-04-24T03:47:00+01:00',
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
      isOpen: false
   };

   handleFormOpen = () => {
      this.setState({
         isOpen: true
      });
   };

   handleCancel = () => {
      this.setState({
         isOpen: false
      });
   };

   render() {
      return (
         <Grid>
            <Grid.Column width={10}>
               <EventList events={this.state.events} />
            </Grid.Column>
            <Grid.Column width={6}>
               <Button onClick={this.handleFormOpen} positive content="Create Event" />
               {this.state.isOpen && <EventForm handleCancel={this.handleCancel} />}
            </Grid.Column>
         </Grid>
      )
   }
}

export default EventDashboard;