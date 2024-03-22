import { createAction, props } from '@ngrx/store';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';

export const setItems = createAction(
  '[Ingreso egreso] Set Items',
  props<{ items: IngresosEgresos[] }>()
);
export const unSetItems = createAction('[Ingreso egreso] Un Set Items');
