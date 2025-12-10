export function normalizaTexto(valor?: string | null): string | null{
     if(!valor) return null

     const texto = valor.trim()
     return texto === '' ? null : texto
}

export function normalizaUndefined<T>(v: T | null | undefined): T | null {
    return v ?? null
}