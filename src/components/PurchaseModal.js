import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BookingContext } from './BookingContext';
import { SeatContext } from './SeatContext';

function PurchaseModal() {
  const {
    state: { status, error, selectedSeatId, price },
    actions: {
      cancelBookingProcess,
      purchaseTicketRequest,
      purchaseTicketFailure,
      purchaseTicketSuccess,
    },
  } = React.useContext(BookingContext);
  const {
    state: { seats },
    actions: { markSeatAsPurchased },
  } = React.useContext(SeatContext);
  // controlled states for CC info:
  const [creditCard, setCreditCard] = React.useState('');
  const handleCCChange = (ev) => {
    setCreditCard(ev.target.value);
  };
  const [expiration, setExpiration] = React.useState('');
  const handleExpChange = (ev) => {
    setExpiration(ev.target.value);
  };
  // Post function for sending seat data to the server:
  const handleBooking = (seatId) => {
    purchaseTicketRequest();
    if (creditCard !== '' && expiration !== '') {
      fetch('/api/book-seat', {
        method: 'POST',
        body: JSON.stringify({
          seatId: seatId,
          creditCard: creditCard,
          expiration: expiration,
        }),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((reply) => {
          if (Object.keys(reply).includes('success')) {
            purchaseTicketSuccess();
            let newSeats = { ...seats, ...seatId, isBooked: true };
            markSeatAsPurchased(newSeats);
          } else {
            console.log('fail');
            purchaseTicketFailure(reply);
          }
        });
    } else {
      purchaseTicketFailure({
        message: 'Please enter credit card information!',
      });
    }
  };
  return (
    <Dialog open={selectedSeatId !== null} onClose={cancelBookingProcess}>
      <h2 style={{ margin: 16 }}>Purchase Ticket</h2>
      <p style={{ margin: 16 }}>
        You're purchasing 1 ticket for the price of ${price}.
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid gray',
        }}
      >
        <span style={{ margin: 32, fontWeight: 'bold' }}>Row</span>
        <span style={{ margin: 32, fontWeight: 'bold' }}>Seat</span>
        <span style={{ margin: 32, fontWeight: 'bold' }}>Price</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid gray',
        }}
      >
        <span style={{ margin: 40 }}>
          {selectedSeatId ? selectedSeatId[0] : 0}
        </span>
        <span style={{ margin: 40 }}>
          {selectedSeatId ? selectedSeatId.slice(2) : 'A'}
        </span>
        <span style={{ margin: 40 }}>${price}</span>
      </div>
      <h3 style={{ marginLeft: 16 }}>Enter payment details</h3>
      <form style={{ padding: 16 }}>
        <TextField
          variant='outlined'
          placeholder='Credit Card #'
          value={creditCard}
          onChange={handleCCChange}
        ></TextField>
        <TextField
          variant='outlined'
          placeholder='Expiration'
          value={expiration}
          onChange={handleExpChange}
        ></TextField>
        <button
          type='button'
          style={{ color: 'white', backgroundColor: 'blue' }}
          onMouseUp={() => handleBooking(selectedSeatId)}
        >
          {status === 'awaiting-response' ? <CircularProgress /> : 'PURCHASE'}
        </button>
      </form>
      <p>{error ? error.message : ''}</p>
    </Dialog>
  );
}

export default PurchaseModal;
