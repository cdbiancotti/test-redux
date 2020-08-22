import React from 'react';
import styles from './favs.module.css';
import Card from '../card/Card';
import { connect } from 'react-redux';

const FavPage = ({ favs }) => {
  return (
    <div className={styles.container}>
      <h2>Favoritos</h2>
      {favs.map((char) => (
        <Card key={char} hideRight={true} {...char} />
      ))}
      {!favs.length && <h3>No hay personajes agregados</h3>}
    </div>
  );
};

const mapState = ({ characters }) => {
  return { favs: characters.favorites };
};

export default connect(mapState)(FavPage);
