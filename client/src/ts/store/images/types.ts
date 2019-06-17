export enum ImagesActionTypes {
  SET_IMAGE = '@@images/SET_IMAGE',
  RESET_IMAGE = '@@images/RESET_IMAGE',
}

export interface IImagesState {
  [key: string]: boolean | undefined
}
