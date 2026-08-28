import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import {
  Injectable,
  inject
} from "@angular/core";
import {
  firstValueFrom
} from "rxjs";
import {
  Chamado,
  NovoChamado
} from "../models/chamado";
@Injectable({
  providedIn: "root"
})
export class ChamadosService {
  private readonly http =
    inject(HttpClient);
  private readonly apiUrl =
    "http://localhost:3000/api/chamados";
  // métodos serão adicionados aqui
  listar(): Promise<Chamado[]> {
    return firstValueFrom(
      this.http.get<Chamado[]>(
        this.apiUrl
      )
    );
  }
  adicionar(
    chamado: NovoChamado
  ): Promise<Chamado> {
    return firstValueFrom(
      this.http.post<Chamado>(
        this.apiUrl,
        chamado
      )
    );
  }
  async buscarPorId(
    id: number
  ): Promise<Chamado | undefined> {
    try {
      return await firstValueFrom(
        this.http.get<Chamado>(
          `${this.apiUrl}/${id}`
        )
      );
    } catch (erro) {
      if (
        erro instanceof HttpErrorResponse && erro.status === 404
      ) {
        return undefined;
      }
      throw erro;
    }
  }
}