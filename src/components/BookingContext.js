import React from 'react';

export const BookingContext = React.createContext(null);

const initialState = {
  status: 'idle',
  error: null,
  selectedSeatId: null,
  price: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'BEGIN_BOOKING_PROCESS': {
      return {
        ...state,
        status: 'seat-selected',
        selectedSeatId: action.seatId,
        price: action.price,
      };
    }
    case 'CANCEL_BOOKING_PROCESS': {
      return {
        ...state,
        status: 'idle',
        error: null,
        selectedSeatId: null,
        price: null,
      };
    }
    case 'PURCHASE_TICKET_REQUEST': {
      return {
        ...state,
        status: 'awaiting-response',
      };
    }
    case 'PURCHASE_TICKET_FAILURE': {
      return {
        ...state,
        status: 'error',
        error: action.err,
      };
    }
    case 'PURCHASE_TICKET_SUCCESS': {
      return {
        status: 'purchased',
        error: null,
        selectedSeatId: null,
        price: null,
      };
    }
    default:
      throw new Error('something bad happened. DID I DO DAT??');
  }
}

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const beginBookingProcess = (seatId, price) => {
    dispatch({
      type: 'BEGIN_BOOKING_PROCESS',
      seatId,
      price,
    });
  };
  const cancelBookingProcess = () => {
    dispatch({
      type: 'CANCEL_BOOKING_PROCESS',
    });
  };
  const purchaseTicketRequest = () => {
    dispatch({
      type: 'PURCHASE_TICKET_REQUEST',
    });
  };
  const purchaseTicketFailure = (err) => {
    dispatch({
      type: 'PURCHASE_TICKET_FAILURE',
      err,
    });
  };
  const purchaseTicketSuccess = () => {
    dispatch({
      type: 'PURCHASE_TICKET_SUCCESS',
    });
  };
  return (
    <BookingContext.Provider
      value={{
        state,
        actions: {
          beginBookingProcess,
          cancelBookingProcess,
          purchaseTicketRequest,
          purchaseTicketFailure,
          purchaseTicketSuccess,
        },
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
