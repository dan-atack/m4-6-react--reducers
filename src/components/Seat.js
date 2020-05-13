import React from 'react';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import seatAvailable from '../assets/seat-available.svg';
import { BookingContext } from './BookingContext';

function Seat({ seatId, seats }) {
  // import booking context actions:
  const {
    actions: { beginBookingProcess, cancelBookingProcess },
  } = React.useContext(BookingContext);
  // function to dispatch/initiate booking process:
  const seatClick = (seatId, price) => {
    beginBookingProcess(seatId, price);
  };

  // greying (graying?) out seats based on their takenness:
  const taken = seats[seatId].isBooked;
  return (
    <Tippy
      content={
        taken ? (
          <></>
        ) : (
          <Tooltip>
            <span>Seat {seatId}</span>
            <br></br>
            <span>Price: ${seats[seatId].price}</span>
          </Tooltip>
        )
      }
    >
      <SeatWrapper className={taken ? 'taken' : 'vacant'}>
        <button
          disabled={taken ? true : false}
          onMouseUp={() => seatClick(seatId, seats[seatId].price)}
        >
          <img alt={`seat-${seatId}`} src={seatAvailable} />
        </button>
      </SeatWrapper>
    </Tippy>
  );
}

const SeatWrapper = styled.div`
  padding: 5px;
  &.taken {
    filter: grayscale(100%);
  }
`;

const Tooltip = styled.div`
  background-color: whitesmoke;
  padding: 4px;
  color: darkblue;
  border: 1px solid darkblue;
  border-radius: 8px;
`;

export default Seat;
