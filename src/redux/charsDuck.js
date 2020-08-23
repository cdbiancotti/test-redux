// import axios from 'axios';
import { updateDB, getFavs } from '../firebase';
import ApolloClient, { gql } from 'apollo-boost';

// constants
const initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 1,
};

// const URL = 'https://rickandmortyapi.com/api/character';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
});

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
      return { ...state, ...action.payload, fetching: false };
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
  if (!array.length) {
    getCharactersAction()(dispatch, getState);
  } else {
    dispatch({
      type: REMOVE_CHARACTER,
      payload: [...array],
    });
  }
};

export const getCharactersAction = () => (dispatch, getState) => {
  let query = gql`
    query($page: Int) {
      characters(page: $page) {
        info {
          pages
          next
          prev
        }
        results {
          name
          image
        }
      }
    }
  `;
  dispatch({
    type: GET_CHARACTERS,
  });
  let nextPage = getState().characters.nextPage;
  return client
    .query({
      query,
      variables: { page: nextPage },
    })
    .then(({ data, error }) => {
      console.log(error);
      console.log(data);
      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: {
          array: [...data.characters.results],
          nextPage: data.characters.info.next ? data.characters.info.next : 1,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_CHARACTERS_ERROR,
        payload: err.message,
      });
    });

  // return axios
  //   .get(URL)
  //   .then((res) =>
  //     dispatch({
  //       type: GET_CHARACTERS_SUCCESS,
  //       payload: res.data.results,
  //     })
  //   )
  //   .catch((err) => {
  //     console.log(err);
  //     dispatch({
  //       type: GET_CHARACTERS_ERROR,
  //       payload: err.response.message,
  //     });
  //   });
};
