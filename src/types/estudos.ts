export interface IEstudo {
  id: string;
  materia: string;
  nivelDificuldade: 'Baixo' | 'Médio' | 'Alto';
  qualDificuldade: string;
  dataRevisao: string;
  entendimento: string;
}