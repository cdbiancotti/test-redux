import React, { useState, useEffect } from 'react';
import Card from '../card/Card';
import styles from './home.module.css';
import { connect } from 'react-redux';
import { removeCharacterAction, addToFavoriteAction } from '../../redux/charsDuck';

// let URL = "https://rickandmortyapi.com/api"

const Home = ({ chars, removeCharacterAction, addToFavoriteAction }) => {
  // let [chars, setChars] = useState([])

  // useEffect(() => {
  //     getCharacters()
  // }, [])

  // function nextChar() {
  //     chars.shift()
  //     if (!chars.length) {
  //         //get more characters
  //     }
  //     setChars([...chars])
  // }

  const nextChar = () => {
    removeCharacterAction();
  };
  const addFav = () => {
    addToFavoriteAction();
  };

  function renderCharacter() {
    let char = chars[0];
    return (
      // <Card leftClick={nextChar} {...char} />
      <Card leftClick={nextChar} rightClick={addFav} {...char} />
    );
  }

  // function getCharacters() {
  //     return axios.get(`${URL}/character`)
  //         .then(res => {
  //             setChars(res.data.results)
  //         })
  // }

  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>{renderCharacter()}</div>
    </div>
  );
};

const mapState = (state) => {
  return {
    chars: state.characters.array,
  };
};

export default connect(mapState, { removeCharacterAction, addToFavoriteAction })(Home);
