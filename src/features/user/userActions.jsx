import moment from 'moment';
import cuid from 'cuid';
import { toastr } from 'react-redux-toastr';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from '../event/eventConstants';

export const updateProfile = (user) =>
   async (dispatch, getState, { getFirebase }) => {
      const firebase = getFirebase();
      const { isLoaded, isEmpty, ...updatedUser } = user;
      if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
         updatedUser.dateOfBirth = moment(user.dateOfBirth).toDate();
      } try {
         await firebase.updateProfile(updatedUser);
         toastr.success('Success', 'Profile updated')
      } catch (error) {
         console.log(error);
      }
   }

export const uploadProfileImage = (file, fileName) =>
   async (dispatch, getState, { getFirebase, getFirestore }) => {
      const imageName = cuid();
      const firebase = getFirebase();
      const firestore = getFirestore();
      const user = firebase.auth().currentUser;
      const path = `${user.uid}/user_images`;
      const options = {
         name: imageName
      }; try {

         // View start of proccess in Redex tool:
         dispatch(asyncActionStart())

         // Upload the file to firebase storage
         let uploadedFile = await firebase.uploadFile(path, file, null, options);
         // Get url of image
         let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
         // get userdoc
         let userDoc = await firestore.get(`users/${user.uid}`);
         // Check if user has photo, if not update profile with new image
         if (!userDoc.data().photoURL) {
            await firebase.updateProfile({
               photoURL: downloadURL
            });
            await user.updateProfile({
               photoURL: downloadURL
            })
         }
         // Add the new photo to photos collection
         await firestore.add({
            collection: 'users',
            doc: user.uid,
            subcollections: [{ collection: 'photos' }]
         }, {
               name: imageName,
               url: downloadURL
            })

         // View end of proccess in Redex tool:
         dispatch(asyncActionFinish())

      } catch (error) {
         console.log(error);
         // View error of proccess in Redex tool:
         dispatch(asyncActionError())
         throw new Error('Problem uploading photo');
      }
   }

// Fonction delete image:
export const deletePhoto = (photo) =>
   async (dispatch, detState, { getFirebase, getFirestore }) => {
      const firebase = getFirebase();
      const firestore = getFirestore();
      const user = firebase.auth().currentUser;
      try {
         await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
         await firestore.delete({
            collection: 'users',
            doc: user.uid,
            subcollections: [{ collection: 'photos', doc: photo.id }]
         })
      } catch (error) {
         console.log(error);
         throw new Error('Problem deleting the photo')
      }
   }

// Function set Main photo:
export const setMainPhoto = (photo) => async (dispatch, getState) => {
   dispatch(asyncActionStart());
   const firestore = firebase.firestore();
   const user = firebase.auth().currentUser;
   const today = new Date(Date.now());
   let userDocRef = firestore.collection('users').doc(user.uid);
   let eventAttendeeRef = firestore.collection('event_attendee');
   try {
      let batch = firestore.batch();

      await batch.update(userDocRef, {
         photoURL: photo.url
      });

      let eventQuery = await eventAttendeeRef
         .where('userUid', '==', user.uid)
         .where('eventDate', '>', today);


      let eventQuerySnap = await eventQuery.get();

      for (let i = 0; i < eventQuerySnap.docs.length; i++) {
         let eventDocRef = await firestore.collection('events').doc(eventQuerySnap.docs[i].data().eventId)
         let event = await eventDocRef.get();
         if (event.data().hostUid === user.uid) {
            batch.update(eventDocRef, {
               hostPhotoURL: photo.url,
               [`attendees.${user.uid}.photoURL`]: photo.url
            })
         } else {
            batch.update(eventDocRef, {
               [`attendees.${user.uid}.photoURL`]: photo.url
            })
         }
      }

      console.log(batch);
      await batch.commit();
      dispatch(asyncActionFinish());

   } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
      throw new Error('Problem setting main photo')
   }
}

