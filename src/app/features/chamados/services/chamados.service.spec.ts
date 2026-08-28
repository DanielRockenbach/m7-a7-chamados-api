import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { ChamadosService } from "./chamados.service";

describe("ChamadosService", () => {
  let service: ChamadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamadosService);
  });

  it("deve listar os chamados", async () => {
    const chamados = await service.listar();
    expect(chamados).toHaveLength(3);
  });

  it("deve buscar um chamado por id", async () => {
    const chamado = await service.buscarPorId(1);

    expect(chamado?.titulo)
      .toBe("Erro ao acessar sistema");
  });

  it("deve criar um chamado e disponibiliza-lo na listagem", async () => {
    const criado = await service.adicionar({
      titulo: "Acesso ao sistema lento",
      descricao: "O sistema demora para carregar.",
      prioridade: "alta"
    });

    const chamados = await service.listar();

    expect(criado).toMatchObject({
      id: 4,
      status: "aberto"
    });
    expect(chamados).toContainEqual(criado);
  });
});
