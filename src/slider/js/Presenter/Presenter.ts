import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IParameters from '../Interfaces/IParameters';
import { IRunnerParameters } from '../Interfaces/IRunnerParameters';
import { IScaleParameters } from '../Interfaces/IScaleParameters';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: SliderView) {
    this.model = model;
    this.view = view;

    this.subscribeForUpdates();

    this.model.updateState({});
  }

  public subscribeForUpdates(): void {
    this.view.subscribe('moveRunner', this.handleRunnerMove);
    this.view.subscribe('clickScale', this.handleScaleClick);
    this.model.subscribe('updateState', this.handleModelUpdate);
  }

  private handleRunnerMove =
    (parameters: IRunnerParameters): void => this.model.updateState(parameters)

  private handleScaleClick =
    (parameters: IScaleParameters): void => this.model.updateState(parameters)

  private handleModelUpdate = (parameters: IParameters): void => {
    this.view.reDrawView(parameters);
  }
}
