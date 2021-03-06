import React from 'react';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

const eventImageStyle = {
   filter: 'brightness(30%)'
};

const eventImageTextStyle = {
   position: 'absolute',
   bottom: '5%',
   left: '5%',
   width: '100%',
   height: 'auto',
   color: 'white'
};

const EventDatailedHeader = ({ event, loading, isHost, isGoing, goingToEvent, cancelGoingToEvent, authenticated, openModal }) => {
   let eventDate;
   if (event.date) {
      eventDate = event.date.toDate();
   }
   return (
      <div>
         <Segment.Group>
            <Segment basic attached="top" style={{ padding: '0' }}>
               <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid style={eventImageStyle} />

               <Segment basic style={eventImageTextStyle}>
                  <Item.Group>
                     <Item>
                        <Item.Content>
                           <Header
                              size="huge"
                              content={event.title}
                              style={{ color: 'white' }}
                           />
                           <p>{format(eventDate, 'dddd Do MMMM')}</p>
                           <p>
                              Hosted by <strong>{event.hostedBy}</strong>
                           </p>
                        </Item.Content>
                     </Item>
                  </Item.Group>
               </Segment>
            </Segment>

            <Segment attached="bottom">
               {!isHost &&
                  <div>
                     {isGoing && !event.cancelled &&
                        <Button
                           onClick={() => cancelGoingToEvent(event)}
                           content='CANCEL MY PLACE'
                        />}
                     {!isGoing &&
                        authenticated && !event.cancelled &&
                        <Button
                           loading={loading}
                           onClick={() => goingToEvent(event)}
                           color="teal"
                           content='JOIN THIS EVENT'
                        />}
                     {!authenticated && !event.cancelled &&
                        <Button
                           loading={loading}
                           onClick={() => openModal('UnauthModal')}
                           color="teal"
                           content='JOIN THIS EVENT'
                        />}
                     {event.cancelled && !isHost &&
                        <Label size='large' color='red' content='THIS EVENT HAS BEEN CANCELLED' />}
                  </div>
               }
               {isHost &&
                  (<Button
                     as={Link}
                     to={`/manage/${event.id}`}
                     color="orange"
                     content='MANAGE EVENT'
                  />)}
            </Segment>
         </Segment.Group>
      </div>
   )
}

export default EventDatailedHeader
