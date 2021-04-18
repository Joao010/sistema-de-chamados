import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import firebase from '../database/firebaseConnection';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const [ loadingAuth, setLoadingAuth ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const loadStorage = () => {
      const storageUser = localStorage.getItem('SistemaUser');

      if(storageUser) {
        setUser(JSON.parse(storageUser));
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  const signUp = async(name, email, password) => {
    setLoadingAuth(true);
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(async(ev) => {
      let uid = ev.user.uid;

      await firebase.firestore().collection('users').doc(uid).set({
        name,
        avatarUrl: null,
      })
      .then(() => {
        let data = {
          uid,
          name,
          email: ev.user.email,
          avatarUrl: null,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem Vindo a plataforma!');
      });

    })
    .catch((error) => {
      console.log(error);
      toast.error('Ops algo deu errado!');
      setLoadingAuth(false);
    });

  }

  const storageUser = async(data) => {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  const signIn = async(email, password) => {
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then( async(ev) => {
      let uid = ev.user.uid;

      const userProfile = await firebase.firestore().collection('users').doc(uid).get();

      let data = {
        uid,
        name: userProfile.data().name,
        avatarUrl: userProfile.data().avatarUrl,
        email: ev.user.email,
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success('Bem Vindo a plataforma!');
    })
    .catch((error) => {
      if(error.code === 'auth/wrong-password') toast.error('Email ou senha incorretos');
      else toast.error('Ops algo deu errado!');
      console.log(error);
      setLoadingAuth(false);
    });

  }

  const signOut = async() => {
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      signed: Boolean(user),
      user,
      setUser,
      storageUser,
      loading,
      loadingAuth,
      signUp,
      signOut,
      signIn,
    }}>
      { children }
    </AuthContext.Provider>
  );
}
