export type Prioridade = "baixa" | "media" | "alta";

export type StatusChamado =
  "aberto" | "em_andamento" | "concluido";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  responsavel?: string;
  criadoEm: string;
}

export type NovoChamado = Pick<
  Chamado,
  "titulo" | "descricao" | "prioridade"
>;
