import axios from 'axios';
import { updateDB, getFavs } from '../firebase';

// constants
const initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
};

const URL = 'https://rickandmortyapi.com/api/character';

const GET_CHARACTERS = 'GET_CHARACTERS';
const GET_CHARACTERS_SUCCESS = 'GET_CHARACTERS_SUCCESS';
const GET_CHARACTERS_ERROR = 'GET_CHARACTERS_ERROR';

const REMOVE_CHARACTER = 'REMOVE_CHARACTER';
const CHAR_TO_FAVORITES = 'CHAR_TO_FAVORITES';

const GET_FAVS = 'GET_FAVS';
const GET_FAVS_SUCCESS = 'GET_FAVS_SUCCESS';
const GET_FAVS_ERROR = 'GET_FAVS_ERROR';

// TODO: must compare this methods with the methods used in the course
// const dispatch = useDispatch(function)
// const [state, dispatch] = useReducer(reducer, initialState, init)

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_CHARACTERS:
      return { ...state, fetching: true };
    case GET_CHARACTERS_SUCCESS:
      return { ...state, array: action.payload, fetching: false };
    case GET_CHARACTERS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case GET_FAVS:
      return { ...state, fetching: true };
    case GET_FAVS_SUCCESS:
      return { ...state, favorites: action.payload, fetching: false };
    case GET_FAVS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case REMOVE_CHARACTER:
      return { ...state, array: action.payload };
    case CHAR_TO_FAVORITES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// actions (thunk)
export const retreiveFavs = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVS,
  });
  const { uid } = getState().user;
  return getFavs(uid)
    .then((array) => {
      dispatch({ type: GET_FAVS_SUCCESS, payload: [...array] });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: GET_FAVS_ERROR, payload: err.message });
    });
};

export const addToFavoriteAction = () => (dispatch, getState) => {
  let { array, favorites } = getState().characters;
  let { uid } = getState().user;
  let char = array.shift();
  favorites.push(char);
  updateDB(favorites, uid);
  dispatch({
    type: CHAR_TO_FAVORITES,
    payload: { array: [...array], favorites: [...favorites] },
  });
};

export const removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;
  array.shift();
  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array],
  });
};

export const getCharactersAction = () => (dispatch, getState) => {
  dispatch({
    type: GET_CHARACTERS,
  });
  return axios
    .get(URL)
    .then((res) =>
      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: res.data.results,
      })
    )
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_CHARACTERS_ERROR,
        payload: err.response.message,
      });
    });
};
