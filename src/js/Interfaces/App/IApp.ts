import IParameters from '../IParameters';

export default interface IApp {
  update(data: IParameters): void;
}