// Function to going to event:
export const goingToEvent = event => async (dispatch, getState) => {
   dispatch(asyncActionStart())
   const firestore = firebase.firestore();
   const user = firebase.auth().currentUser;
   const profile = getState().firebase.profile;
   const attendee = {
      going: true,
      joinDate: Date.now(),
      photoURL: profile.photoURL || '/assets/user.png',
      displayName: profile.displayName,
      host: false
   };
   try {
      let eventDocRef = firestore.collection('events').doc(event.id);
      let eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`);

      await firestore.runTransaction(async (transaction) => {
         await transaction.get(eventDocRef);
         await transaction.update(eventDocRef, {
            [`attendees.${user.uid}`]: attendee
         })
         await transaction.set(eventAttendeeDocRef, {
            eventId: event.id,
            userUid: user.uid,
            eventDate: event.date,
            host: false
         })
      })
      dispatch(asyncActionFinish())
      toastr.success('Success', 'You have signed up to the event');
   } catch (error) {
      console.log(error);
      dispatch(asyncActionError())
      toastr.error('Oops', 'Problem signing up to event');
   }
};

// Function cancel event:
export const cancelGoingToEvent = (event) =>
   async (dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      const user = firestore.auth().currentUser;
      //
      try {
         await firestore.update(`events/${event.id}`, {
            [`attendees.${user.uid}`]: firestore.FieldValue.delete()
         });
         await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
         toastr.success('Success', 'You have removed yourself from the event');
      } catch (error) {
         toastr.error('Oops', 'Somthing went wrong');
      }
   }

export const getUserEvents = (userUid, activeTab) => async (dispatch, getState) => {
   dispatch(asyncActionStart());
   const firestore = firebase.firestore();
   const today = new Date(Date.now());
   let eventsRef = firestore.collection('event_attendee');
   let query;

   switch (activeTab) {
      case 1: // Past events
         query = eventsRef
            .where('userUid', '==', userUid)
            .where('eventDate', '<=', today)
            .orderBy('eventDate', 'desc');
         break;
      case 2: // Future events
         query = eventsRef
            .where('userUid', '==', userUid)
            .where('eventDate', '>=', today)
            .orderBy('eventDate');
         break;
      case 3: // Hosted events
         query = eventsRef
            .where('userUid', '==', userUid)
            .where('host', '==', true)
            .orderBy('eventDate', 'desc');
         break;
      default:
         query = eventsRef
            .where('userUid', '==', userUid)
            .orderBy('eventDate', 'desc');
   }
   //
   try {
      let querySnap = await query.get();
      let events = [];

      for (let i = 0; i < querySnap.docs.length; i++) {
         let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
         events.push({ ...evt.data(), id: evt.id })
      }

      dispatch({ type: FETCH_EVENTS, payload: { events } })

      dispatch(asyncActionFinish());
   } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
   }
};

export const followUser = (userToFollow, isFollowing, isCurrentUser) => async (dispatch, getState, { getFirestore }) => {
   const firestore = getFirestore();
   const user = firestore.auth().currentUser;
   const following = {
      photoURL: userToFollow.photoURL || '/assets/user.png',
      city: userToFollow.city || 'UnknownCity',
      displayName: userToFollow.displayName
   };
   try {
      await firestore.set(
         {
            collection: 'users',
            doc: user.uid,
            subcollections: [{ collection: 'following', doc: userToFollow.id }]
         },
         following //What we gonna add
      )
      console.log('FOLLOW SUCCESS');
      console.log(isFollowing);
   } catch (error) {
      console.log(error);
   }
};

export const unfollowUser = (userToUnfollow, isFollowing) =>
   async (dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      const user = firestore.auth().currentUser;
      try {
         await firestore.delete({
            collection: 'users',
            doc: user.uid,
            subcollections: [{ collection: 'following', doc: userToUnfollow.id }]
         })
         console.log('UNFOLLOW SUCCESS');
         console.log(isFollowing);
      } catch (error) {
         console.log(error);
      }
   }