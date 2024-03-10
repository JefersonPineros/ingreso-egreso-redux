import { Injectable } from '@angular/core';
import { CreateUserInt } from '../model/users/createUser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../model/users/usuarioModel';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe({
      next: (fuser) => {
        console.log(fuser);
        console.log(fuser?.uid);
        console.log(fuser?.email);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * La des estructuración funciona para, de un objeto
   * capturar unicamente los atributos que me interezan
   *
   *  son los 3 puntos {...}
   */
  crearUsuario(userC: CreateUserInt) {
    return this.afAuth
      .createUserWithEmailAndPassword(userC.correo, userC.password)
      .then(({ user }) => {
        const newUser = new Usuario(
          user!.uid,
          userC.nombre,
          user!.email ? user!.email : ''
        );
        return this.firestore.doc(`${user?.uid}/usuario`).set({ ...newUser });
      });
  }

  loginUsuario(user: CreateUserInt) {
    return this.afAuth.signInWithEmailAndPassword(user.correo, user.password);
  }

  logOut() {
    return this.afAuth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map((fbUser) => {
        return fbUser !== null;
      })
    );
  }
}
