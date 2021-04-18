import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

const RouterWrapper = ({
  component: Component,
  isPrivate, /* is the route private? */
  ...rest
}) => {
  const { signed, loading } = useContext(AuthContext);

  return (
    loading ? <div></div>
    : (!signed && isPrivate) ? <Redirect to='/'/>
    : (signed && !isPrivate) ? <Redirect to='/dashboard'/>
    : <Route
        {...rest}
        render={ props => (
          <Component {...props}/>
        )}
      />
  );
}

export default RouterWrapper;
