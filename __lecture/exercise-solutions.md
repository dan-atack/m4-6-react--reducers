# Exercises
### Update the following examples to use useReducer
#### 1
```
// Initial
const LightSwitch = () => {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <>
      Light is {isOn ? 'on' : 'off'}.
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
    </>
  );
};
```
```js
// Rewritten
function reducer(state, action) {
  switch (action.type) {
    case 'toggle-light': {
      return !state;
    }
    default:
      throw new Error('Unrecognized action');
  }
}
const LightSwitch = () => {
  const [state, dispatch] = React.useReducer(reducer, false);
  return (
    <>
      Light is {state ? 'on' : 'off'}.
      <button onClick={() => dispatch('toggle-light')}>Toggle</button>
    </>
  );
};
```
#### 2
```
// Initial
function App() {
  const [status, setStatus] = React.useState('idle');
  return (
    <form
      onSubmit={() => {
        setStatus('loading');
        getStatusFromServer()
          .then(() => {
            setStatus('idle');
          })
          .catch(() => {
            setStatus('error');
          });
      }}
    >
      Status is: {status}
      <button>Submit</button>
    </form>
  );
}
```
```js
// Rewritten
function reducer(state, action) {
  switch (action.type) {
    case 'request-data': {
      return 'loading';
    }
    case 'receive-data': {
      return 'idle';
    }
    case 'receive-error': {
      return 'error';
    }
    default:
      throw new Error('Unrecognized action');
  }
}
function App() {
  const [state, dispatch] = React.useReducer(reducer, 'idle');
  return (
    <form
      onSubmit={() => {
        dispatch('request-data');
        getStatusFromServer()
          .then(() => {
            dispatch('receive-data');
          })
          .catch(() => {
            dispatch('receive-error');
          });
      }}
    >
      Status is: {status}
      <button>Submit</button>
    </form>
  );
}
```
#### 3
```
// Initial
export const ModalContext = React.createContext(null);
export const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = React.useState(null);
  return (
    <ModalContext.Provider
      value={{
        currentModal,
        setCurrentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
```
```js
// Rewritten
export const ModalContext = React.createContext(null);
function reducer(state, action) {
  switch (action.type) {
    case 'open-modal': {
      return action.modal;
    }
    case 'close-modal': {
      return null;
    }
    default:
      throw new Error('Unrecognized action');
  }
}
export const ModalProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, null);
  const openModal = modal => dispatch({ type: 'open-modal', modal });
  const closeModal = modal => dispatch({ type: 'close-modal' });
  return (
    <ModalContext.Provider
      value={{
        currentModal: state,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
```
---
# Exercises
### Update these objects to use useReducer, with a single immutable object
#### 1
```
// Initial
const Game = () => {
  const [points, setPoints] = React.useState(0);
  const [status, setStatus] = React.useState('idle');
  return (
    <>
      Your score: {points}.
      {status === 'playing' && (
        <>
          <button onClick={() => setPoints(points + 1)}>
            🍓
          </button>
          <button onClick={() => setPoints(points - 1)}>
            💀
          </button>
        </>
      )}
      <button onClick={() => setStatus('playing')}>
        Start game
      </button>
    </>
  );
};
```
```js
// Rewritten
const initialState = {
  points: 0,
  status: 'idle',
};
function reducer(state, action) {
  switch (action.type) {
    case 'win-point': {
      return {
        ...state,
        points: state.points + 1,
      };
    }
    case 'lose-point': {
      return {
        ...state,
        points: state.points - 1,
      };
    }
    case 'start-game': {
      return {
        ...state,
        status: 'playing',
      };
    }
  }
}
const Game = () => {
  const [state, dispatch] = React.useState(initialState);
  return (
    <>
      Your score: {state.points}.
      {state.status === 'playing' && (
        <>
          <button onClick={() => dispatch({ type: 'win-point' })}>🍓</button>
          <button onClick={() => dispatch({ type: 'lose-point' })}>💀</button>
        </>
      )}
      <button onClick={() => dispatch({ type: 'start-game' })}>Start game</button>
    </>
  );
};
```
#### 2
```
// Initial
import sendDataToServer from './some-madeup-place';
import FormField from './some-other-madeup-place';
const SignUpForm = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <form onSubmit={sendDataToServer}>
      <FormField
        label="First Name"
        value={firstName}
        onChange={ev => setFirstName(ev.target.value)}
      />
      <FormField
        label="Last Name"
        value={lastName}
        onChange={ev => setLastName(ev.target.value)}
      />
      <FormField
        label="Email"
        value={email}
        onChange={ev => setEmail(ev.target.value)}
      />
      <button>Submit</button>
      <button
        onClick={(ev) => {
          ev.preventDefault();
          setFirstName('');
          setLastName('');
          setEmail('');
        }}
      >
        Reset
      </button>
    </form>
  );
};
```
```js
// Rewritten
import sendDataToServer from './some-madeup-place';
import FormField from './some-other-madeup-place';
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'update-field': {
      return {
        ...state,
        [action.key]: action.value,
      };
    }
    case 'reset-form': {
      return initialState;
    }
  }
}
const SignUpForm = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const updateField = (key, value) =>
    dispatch({ type: 'update-field', key, value });
  const resetForm = () => dispatch({ type: 'reset-form', key, value });
  return (
    <form onSubmit={sendDataToServer}>
      <FormField
        label="First Name"
        value={state.firstName}
        onChange={ev => updateField('firstName', ev.target.value)}
      />
      <FormField
        label="Last Name"
        value={state.lastName}
        onChange={ev => updateField('lastName', ev.target.value)}
      />
      <FormField
        label="Email"
        value={state.email}
        onChange={ev => updateField('email', ev.target.value)}
      />
      <button>Submit</button>
      <button
        onClick={ev => {
          ev.preventDefault();
          resetForm();
        }}
      >
        Reset
      </button>
    </form>
  );
};
```
---
# Exercises
### Finish writing the following context components with useReducer
---
#### 1
```
// Initial
export const StudentContext = React.createContext();
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = React.useState({
    aditya: false,
    bodhi: false,
    chetan: false,
  })
  // We need actions to:
  // - mark a student as "present" / "absent",
  // - add a student to the class.
  return (
    <StudentContext.Provider
      value={{ state }}
    >
      {children}
    </StudentContext.Provider>
  )
}
```
```js
// Relevant reducer
function reducer(state, action) {
  switch (action.type) {
    case 'mark-student-attendance': {
      return {
        ...state,
        [action.studentName]: action.isPresent,
      };
    }
    case 'add-student-to-class': {
      return {
        ...state,
        [action.studentName]: false,
      };
    }
    default:
      throw new Error('unrecognized action');
  }
}
```
---
#### 2
```
// Initial
export const DataContext = React.createContext();
export const DataProvider = ({ children }) => {
  const [status, setStatus] = React.useState({
    data: null,
    status: 'idle',
  })
  // We need actions to:
  // - start fetching data from the server
  // - receive data from the server
  // - receive an error from the server
  return (
    <DataContext.Provider
      value={{ state }}
    >
      {children}
    </DataContext.Provider>
  )
}
```
```js
// Relevant reducer
function reducer(state, action) {
  switch (action.type) {
    case 'request-data': {
      return {
        ...state,
        status: 'loading',
        errorMessage: null,
        data: null,
      };
    }
    case 'receive-data': {
      return {
        ...state,
        status: 'idle',
        errorMessage: null,
        data: action.data,
      };
    }
    case 'receive-error': {
      return {
        ...state,
        status: 'error',
        errorMessage: action.error,
        data: null,
      };
    }
    default:
      throw new Error('unrecognized action');
  }
}