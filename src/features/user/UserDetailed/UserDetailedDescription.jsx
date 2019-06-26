import React from 'react';
import { Grid, Segment, Header, List, Item, Icon } from 'semantic-ui-react';
import format from 'date-fns/format';

const UserDetailedDescription = ({ profile }) => {
   let createdAt;
   if (profile.createdAt) {
      createdAt = format(profile.createdAt.toDate(), 'D MMM YYYY');
   }
   const { occupation, origin, about, interests } = profile;
   return (
      <Grid.Column width={12}>
         <Segment>
            <Grid columns={2}>
               <Grid.Column width={10}>
                  <Header icon='smile' content='ABOUT DISPLAY NAME' />
                  <p>I am a: <strong>{occupation || 'tbn'}</strong></p>
                  <p>Originally from: <strong>{origin || 'tbn'}</strong></p>
                  <p>Member Since: <strong>{createdAt}</strong></p>
                  <p><strong>{about}</strong></p>
               </Grid.Column>
               <Grid.Column width={6}>
                  <Header icon='heart outline' content='INTERESTS' />
                  {interests ?
                     <List>
                        {interests &&
                           interests.map((interest, index) => (
                              <Item key={index}>
                                 <Icon name="heart" />
                                 <Item.Content>{interest}</Item.Content>
                              </Item>
                           ))}
                     </List> : <p>No interests</p>}
               </Grid.Column>
            </Grid>
         </Segment>
      </Grid.Column>
   );
}

export default UserDetailedDescription;