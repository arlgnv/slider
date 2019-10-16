export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('clickRunner', this.handlerRunnerClick.bind(this));
    this.view.subscribe('moveRunner', this.handlerRunnerMove.bind(this));

    this.model.subscribe('updateState', this.handlerModelUpdateState.bind(this));
    this.model.subscribe('start', this.handlerModelStart.bind(this));

    this.onStart();
  }

  handlerRunnerClick({ dividend, runnerType }) {
    this.model.setRatio(dividend, runnerType);
  }

  handlerRunnerMove({ runnerPosition, runnerType }) {
    this.model.updateState({ [runnerType]: runnerPosition });
  }

  handlerModelUpdateState(data) {
    if (data.onChange) {
      data.onChange(data.hasInterval ? `${data.from} - ${data.to}` : `${data.from}`);
    }

    this.view.reDrawView(data);
  }

  handlerModelStart(positions) {
    const data = { ...this.model.getState() };
    data.positions = positions;

    this.view.reDrawView(data);
  }

  onStart() {
    const dividends = { fromRatioDividend: this.view.getTrackLength('from') };

    if (this.view.getSliderType() === 'interval') {
      dividends.toRatioDividend = this.view.getTrackLength('to');
    }

    this.model.onStart(dividends);
  }
}
