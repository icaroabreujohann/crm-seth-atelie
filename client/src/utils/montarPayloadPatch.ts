export function diferencaObjetos<T>(atual: T, original: T): Partial<T> {
     const resultado: Partial<T> = {}

     for (const chave in atual) {
          const valorAtual = (atual as any)[chave]
          const valorOriginal = (original as any)[chave]

          if (valorAtual && typeof valorAtual === 'object' && !Array.isArray(valorAtual)) {
               const patchAninhado = diferencaObjetos(valorAtual, valorOriginal || {})
               if (Object.keys(patchAninhado).length > 0) {
                    (resultado as any)[chave] = patchAninhado
               }
          } else if (Array.isArray(valorAtual)) {
               if (JSON.stringify(valorAtual) !== JSON.stringify(valorOriginal)) {
                    (resultado as any)[chave] = valorAtual
               }
          } else {
               if (valorAtual !== valorOriginal) {
                    (resultado as any)[chave] = valorAtual
               }
          }
     }

     return resultado
}

export function montarPayloadAlteracoes<T>(atual: T, original?: T): Partial<T> {
     if (!original) return { ...atual }
     return diferencaObjetos<T>(atual, original)
}
