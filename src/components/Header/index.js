import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import './styles.css';

export const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className='sidebar'>
      <div>
        <img src={user.avatarUrl ? user.avatarUrl : avatar} alt='Foto Avatar'/>
      </div>

      <Link to='/dashboard'>
        <FiHome color='#fff' size={24}/>
        Chamados
      </Link>

      <Link to='/customers'>
        <FiUser color='#fff' size={24}/>
        Clientes
      </Link>

      <Link to='/profile'>
        <FiSettings color='#fff' size={24}/>
        Configurações
      </Link>
    </div>
 );
}
