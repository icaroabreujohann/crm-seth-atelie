export function normalizarTextoBusca(texto: string) {
     return texto
          .toLowerCase()
          .normalize('NFD')                 // remove acentos
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
}