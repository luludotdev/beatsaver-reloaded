import { Action, Dispatch } from 'redux'
import { IState } from '.'

declare global {
  type Thunk<T, P = any> = (
    dispatch: Dispatch<IAnyAction<T, P>>,
    getState: () => IState
  ) => void

  // tslint:disable-next-line: ban-types
  type ThunkFunction<F extends Function> = (
    ...args: F extends (...args: infer A) => any ? A : never
  ) => void

  interface IAnyAction<T, P = any> extends Action<T> {
    payload?: P
  }
}
