import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import IParameters from '../IParameters';

export default class Presenter {
  private model: Model;
  private view: SliderView;

  constructor(model: Model, view: SliderView) {
    this.model = model;
    this.view = view;

    this.view.subscribe('moveRunner', this.handlerMoveRunner.bind(this));

    this.model.subscribe('updateState', this.handlerModelUpdateState.bind(this));

    this.onStart();
  }

  onStart(data: IParameters = {}): void {
    this.model.updateState(data);
  }

  private handlerMoveRunner(data: any): void {
    this.model.updateState(data, 'moveRunner');
  }

  private handlerModelUpdateState(data: IParameters): void {
    this.view.reDrawView(data);
  }
}
