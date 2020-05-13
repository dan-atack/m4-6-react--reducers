import React from 'react';

// start off by creating a new context component:
export const SeatContext = React.createContext(null);

// then, set up an initial state object which can be used as a blank template to receive seat data from the server:
const initialState = {
  hasLoaded: false,
  seats: null,
  numOfRows: 0,
  seatsPerRow: 0,
};

// next, create a reducer function which will house the switch cases for our seat-fetching operations:
function reducer(state, action) {
  switch (action.type) {
    case 'recieve-seat-info-from-server': {
      return {
        ...state,
        hasLoaded: true,
        seats: action.seats,
        numOfRows: action.numOfRows,
        seatsPerRow: action.seatsPerRow,
      };
    }
    case 'mark-seat-as-purchased': {
      return {
        ...state,
        seats: action.seats,
      };
    }
    default:
      throw new Error('something bad happened. DID I DO DAT??');
  }
}

// the context provider module follows. This one is quite complex because it has to hold the dispatch function (define!) and wrap
// whatever children are given to it as props so they can partake of the context:
export const SeatProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // Our first function inside the seat context provider will be for fetching info from the server:
  const receiveSeatInfoFromServer = (data) => {
    dispatch({
      type: 'recieve-seat-info-from-server',
      ...data,
    });
  };
  const markSeatAsPurchased = (seats) => {
    dispatch({
      type: 'mark-seat-as-purchased',
      seats,
    });
  };
  // Now we place the value in a provider, which will 'wrap' the index so everything in the app can use the seat context's data:
  return (
    <SeatContext.Provider
      // inside our provider we set the 'value' to be equal to an object with a property for state, and a property 'actions'
      // which will hold all of the functions we want to be able to pass down into different parts of the app:
      // Remember, 'value' is like global variables/functions, so anything in here can be used anywhere.
      value={{
        state,
        actions: {
          receiveSeatInfoFromServer,
          markSeatAsPurchased,
        },
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};
