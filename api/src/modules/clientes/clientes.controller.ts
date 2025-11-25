import {Request, Response} from 'express'
import { ClientesService } from '../clientes/clientes.services'

export class ClientesController {
     private service = new ClientesService

     async listarClientes(req: Request, res: Response) {

     }
}
