import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const UserDetailedSidebar = ({ isFollowing, isCurrentUser, profile, followUser, unfollowUser }) => {
   return (
      <Grid.Column width={4}>
         <Segment>
            {isCurrentUser &&
               <Button
                  as={Link}
                  to='/settings'
                  color='teal'
                  fluid
                  basic
                  content='EDIT PROFILE'
               />}
            {!isCurrentUser && !isFollowing &&
               (<Button
                  onClick={() => followUser(profile, isFollowing)}
                  color='teal'
                  fluid
                  basic
                  content='FOLLOW USER'
               />)}
            {!isCurrentUser && isFollowing &&
               (<Button
                  onClick={() => unfollowUser(profile, isFollowing)}
                  color='teal'
                  fluid
                  basic
                  content='UNFOLLOW USER'
               />)}
         </Segment>
      </Grid.Column>
   )
}

export default UserDetailedSidebar;