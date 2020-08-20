import React from 'react';
import styles from './login.module.css';
import { connect } from 'react-redux';
import { doGoogleLoginAction, logoutSession } from '../../redux/userDuck';

const LoginPage = ({ loggedIn, fetching, logoutSession, doGoogleLoginAction }) => {
  const doLogin = () => {
    doGoogleLoginAction();
  };
  const doLogout = () => {
    logoutSession();
  };

  if (fetching) return <h2>Cargando...</h2>;

  return (
    <div className={styles.container}>
      {!loggedIn ? (
        <>
          <h1>Inicia Sesión con Google</h1>
          <button onClick={doLogin}>Iniciar</button>
        </>
      ) : (
        <>
          <h1>Cierra tu sesión</h1>
          <button onClick={doLogout}>Cerrar Sesión</button>
        </>
      )}
    </div>
  );
};

const mapState = ({ user: { fetching, loggedIn } }) => ({
  fetching,
  loggedIn,
});

export default connect(mapState, { logoutSession, doGoogleLoginAction })(LoginPage);
