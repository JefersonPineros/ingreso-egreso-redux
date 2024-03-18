export class Usuario {
  static fromFireStore({ email, nombre, uid }: any) {
    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}
