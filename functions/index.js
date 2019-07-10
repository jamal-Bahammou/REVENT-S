const functions = require('firebase-functions');

// Access to admin functionality in firebase:
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Function to create a new activity Object:
const newActivity = (type, event, id) => {
   return {
      type: type,
      eventDate: event.date,
      hostedBy: event.hostedBy,
      title: event.title,
      photoURL: event.hostPhotoURL,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      hostUid: event.hostUid,
      eventId: id
   }
}

// Main function to create a New activity:
exports.createActivity = functions.firestore
   .document('events/{eventId}')
   .onCreate(event => {

      // Create a new Event:
      let newEvent = event.data();
      console.log(newEvent);

      // Create a new activity Object:
      const activity = newActivity('newEvent', newEvent, event.id);
      console.log(activity);

      // Add it to new activity collection: 
      return admin.firestore().collection('activity')
         .add(activity)
         .then((docRef) => {
            return console.log('Activity created with ID: ', docRef.id);
         })
         .catch((err) => {
            return console.log('Error adding activity', err);
         })
   })

// Main function to delete an activity:
exports.cancelActivity = functions.firestore
   .document('events/{eventId}')
   .onUpdate((event, context) => {
      let updatedEvent = event.after.data();
      let previousEventData = event.before.data();
      console.log({
         event
      });
      console.log({
         context
      });
      console.log({
         updatedEvent
      });
      console.log({
         previousEventData
      });

      if (!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled)
         return false;

      const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId);
      console.log({
         activity
      });

      return admin
         .firestore()
         .collection('activity')
         .add(activity)
         .then((docRef) => {
            return console.log('Activity cancelled with ID: ', docRef.id);
         })
         .catch((err) => {
            return console.log('Error cancelling activity', err);
         })
   })