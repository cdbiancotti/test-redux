import { loginWithGoogle, logoutFromGoogle } from '../firebase';

// constanst
const initialData = {
  loggedIn: false,
  fetching: false,
};

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

// reducer
// export default const [state, dispatch] = useReducer(reducer, initialState, init)
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, fetching: true };
    case LOGOUT:
      return { ...initialData };
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload, fetching: false, loggedIn: true };
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
export const logoutSession = () => (dispatch, getState) => {
  logoutFromGoogle();
  dispatch({
    type: LOGOUT,
  });
  localStorage.removeItem('storage');
};

export const restoreSessionActon = () => (dispatch) => {
  let storage = localStorage.getItem('storage');
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user,
    });
  }
};

export const doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  return loginWithGoogle()
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL },
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
