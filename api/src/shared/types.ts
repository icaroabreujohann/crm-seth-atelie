export type ResultadoBusca<T> =
  | { existe: true; data: T }
  | { existe: false; data: null }