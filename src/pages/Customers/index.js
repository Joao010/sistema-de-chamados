import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

import firebase from '../../database/firebaseConnection';

import './styles.css';
import { Header } from '../../components/Header';
import { Title } from '../../components/Title';

export const Customers = () => {
  const [ nomeFantasia, setNomeFantasia ] = useState('');
  const [ cnpj, setCnpj ] = useState('');
  const [ endereco, setEndereco ] = useState('');

  const handleAdd = async(ev) => {
    ev.preventDefault();

    if(nomeFantasia !== ''
    && cnpj !== ''
    && endereco !== '')
    {
      await firebase.firestore().collection('customers')
      .add({
        nomeFantasia,
        cnpj,
        endereco,
      })
      .then(() => {
        setNomeFantasia('');
        setCnpj('');
        setEndereco('');
        toast.info('Empresa cadastrada com sucesso!');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Erro ao cadastrar essa empresa.');
      });
    } else {
      toast.error('Preencha todos os campos!');
    }
  }

  return (
    <div>
      <Header/>

      <div className='content'>
        <Title name='Clientes'>
          <FiUser size={25}/>
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleAdd}>
            <label>Nome</label>
            <input value={nomeFantasia} onChange={(ev) => setNomeFantasia(ev.target.value)}
            placeholder='Nome da sua empresa'/>

            <label>CNPJ</label>
            <input value={cnpj} onChange={(ev) => setCnpj(ev.target.value)}
            placeholder='Seu CNPJ'/>

            <label>Endereço</label>
            <input value={endereco} onChange={(ev) => setEndereco(ev.target.value)}
            placeholder='Endereço da empresa'/>

            <button type='submit'>Cadastrar</button>
          </form>
        </div>

      </div>
    </div>
  );
}
