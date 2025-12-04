export function resultadoInexistente<T>() {
  return {
    existe: false,
    data: null
  } as const
}

export function resultadoEncontrado<T>(data: T) {
  return {
    existe: true,
    data
  } as const
}