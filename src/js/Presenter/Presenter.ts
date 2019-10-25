import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import IParameters from '../IParameters';

export default class Presenter {
  constructor(private model: Model, private view: SliderView) {
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
    this.model.updateState(data, true);
  }

  private handlerModelUpdateState(data: IParameters): void {
    this.view.reDrawView(data);
  }
}
