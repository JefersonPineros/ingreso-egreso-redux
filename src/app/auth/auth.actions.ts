import { createAction, props } from '@ngrx/store';
import { Usuario } from '../model/users/usuarioModel';

export const setUser = createAction(
  '[Auth] Set user',
  props<{ user: Usuario }>()
);

export const unSetUser = createAction('[Auth] Un set user');
