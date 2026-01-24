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

export function formatarDataBR(isoDate: string) {
  return new Date(isoDate).toISOString().split('T')[0]
}

export function formatarDataDDMMYYYY(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
