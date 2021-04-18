import React, { useContext, useState } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';

import firebase from '../../database/firebaseConnection';

import avatar from '../../assets/avatar.png';
import './styles.css';
import { AuthContext } from '../../contexts/auth';
import { Title } from '../../components/Title';
import { Header } from '../../components/Header';

export const Profile = () => {
  const { user, signOut, setUser, storageUser } = useContext(AuthContext);

  const [ name, setName ] = useState(user && user.name);
  const [ email, setEmail ] = useState(user && user.email);
  const [ password, setPassword ] = useState(user && user.password);
  const [ avatarUrl, setAvatarUrl ] = useState(user && user.avatarUrl);
  const [ imageAvatar, setImageAvatar ] = useState(null);

  const handleFile = (ev) => {
    if(ev.target.files[0]) {
      const image = ev.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert('Envie uma imagem do tipo PNG ou JPEG');
        setImageAvatar(null);
        return null;
      }
    }
  }

  const handleUpload = async() => {
    const currentUid = user.uid;

    const uploadTask = await firebase.storage()
    .ref(`images/${ currentUid }/${ imageAvatar.name }`)
    .put(imageAvatar)
    .then( async() =>
    {
      console.log('Foto enviada com sucesso!');
      await firebase.storage().ref(`images/${ currentUid }`)
      .child(imageAvatar.name).getDownloadURL()
      .then( async(url) =>
      {
        let urlFoto = url;

        await firebase.firestore().collection('users')
        .doc(user.uid)
        .update({
          avatarUrl: urlFoto,
        })
        .then(() =>
        {
          let data = {
            ...user,
            avatarUrl: urlFoto,
            name,
          };

          setUser(data);
          storageUser(data);
        });
      });
    });
  }

  const handleSave = async(ev) => {
    ev.preventDefault();

    if(!imageAvatar && name !== '') {
      await firebase.firestore().collection('users').doc(user.uid).update({
        name,
      })
      .then(() => {
        let data = {
          ...user,
          name: name,
        }

        setUser(data);
        storageUser(data);
      });
    }

    if(name !== '' && imageAvatar) {
      handleUpload();
    }
  }

  return (
    <div>
      <Header/>

      <div className='content'>
        <Title name='Meu Perfil'>
          <FiSettings size={25}/>
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleSave}>
            <label className='label-avatar'>
              <span>
                <FiUpload color='#fff' size={25}/>
              </span>

              <input type='file' accept='image/*' onChange={handleFile}/><br/>
              {avatarUrl === null
              ? <img src={avatar} width='250' height='250' alt='Foto de perfil do usuário'/>
              : <img src={avatarUrl} width='250' alt='Foto do perfil do usuário'/>
              }
            </label>

            <label>Nome</label>
            <input type='text' value={name} onChange={(ev) => setName(ev.target.value)}/>

            <label>Email</label>
            <input type='email' value={email} onChange={(ev) => setEmail(ev.target.value)}/>

            <button type='submit'>Salvar</button>
          </form>
        </div>

        <div className='container' onClick={() => signOut()}>
          <button className='logout-btn'>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
