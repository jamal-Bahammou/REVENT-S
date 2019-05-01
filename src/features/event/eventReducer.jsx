import { createReducer } from "../../app/common/util/reducerUtil";
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from "./eventConstants";

const initialState = [
   {
      id: '1',
      title: 'Trip to Tower of London',
      date: '2019-03-27',
      category: 'culture',
      description:
         'A software engineer develops various applications that enable users to accomplish tasks on their personal computers and electronic devices. Often, software engineers are employed by software publishers or computer systems design firms.',
      city: 'London, UK',
      venue: "Tower of London, St Katharine's & Wapping, London",
      venueLatLng: {
         lat: 40.7484405,
         lng: -73.98566440000002
      },
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
      venueLatLng: {
         lat: 51.5118074,
         lng: -0.12300089999996544
      },
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
];

export const createEvent = (state, payload) => {
   return [...state, Object.assign({}, payload.event)]
}

export const updateEvent = (state, payload) => {
   return [
      ...state.filter(event => event.id !== payload.event.id),
      Object.assign({}, payload.event)
   ]
}

export const deleteEvent = (state, payload) => {
   return [...state.filter(event => event.id !== payload.eventId)]
}

export default createReducer(initialState, {
   [CREATE_EVENT]: createEvent,
   [UPDATE_EVENT]: updateEvent,
   [DELETE_EVENT]: deleteEvent
})