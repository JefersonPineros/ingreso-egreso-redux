import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/firestore';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresosEgresos: IngresosEgresos) {
    delete ingresosEgresos.uid;

    return this.fireStore
      .doc(`${this.authService.user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresosEgresos });
  }

  /**
   *
   * El map funciona para transformar lo que sea que yo quiera retornar
   *
   */
  initIngresosEgresosListener(uid: string) {
    return this.fireStore
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((snapShot) => {
          return snapShot.map((doc) => {
            //const data: any = doc.payload.doc.data();
            return {
              uid: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      );
  }

  borrarIngresoEgreso(uidItem?: string) {
    return this.fireStore
      .doc(`${this.authService.user.uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
