import { Injectable } from '@angular/core';
import { CreateUserInt } from '../model/users/createUser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../model/users/usuarioModel';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgreso from '../ingreso-egreso/ingreso-egreso.actions';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userUnSubscribe: Subscription | undefined;
  private _user: Usuario | undefined;

  get user() {
    return { ...this._user };
  }

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe({
      next: (fuser) => {
        if (fuser) {
          this.userUnSubscribe = this.firestore
            .doc(`${fuser.uid}/usuario`)
            .valueChanges()
            .subscribe({
              next: (fireStoreUser) => {
                const user = Usuario.fromFireStore(fireStoreUser);
                this._user = user;
                this.store.dispatch(authActions.setUser({ user: user }));
              },
              error: (err) => {
                this.store.dispatch(authActions.unSetUser());
                this.store.dispatch(ingresoEgreso.unSetItems());
              },
            });
        } else {
          this.store.dispatch(authActions.unSetUser());
          this.store.dispatch(ingresoEgreso.unSetItems());
          this.userUnSubscribe?.unsubscribe();
          this._user = undefined;
        }
      },
      error: (error) => {
        this._user = undefined;
        this.userUnSubscribe?.unsubscribe();
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
