export interface RespostaApi<T> {
  sucesso: boolean
  mensagem: string
  codigo: number
  data: T
  definidoPeloSistema?: boolean
}