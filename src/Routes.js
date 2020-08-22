import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/home/HomePage';
import FavPage from './components/favs/FavPage';
import LoginPage from './components/login/LoginPage';
import GraphHome from './components/home/GraphHome';

const PrivateRoute = ({ path, component, ...rest }) => {
  // TRY TO DO THIS WITH CONNECT INSTEAD OF LOCALSTORAGE
  let storage = localStorage.getItem('storage');
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    return <Route path={path} component={component} {...rest} />;
  } else {
    return <Redirect to='/login' {...rest} />;
  }
};

export default function Routes() {
  return (
    <Switch>
      {/* <PrivateRoute exact path='/' component={Home} /> */}
      <PrivateRoute exact path='/' component={GraphHome} />
      <PrivateRoute path='/favs' component={FavPage} />
      <Route path='/login' component={LoginPage} />
    </Switch>
  );
}
