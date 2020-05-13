import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tippy from '@tippyjs/react';
import { SeatContext } from './SeatContext';
import seatAvailable from '../assets/seat-available.svg';
import Seat from './Seat';

import { getRowName, getSeatNum } from '../helpers';
import { range } from '../utils';

const TicketWidget = () => {
  const {
    state: { hasLoaded, numOfRows, seatsPerRow, seats },
  } = React.useContext(SeatContext);

  // TODO: implement the loading spinner <CircularProgress />
  // with the hasLoaded flag
  while (!hasLoaded) {
    return (
      <>
        <CircularProgress></CircularProgress>
        <span>Loading seat data. Please wait.</span>
      </>
    );
  }

  return (
    <Wrapper>
      {range(numOfRows).map((rowIndex) => {
        const rowName = getRowName(rowIndex);

        return (
          <Row key={rowIndex}>
            <RowLabel>Row {rowName}</RowLabel>
            {range(seatsPerRow).map((seatIndex) => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;
              return (
                <Seat
                  key={`${seatId}-${seatIndex}`}
                  seatId={seatId}
                  seats={seats}
                />
              );
            })}
          </Row>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
`;

const Row = styled.div`
  display: flex;
  position: relative;

  &:not(:last-of-type) {
    border-bottom: 1px solid #ddd;
  }
`;

const RowLabel = styled.div`
  font-weight: bold;
`;

export default TicketWidget;
