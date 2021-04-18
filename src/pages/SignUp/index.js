import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import logo from '../../assets/logo.png';

export const SignUp = () => {
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (ev) => {
    ev.preventDefault();

    signUp(name, email, password);
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo'/>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>

          <input value={name} onChange={(ev) => setName(ev.target.value)} type='text' placeholder='Seu Nome'/>
          <input value={email} onChange={(ev) => setEmail(ev.target.value)} type='email' placeholder='email@email.com'/>
          <input value={password} onChange={(ev) => setPassword(ev.target.value)} type='password' placeholder='******'/>

          <button type='submit'
          style={{cursor: loadingAuth ? 'wait' : null}}
          disabled={Boolean(
            name === ''
            || email === ''
            || password === ''
          )}>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>

        <Link to='/'>Já tenho uma conta</Link>
      </div>
    </div>
  );
}
