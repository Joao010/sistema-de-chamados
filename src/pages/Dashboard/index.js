import React, { useEffect, useState } from 'react';
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import firebase from '../../database/firebaseConnection';

import './styles.css';
import { Header } from '../../components/Header';
import { Title } from '../../components/Title';
import { Modal } from '../../components/Modal';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export const Dashboard = () => {
  const [ chamados, setChamados ] = useState([]);
  const [ loadingMore, setLoadingMore ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ isEmpty, setIsEmpty ] = useState(false);
  const [ lastDocs, setLastDocs ] = useState();

  const [ showPostModal, setShowPostModal ] = useState(false);
  const [ detail, setDetail ] = useState();

  useEffect(() => {
    loadChamados();

    return () => {

    }
  }, []);

  const loadChamados = async() => {
    await listRef.limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot);
    })
    .catch((error) => {
      toast.error('Ops algo deu errado ao buscar os chamados');
      console.log(error);
    });

    setLoading(false);

  }

  const updateState = (snapshot) => {
    // verifica se a lista veio vazia
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach(doc => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // pegando o último documento buscado
      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc);

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  const handleMore = async() => {
    setLoadingMore(true);

    await listRef.startAfter(lastDocs)
    .get()
    .then((snapshot) => {
      updateState(snapshot);
    });
  }

  const togglePostModal = (chamado) => {
    setShowPostModal(!showPostModal);
    setDetail(chamado);
  }

  return (
    <div>
      <Header/>

      <div className='content'>
        <Title name='Atendimentos'>
          <FiMessageSquare size={25}/>
        </Title>

        {loading
        ? <div className='container dashboard' style={{cursor: 'wait'}}>
            <span>Buscando chamados...</span>
          </div>

        : !chamados.length
          ? <div className='container dashboard'>
              <span>Nenhum chamado registrado...</span>

              <Link to='/new' className='new'>
                <FiPlus size={25} color='#fff'/>
                Novo Chamado
              </Link>
            </div>

          : <>
              <Link to='/new' className='new'>
                <FiPlus size={25} color='#fff'/>
                Novo Chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Assuntos</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Cadastrado em</th>
                    <th scope='col'>#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((chamado, index) =>
                    <tr key={index}>
                      <td data-label='Cliente'>{chamado.cliente}</td>
                      <td data-label='Assunto'>{chamado.assunto}</td>
                      <td data-label='Status'>
                        <span className='badge' style={{background: chamado.status === 'Aberto' ? '#56b85c' : '#999'}}>
                          {chamado.status}
                        </span>
                      </td>
                      <td data-label='Cadastrado'>{chamado.createdFormated}</td>
                      <td data-label='#'>
                        <button className='action' style={{background: '#3583f6'}} onClick={() => togglePostModal(chamado)}>
                          <FiSearch color='#fff' size={17}/>
                        </button>

                        <Link className='action' style={{background: '#f6a935'}} to={`/new/${ chamado.id }`}>
                          <FiEdit2 color='#fff' size={17}/>
                        </Link>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

              { loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3> }
              { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button> }
            </>
        }
      </div>

      {showPostModal
      && <Modal
      conteudo={detail}
      close={togglePostModal}
      />
      }
    </div>
  );
}
