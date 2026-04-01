import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

interface Estudo {
  id: string;
  materia: string;
  nivelDificuldade: string;
  qualDificuldade: string;
  dataRevisao: string;
  entendimento: string;
}

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [materia, setMateria] = useState('');
  const [nivel, setNivel] = useState('Médio');
  const [qualDificuldade, setQualDificuldade] = useState('');
  const [dataRevisao, setDataRevisao] = useState('');
  const [entendimento, setEntendimento] = useState('');
  const [estudos, setEstudos] = useState<Estudo[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      try {
        const { data: users } = await api.get(`/users?username=${username}`);
        if (users.length > 0) {
          alert("Este usuário já existe!");
          return;
        }
        await api.post('/users', { username, password });
        alert("Conta criada com sucesso! Agora faça login.");
        setIsRegistering(false);
      } catch (error) {
        alert("Erro ao cadastrar.");
      }
    } else {
      try {
        const { data: users } = await api.get(`/users?username=${username}`);
        if (users.length > 0 && users[0].password === password) {
          setIsLoggedIn(true);
        } else {
          alert("Usuário ou senha incorretos!");
        }
      } catch (error) {
        alert("Erro no login.");
      }
    }
  };

  const buscarEstudos = async () => {
    try {
      const resposta = await api.get('/estudos');
      setEstudos(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm("Deseja remover este estudo?")) {
      try {
        await api.delete(`/estudos/${id}`);
        buscarEstudos();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const novoEstudo = {
      id: Date.now().toString(),
      materia,
      nivelDificuldade: nivel,
      qualDificuldade,
      dataRevisao,
      entendimento,
    };

    try {
      await api.post('/estudos', novoEstudo);
      setMateria('');
      setQualDificuldade('');
      setDataRevisao('');
      setEntendimento('');
      buscarEstudos();
    } catch (error) {
      alert('Erro ao salvar.');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      buscarEstudos();
    }
  }, [isLoggedIn]);

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="glass-card" style={{ maxWidth: '400px', margin: '100px auto', padding: '30px' }}>
          <h1>🧠 Lembrei!</h1>
          <h2>{isRegistering ? '🔐 Cadastro' : '🔐 Login'}</h2>
          <p>{isRegistering ? 'Crie sua conta' : 'Acesse suas revisões'}</p>
          <form onSubmit={handleSubmit} className="form-aesthetic">
            <div className="input-group">
              <label htmlFor="username">Usuário</label>
              <input 
                id="username"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Digite seu usuário"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="Digite sua senha"
              />
            </div>
            <button type="submit">{isRegistering ? 'Cadastrar' : 'Entrar'}</button>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
              {isRegistering ? 'Já tem conta?' : 'Não tem conta? '}
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#007bff', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                {isRegistering ? 'Fazer Login' : 'Cadastre-se aqui'}
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div className="dashboard-wrapper">
          <header className="glass-card" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>🧠 Lembrei!</h1>
              <p>Bem-vindo, {username}!</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} style={{ background: '#eee', color: '#333', padding: '5px 15px' }}>Sair</button>
          </header>
          <p>Vença o esquecimento organizando seus estudos.</p>

          <div className="glass-card">
            <h2>✨ Nova Revisão</h2>
            <form onSubmit={handleSalvar} className="form-aesthetic">
              <div className="input-group">
                <label htmlFor="materia">Matéria</label>
                <input 
                  id="materia"
                  value={materia} 
                  onChange={(e) => setMateria(e.target.value)} 
                  required 
                  placeholder="Ex: React Router"
                />
              </div>

              <div className="input-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label htmlFor="nivel">Nível</label>
                  <select 
                    id="nivel" 
                    value={nivel} 
                    onChange={(e) => setNivel(e.target.value)} 
                    required
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                <div className="input-group" style={{ flex: 2 }}>
                  <label htmlFor="data">Data</label>
                  <input 
                    id="data" 
                    type="date" 
                    value={dataRevisao} 
                    onChange={(e) => setDataRevisao(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="qualDificuldade">Qual dificuldade?</label>
                <input 
                  id="qualDificuldade"
                  value={qualDificuldade} 
                  onChange={(e) => setQualDificuldade(e.target.value)} 
                  required 
                  placeholder="Ex: Conceitos de Hooks"
                />
              </div>

              <div className="input-group">
                <label htmlFor="entendimento">Entendimento</label>
                <textarea 
                  id="entendimento"
                  value={entendimento} 
                  onChange={(e) => setEntendimento(e.target.value)} 
                  required 
                  placeholder="Descreva o que aprendeu..."
                  rows={4}
                />
              </div>

              <button type="submit">Salvar Revisão</button>
            </form>
          </div>

          <div className="glass-card" style={{ marginTop: '30px' }}>
            <h2>📚 Seus Estudos</h2>
            <div className="grid-estudos">
              {estudos.map((estudo) => (
                <div key={estudo.id} className="card-estudo">
                  <div className={`tag-dificuldade ${estudo.nivelDificuldade.toLowerCase()}`}>
                    {estudo.nivelDificuldade}
                  </div>
                  <h3>{estudo.materia}</h3>
                  <div className="card-body">
                    <p><strong>Desafio:</strong> {estudo.qualDificuldade}</p>
                    <p><strong>Entendimento:</strong> {estudo.entendimento}</p>
                  </div>
                  <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>📅 {estudo.dataRevisao}</span>
                    <button 
                      onClick={() => handleExcluir(estudo.id)}
                      style={{ 
                        background: '#ffefef',
                        border: '1px solid #ffcccc',
                        borderRadius: '8px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        color: '#ff4d4f',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      title="Excluir"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      )}
    </div>
  );
}

