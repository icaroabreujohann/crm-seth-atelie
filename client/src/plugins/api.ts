import axios from 'axios'
import { usarFeedbackStore } from '@/stores/feedbacks.store'
import { pinia } from './pinia'

export const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     timeout: 15000,
})

const feedback = usarFeedbackStore(pinia)

api.interceptors.response.use(
     (response) => {
          return response
     },
     (error) => {
          const feedback = usarFeedbackStore(pinia)

          if (!error.response) {
               feedback.erro('Não foi possível conectar ao servidor.')
               return Promise.reject(error)
          }

          const data = error.response.data
          console.log(data)
          feedback.erro(data?.mensagem ?? 'Erro inesperado')
          return Promise.reject(error)
     }
)
