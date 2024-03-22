import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './ingreso-egreso.actions';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';
import { map } from 'rxjs';

export interface State {
  items: IngresosEgresos[];
}

export const initialState: State = {
  items: [],
};

export const _ingresoEgresoReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => {
    return { ...state, items: [...(items as IngresosEgresos[])] };
  }),
  on(unSetItems, (state) => ({ ...state, items: [] }))
);
