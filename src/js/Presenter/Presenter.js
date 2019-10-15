/* eslint-disable max-len */

export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('clickRunner', this.handlerRunnerClick.bind(this));
    this.view.subscribe('moveRunner', this.handlerRunnerMove.bind(this));

    this.model.subscribe('updateState', this.handlerModelUpdateState.bind(this));
  }

  handlerRunnerClick(trackLength) {
    this.model.ratio = trackLength;
  }

  handlerRunnerMove({ runnerPosition, runnerType }) {
    let value = this.model.getValueFromPosition(runnerPosition);

    if (this.model.isValueProper(value)) value = this.model.correctValueWithStep(value);

    value = this.model.correctValueWithEdges(value, runnerType);

    this.model.updateState({ [runnerType]: value });
  }

  handlerModelUpdateState(data) {
    const runnerType = 'from' in data ? 'from' : 'to';
    const position = this.model.getPositionFromValue(this.model.state[runnerType]);

    this.view.reDrawView(position, runnerType, this.model.state);
  }

  onStart({ runnerFrom, runnerTo }) {
    this.model.ratio = this.view.getTrackLength(runnerFrom);

    let position = this.model.getPositionFromValue(this.model.state.from);

    this.view.reDrawView(position, 'from', this.model.state);

    if (this.model.state.hasInterval) {
      this.model.ratio = this.view.getTrackLength(runnerTo);

      position = this.model.getPositionFromValue(this.model.state.to);

      this.view.reDrawView(position, 'to', this.model.state);
    }
  }
}
