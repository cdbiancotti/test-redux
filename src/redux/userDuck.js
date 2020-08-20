import { loginWithGoogle } from '../firebase';

// constanst
let initialData = {
  loggedIn: false,
  fetching: false,
};

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

// reducer
// export default const [state, dispatch] = useReducer(reducer, initialState, init)
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, fetching: true };
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload, fetching: false };
    case LOGIN_ERROR:
      return { ...state, error: action.payload, fetching: false };
    default:
      return state;
  }
}

// aux
const saveStorage = (storage) => {
  localStorage.storage = JSON.stringify(storage);
};

// action (action creator)
export const doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  return loginWithGoogle()
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { ...user },
      });
      saveStorage(getState());
    })
    .catch((e) => {
      console.log(e);
      dispatch({
        type: LOGIN_ERROR,
        payload: e.message,
      });
    });
};
