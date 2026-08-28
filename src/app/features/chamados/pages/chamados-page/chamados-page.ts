import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { FiltroChamados } from "../../components/filtro-chamados/filtro-chamados";
import { ListaChamados } from "../../components/lista-chamados/lista-chamados";
import { Chamado, Prioridade, StatusChamado } from "../../models/chamado";
import { ChamadosService } from "../../services/chamados.service";

@Component({
  selector: "app-chamados-page",
  standalone: true,
  imports: [
    FiltroChamados,
    ListaChamados,
    ReactiveFormsModule
  ],
  templateUrl: "./chamados-page.html",
  styleUrl: "./chamados-page.css",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChamadosPage implements OnInit {
  private readonly chamadosService =
    inject(ChamadosService);

  private readonly formBuilder =
    inject(FormBuilder);

  readonly formulario =
    this.formBuilder.nonNullable.group({
      titulo: ["", [Validators.required, Validators.maxLength(100)]],
      descricao: ["", [Validators.required, Validators.maxLength(500)]],
      prioridade: ["media" as Prioridade, Validators.required]
    });

  readonly chamados =
    signal<Chamado[]>([]);

  readonly pesquisa =
    signal("");

  readonly filtroStatus =
    signal<StatusChamado | "todos">("todos");

  readonly carregando =
    signal(false);

  readonly erro =
    signal<string | null>(null);

  readonly exibindoFormulario =
    signal(false);

  readonly criando =
    signal(false);

  readonly chamadosFiltrados =
    computed(() => {
      const termo =
        this.pesquisa().trim().toLowerCase();

      const status =
        this.filtroStatus();

      return this.chamados().filter(chamado => {
        const correspondeTexto =
          termo === "" ||
          chamado.titulo.toLowerCase().includes(termo) ||
          chamado.descricao.toLowerCase().includes(termo);

        const correspondeStatus =
          status === "todos" ||
          chamado.status === status;

        return correspondeTexto &&
          correspondeStatus;
      });
    });

  ngOnInit(): void {
    void this.carregarChamados();
  }

  async carregarChamados(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados =
        await this.chamadosService.listar();

      this.chamados.set(dados);
    } catch {
      this.erro.set(
        "Não foi possível carregar os chamados."
      );
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(
    valor: StatusChamado | "todos"
  ): void {
    this.filtroStatus.set(valor);
  }

  alternarFormulario(): void {
    this.exibindoFormulario.update(exibindo => !exibindo);
    this.erro.set(null);
  }

  async criarChamado(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.criando.set(true);
    this.erro.set(null);

    try {
      const chamado = await this.chamadosService.adicionar(
        this.formulario.value as Chamado
      );

      this.chamados.update(chamados => [chamado, ...chamados]);
      this.formulario.reset({
        titulo: "",
        descricao: "",
        prioridade: "media"
      });
      this.exibindoFormulario.set(false);
    } catch {
      this.erro.set("Não foi possível criar o chamado.");
    } finally {
      this.criando.set(false);
    }
  }
}
