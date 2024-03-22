export class IngresosEgresos {
  constructor(
    public descripcion: string,
    public monto: number,
    public tipo: string,
    public uid?: string
  ) {}
}
