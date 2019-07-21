import React, { Component } from 'react'
import { Segment, Header, Comment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import EventDatailedChatForm from './EventDatailedChatForm';
import distanceInWords from 'date-fns/distance_in_words';


class EventDatailedChat extends Component {
   state = {
      showReplyForm: false,
      selectedCommentId: null
   }

   handleOpenReplyForm = (id) => () => {
      this.setState({
         showReplyForm: true,
         selectedCommentId: id
      })
   }

   handleCloseReplyForm = () => {
      this.setState({
         showReplyForm: false,
         selectedCommentId: null
      })
   }

   render() {
      const { addEventComment, eventId, eventChat } = this.props;
      const { showReplyForm, selectedCommentId } = this.state;
      return (
         <div>
            <Segment
               textAlign="center"
               attached="top"
               inverted
               color="teal"
               style={{ border: 'none' }}
            >
               <Header>Chat about this event</Header>
            </Segment>

            <Segment attached>
               <Comment.Group>

                  {/* Main comment: */}
                  {eventChat &&
                     eventChat.map((comment) => (
                        <Comment key={comment.id}>
                           <Comment.Avatar src={comment.photoURL} />
                           <Comment.Content>
                              <Comment.Author as={Link} to={`/profile/${comment.uid}`}>{comment.displayName}</Comment.Author>
                              <Comment.Metadata>
                                 <div>{distanceInWords(comment.date, Date.now())} ago</div>
                              </Comment.Metadata>
                              <Comment.Text>{comment.text}</Comment.Text>
                              <Comment.Actions>
                                 <Comment.Action onClick={this.handleOpenReplyForm(comment.id)} >Reply</Comment.Action>
                                 {showReplyForm && selectedCommentId === comment.id && (
                                    <EventDatailedChatForm
                                       addEventComment={addEventComment}
                                       eventId={eventId}
                                       form={`replay_${comment.id}`}
                                       closeForm={this.handleCloseReplyForm}
                                       parentId={comment.id}
                                    />
                                 )}
                              </Comment.Actions>
                           </Comment.Content>

                           {/* Child comment */}
                           {comment.childNodes && comment.childNodes.map((child) => (
                              <Comment.Group key={child.id}>
                                 <Comment>
                                    <Comment.Avatar src={child.photoURL} />
                                    <Comment.Content>
                                       <Comment.Author as={Link} to={`/profile/${child.uid}`}>{child.displayName}</Comment.Author>
                                       <Comment.Metadata>
                                          <div>{distanceInWords(child.date, Date.now())} ago</div>
                                       </Comment.Metadata>
                                       <Comment.Text>{child.text}</Comment.Text>
                                       <Comment.Actions>
                                          <Comment.Action onClick={this.handleOpenReplyForm(child.id)} >Reply</Comment.Action>
                                          {showReplyForm && selectedCommentId === child.id && (
                                             <EventDatailedChatForm
                                                addEventComment={addEventComment}
                                                eventId={eventId}
                                                form={`replay_${child.id}`}
                                                closeForm={this.handleCloseReplyForm}
                                                parentId={child.parentId}
                                             />
                                          )}
                                       </Comment.Actions>
                                    </Comment.Content>
                                 </Comment>
                              </Comment.Group>
                           ))}

                        </Comment>
                     ))
                  }

               </Comment.Group>

               <EventDatailedChatForm
                  addEventComment={addEventComment}
                  eventId={eventId}
                  form={'newComment'}
                  parentId={0}
               />

            </Segment>
         </div>
      )
   }
}

export default EventDatailedChat
