import React from 'react';

import GlobalStyles from './GlobalStyles';
import { SeatContext } from './SeatContext';
import { BookingContext } from './BookingContext';
import TicketWidget from './TicketWidget';
import PurchaseModal from './PurchaseModal';
import Snack from './Snack';

function App() {
  const {
    state: { numOfRows, seatsPerRow, seats },
    actions: { receiveSeatInfoFromServer },
  } = React.useContext(SeatContext);

  const {
    state: { status },
  } = React.useContext(BookingContext);

  React.useEffect(() => {
    console.log(status);
  }, [status]);

  React.useEffect(() => {
    fetch('./api/seat-availability')
      .then((res) => res.json())
      .then((data) => receiveSeatInfoFromServer(data));
  }, [seats]);

  return (
    <>
      <GlobalStyles />
      <PurchaseModal />
      Seat Booking App Thing
      <div>
        This venue has {numOfRows} rows, and {seatsPerRow} seats per row!
      </div>
      <TicketWidget></TicketWidget>
      {status === 'purchased' ? <Snack /> : <></>}
    </>
  );
}

export default App;
