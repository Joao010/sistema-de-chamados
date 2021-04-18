import React, { useContext, useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router';

import firebase from '../../database/firebaseConnection';

import './styles.css';
import { AuthContext } from '../../contexts/auth';
import { Header } from '../../components/Header';
import { Title } from '../../components/Title';

export const New__Edit = () => {
  const { id } = useParams();
  const  history = useHistory();

  const { user } = useContext(AuthContext);

  const [ loadCustomers, setLoadCustomers ] = useState(true);
  const [ customers, setCustomers ] = useState([]);
  const [ customersSelected, setCustomersSelected ] = useState(0);
  const [ idCustomer, setIdCustomer ] = useState(false);

  const [ assunto, setAssunto ] = useState('Suporte');
  const [ status, setStatus ] = useState('Aberto');
  const [ complemento, setComplemento ] = useState('');

  useEffect(() => {
    const loadCustomers = async() => {
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          });
        });

        if(!lista.length) {
          toast.error('Nenhuma empresa encontrada');
          setCustomers([ {id:'1', nomeFantasia: 'freela'} ]);
          setLoadCustomers(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomers(false);

        // se estiver querendo editar
        if(id) {
          loadId(lista);
        }

      })
      .catch((error) => {
        toast.error('Ops algo deu errado');
        console.log(error);

        setLoadCustomers(false);
        setCustomers([ {id: 1, nomeFantasia: ''}]);
      })
    }

    loadCustomers();
  }, []);

  const handleRegister = async(ev) => {
    console.log(assunto);
    ev.preventDefault();

    if(idCustomer) {
      await firebase.firestore().collection('chamados').doc(id)
      .update({
        cliente: customers[customersSelected].nomeFantasia,
        clienteId: customers[customersSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userUid: user.uid,
      })
      .then(() => {
        toast.info('Editado com sucesso!');
        setCustomersSelected(0)
        setComplemento('');
        history.push('/dashboard');
      })
      .catch((error) => {
        toast.error('Ops erro ao editar tente mais tarde');
        console.log(error);
      });

      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customersSelected].nomeFantasia,
      clienteId: customers[customersSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userUid: user.uid,
    })
    .then(() => {
      toast.success('Chamado criado com sucesso');
      setComplemento('');
      setAssunto('');
      setCustomersSelected(0);
    })
    .catch((error) => {
      toast.error('Ops erro ao registrar, tente mais tarde');
      console.log(error);
    })
  }

  const loadId = async(lista) => {
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
      setCustomersSelected(index);
      setIdCustomer(true);
    })
    .catch((error) => {
      toast.error('Erro no Id passado');
      console.log(error);
      setIdCustomer(false);
    });
  }

  const handleChangeOption = (ev) => setStatus(ev.target.value);

  return (
    <div>
      <Header/>

      <div className='content'>
        <Title name='Novo Chamado'>
          <FiPlusCircle size={25}/>
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>
            <label>Cliente</label>

            {loadCustomers
            ? <input type='text' disabled={true} value='Carregando clientes...' style={{cursor: 'wait'}}/>
            : <select
              value={customersSelected}
              onChange={(ev) => setCustomersSelected(ev.target.value)}>
                {customers.map((item, index) =>
                  <option key={item.id} value={index}>
                    {item.nomeFantasia}
                  </option>
                )}
              </select>
            }

            <label>Assunto</label>
            <select value={assunto} onChange={(ev) => setAssunto(ev.target.value)}>
              <option value='Suporte'>Suporte</option>
              <option value='Visita Tecnica'>Visita Técnica</option>
              <option value='Financeiro'>Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input
              type='radio'
              name='radio'
              value='Aberto'
              onChange={handleChangeOption}
              checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input
              type='radio'
              name='radio'
              value='Progresso'
              onChange={handleChangeOption}
              checked={status === 'Progresso'}
              />
              <span>Progresso</span>

              <input
              type='radio'
              name='radio'
              value='Atendido'
              onChange={handleChangeOption}
              checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
            type='text'
            placeholder='Decreva seu problema (opcional)'
            value={complemento}
            onChange={(ev) => setComplemento(ev.target.value)}
            />

            <button type='submit'>Registrar</button>
          </form>
        </div>
      </div>
    </div>
 );
}
