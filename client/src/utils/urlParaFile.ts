export async function urlParaFile(url: string, nome: string) {
     const res = await fetch(url)
     const blob = await res.blob()
     return new File([blob], nome, { type: blob.type })
}