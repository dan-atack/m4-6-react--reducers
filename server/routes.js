/**
  Endpoints related to feeds (ordered sets of tweets)
*/
const router = require('express').Router();
const { delay } = require('./helpers');
const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;
const BASE_PRICE = 225;
const PRICE_INCREMENT_PER_ROW = -10;
let state;
router.get('/api/seat-availability', (req, res) => {
  if (!state) {
    state = {
      seats: getInitialSeatData(),
    };
  }
  setTimeout(() => {
    return res.json({
      seats: state.seats,
      numOfRows: NUM_OF_ROWS,
      seatsPerRow: SEATS_PER_ROW,
    });
  }, 750);
});
let lastBookingAttemptSucceeded = false;
router.post('/api/book-seat', async (req, res) => {
  const { seatId, creditCard, expiration } = req.body;
  if (!state) {
    state = {
      seats: getInitialSeatData(),
    };
  }
  const isAlreadyBooked = !!state.seats[seatId].isBooked;
  await delay(Math.random() * 3000);
  if (!creditCard || !expiration) {
    return res.status(400).json({
      message: 'Please provide credit card information!',
    });
  }
  if (isAlreadyBooked) {
    return res.status(400).json({
      message: 'This seat has already been booked!',
    });
  }
  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
    return res.status(500).json({
      message: 'An unknown error has occurred. Please try your request again.',
    });
  }
  lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
  state.seats[seatId].isBooked = true;
  return res.json({
    success: true,
  });
});
//////// HELPERS
const getRowName = rowIndex => {
  return String.fromCharCode(65 + rowIndex);
};
const getInitialSeatData = () => {
  const seats = {};
  for (let rowIndex = 0; rowIndex < NUM_OF_ROWS; rowIndex++) {
    for (let seatIndex = 0; seatIndex < SEATS_PER_ROW; seatIndex++) {
      const seatId = `${getRowName(rowIndex)}-${seatIndex + 1}`;
      // 40% of seats will be booked, at random.
      const isBooked = Math.random() < 0.4;
      seats[seatId] = {
        price: BASE_PRICE + rowIndex * PRICE_INCREMENT_PER_ROW,
        isBooked,
      };
    }
  }
  return seats;
};

module.exports = router;

/** OLD CODE: REPLACED AT SCOTT'S INSTRUCTIONS:
 * 
  Endpoints related to feeds (ordered sets of tweets)
*/
// const router = require('express').Router();
// const { delay } = require('./helpers');

// const NUM_OF_ROWS = 8;
// const SEATS_PER_ROW = 12;

// let state;

// router.get('/api/seat-availability', (req, res) => {
//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }

//   return res.json({
//     bookedSeats: state.bookedSeats,
//     numOfRows: NUM_OF_ROWS,
//     seatsPerRow: SEATS_PER_ROW,
//   });
// });

// let lastBookingAttemptSucceeded = false;

// router.post('/api/book-seat', async (req, res) => {
//   const { seatId, creditCard, expiration } = req.body;

//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }

//   const isAlreadyBooked = !!state.bookedSeats[seatId];

//   await delay(Math.random() * 3000);

//   if (!creditCard || !expiration) {
//     return res.status(400).json({
//       message: 'Please provide credit card information!',
//     });
//   }

//   if (isAlreadyBooked) {
//     return res.status(400).json({
//       message: 'This seat has already been booked!',
//     });
//   }

//   if (lastBookingAttemptSucceeded) {
//     lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//     return res.status(500).json({
//       message: 'An unknown error has occurred. Please try your request again.',
//     });
//   }

//   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//   state.bookedSeats[seatId] = true;

//   return res.json({
//     success: true,
//   });
// });

// //////// HELPERS
// const getRowName = rowIndex => {
//   return String.fromCharCode(65 + rowIndex);
// };

// // const getRowIndex = rowName => {
// //   return rowName.charCodeAt(0) - 65;
// // };

// const randomlyBookSeats = num => {
//   const bookedSeats = {};

//   while (num > 0) {
//     const row = Math.floor(Math.random() * NUM_OF_ROWS);
//     const seat = Math.floor(Math.random() * SEATS_PER_ROW);

//     const seatId = `${getRowName(row)}-${seat + 1}`;

//     bookedSeats[seatId] = true;

//     num--;
//   }

//   return bookedSeats;
// };

// module.exports = router;