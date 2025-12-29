import { ErroCustomizado } from "../../types/erro.customizado";
import { CODIGOS_ERRO } from "../respostas/codigos-resposta";

export function converteMinutosParaHoras(minutosTotais: number) {
     if(!Number.isInteger(minutosTotais) || minutosTotais < 0){
          throw new ErroCustomizado(CODIGOS_ERRO.MINUTOS_INVALIDOS, minutosTotais, 400)
     }

     const horas = Math.floor(minutosTotais / 60)
     const minutos = minutosTotais % 60

     return { horas, minutos}
}

export function converteHorasParaMinutos(horas: number, minutos: number){
     if(!Number.isInteger(horas) || horas < 0){
          throw new ErroCustomizado(CODIGOS_ERRO.HORAS_INVALIDAS, horas, 400)
     }

     if(!Number.isInteger(minutos) || minutos < 0 || minutos > 59){
          throw new ErroCustomizado(CODIGOS_ERRO.MINUTOS_INVALIDOS, minutos, 400)
     }

     return horas * 60 + minutos
}