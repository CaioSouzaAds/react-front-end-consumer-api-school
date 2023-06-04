import { React, useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmail, isInt, isFloat } from 'validator';
import history from '../../services/history';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

export default function Aluno({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', 0);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        // eslint-disable-next-line no-unused-vars
        const Foto = get(data, 'Fotos[0].url', '');

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
        // eslint-disable-next-line no-empty
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    // Lógica adicional para lidar com o envio do formulário
    if (nome === '') {
      toast.error('Por favor, preencha o nome.');
      formErrors = true;
    }
    if (nome.length < 3 || nome.length > 255) {
      toast.error('O nome deve ter entre 3 e 255 caracteres.');
      formErrors = true;
    }
    if (sobrenome === '') {
      toast.error('Por favor, preencha o sobrenome.');
      formErrors = true;
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
      toast.error('O sobrenome deve ter entre 3 e 255 caracteres.');
      formErrors = true;
    }
    if (!isEmail(email)) {
      toast.error('Por favor, preencha um email válido.');
      formErrors = true;
    }
    if (idade === '') {
      toast.error('Por favor, preencha a idade.');
      formErrors = true;
    }
    if (!isInt(String(idade), { min: 1 })) {
      toast.error('A idade deve ser um número inteiro positivo.');
      formErrors = true;
    }
    if (peso === '') {
      toast.error('Por favor, preencha o peso.');
      formErrors = true;
    }
    if (!isFloat(String(peso), { min: 0 })) {
      toast.error('O peso deve ser um número válido.');
      formErrors = true;
    }
    if (altura === '') {
      toast.error('Por favor, preencha a altura.');
      formErrors = true;
    }
    if (!isFloat(String(altura), { min: 0 })) {
      toast.error('A altura deve ser um número válido.');
      formErrors = true;
    }

    if (formErrors) {
      return;
    }

    try {
      setIsLoading(true);
      if (id) {
        const { data } = await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) editado(a) com sucesso!');
        history.push(`/aluno/${data.id}/edit`);
      } else {
        await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) criado(a) com sucesso!');
      }
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'erros', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido.');

        if (status === 401) dispatch(actions.loginFailure());
      }
    }

    // Limpe os campos do formulário após o envio
    // setNome('');
    // setSobrenome('');
    //setEmail('');
    //setIdade('');
    //setPeso('');
    //setAltura('');

    toast.success('Formulário enviado com sucesso!');
  };

  return (
    <Container>
      <Loading isLoading={isLoading}></Loading>
      <h1>{id ? 'Editar aluno' : 'Novo Aluno'}</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        <input
          type="text"
          step="0.01"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso"
        />
        <input
          type="text"
          step="0.01"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
