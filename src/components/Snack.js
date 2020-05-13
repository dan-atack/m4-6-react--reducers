import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

function Snack() {
  return (
    <>
      <Snackbar open={true}>
        <div style={{ backgroundColor: 'green', padding: 16, zIndex: 1000 }}>
          Your ticket has been purchased. Enjoy the show!
        </div>
      </Snackbar>
      ;
    </>
  );
}

export default Snack;
