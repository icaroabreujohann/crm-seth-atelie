export function formatarDataHoraBR(data: string | Date) {
    if (!data) return ''

    const date = new Date(data)

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
}