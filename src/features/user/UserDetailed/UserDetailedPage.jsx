import React, { Component } from 'react'; // imrc
import { Button, Card, Grid, Header, Icon, Image, Item, List, Menu, Segment } from 'semantic-ui-react';

class UserDetailedPage extends Component {
   render() {
      const { profile } = this.props;
      return (
         <Grid>

            <Grid.Column width={16}>
               <Segment>
                  <Item.Group>
                     <Item>
                        <Item.Image
                           avatar
                           size='small'
                           src='/assets/jamal_bahammou.png'
                        />
                        <Item.Content verticalAlign='bottom'>
                           <Header as='h1' content='Jamal Bahammou' />
                           <br />
                           <Header as='h3'>Occupation</Header>
                           <br />
                           <Header as='h3'>21, Lives in Bei Jing, CN</Header>
                        </Item.Content>
                     </Item>
                  </Item.Group>
               </Segment>
            </Grid.Column>

            <Grid.Column width={12}>
               <Segment>
                  <Grid columns={2}>
                     <Grid.Column width={10}>
                        <Header icon='smile' content='ABOUT DISPLAY NAME' />
                        <p>I am a: <strong>Full Stack Developer</strong></p>
                        <p>Originally from: <strong>Morocco Kingdom</strong></p>
                        <p>Member Since: <strong>28th March 2018</strong></p>
                        <p>Description of user:</p>
                     </Grid.Column>
                     <Grid.Column width={6}>
                        <Header icon='heart outline' content='INTERESTS' />
                        <List>
                           <Item>
                              <Icon name='heart' />
                              <Item.Content>Interest 1</Item.Content>
                           </Item>
                           <Item>
                              <Icon name='heart' />
                              <Item.Content>Interest 2</Item.Content>
                           </Item>
                           <Item>
                              <Icon name='heart' />
                              <Item.Content>Interest 3</Item.Content>
                           </Item>
                           <Item>
                              <Icon name='heart' />
                              <Item.Content>Interest 4</Item.Content>
                           </Item>
                        </List>
                     </Grid.Column>
                  </Grid>
               </Segment>
            </Grid.Column>

            <Grid.Column width={4}>
               <Segment>
                  <Button
                     color='teal'
                     fluid
                     basic
                     content='EDIT PROFILE'
                  />
               </Segment>
            </Grid.Column>

            <Grid.Column width={12}>
               <Segment attached>
                  <Header icon='image' content='PHOTOS' />
                  <Image.Group size='small'>
                     <Image src='/assets/jamal_bahammou.png' />
                     <Image src='/assets/vegangirlthatcodes.jpg' />
                     <Image src='/assets/fidalgo.dev.jpg' />
                     <Image src='/assets/davidcunha.xyz.jpg' />
                     <Image src='/assets/firas.jpg' />
                     <Image src='/assets/jeffnhorner.jpg' />
                  </Image.Group>
               </Segment>
            </Grid.Column>

            <Grid.Column width={12}>
               <Segment attached>
                  <Header icon='calendar' content='EVENTS' />
                  <Menu secondary pointing>
                     <Menu.Item name='All Events' active />
                     <Menu.Item name='Past Events' />
                     <Menu.Item name='Future Events' />
                     <Menu.Item name='Events Hosted' />
                  </Menu>
                  <Card.Group itemsPeRow={5}>
                     <Card>
                        <Image src='/assets/categoryImages/travel.jpg' />
                        <Card.Content>
                           <Card.Header textAlign='center'>
                              Event Title
                           </Card.Header>
                           <Card.Meta textAlign='center'>
                              28th Juin 2019 at 10:00 PM
                           </Card.Meta>
                        </Card.Content>
                     </Card>
                     <Card>
                        <Image src='/assets/categoryImages/music.jpg' />
                        <Card.Content>
                           <Card.Header textAlign='center'>
                              Event Title
                           </Card.Header>
                           <Card.Meta textAlign='center'>
                              28th Juin 2019 at 10:00 PM
                           </Card.Meta>
                        </Card.Content>
                     </Card>
                  </Card.Group>
               </Segment>
            </Grid.Column>

         </Grid>
      )
   }
}
export default UserDetailedPage;
