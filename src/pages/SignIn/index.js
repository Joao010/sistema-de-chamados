import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import logo from '../../assets/logo.png';
import './styles.css';

export const SignIn = () => {
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = async(ev) => {
    ev.preventDefault();

    await signIn(email, password);
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo'/>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>

          <input value={email} onChange={(ev) => setEmail(ev.target.value)} type='email' placeholder='email@email.com'/>
          <input value={password} onChange={(ev) => setPassword(ev.target.value)} type='password' placeholder='******'/>

          <button type='submit'
          style={{cursor: loadingAuth ? 'wait' : null}}
          disabled={Boolean(
            email === ''
            || password === ''
          )}>{loadingAuth ? 'Carregando...' : 'Entrar'}</button>
        </form>

        <Link to='/register'>Criar uma conta</Link>
      </div>
    </div>
  );
}
