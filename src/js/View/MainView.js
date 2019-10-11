import EventEmitter from '../EventEmitter/EventEmitter';
import SliderView from './SliderView';
import InputView from './InputView';

export default class MainView extends EventEmitter {
  constructor(input, settings) {
    super();

    this.input = new InputView(input);
    this.slider = new SliderView(input, settings);

    this.slider.subscribe('clickHandle', this.handleClickHandle.bind(this));
    this.slider.subscribe('moveHandle', this.handleMoveHandle.bind(this));
  }

  handleClickHandle(obj) {
    this.notify('click', obj);
  }

  handleMoveHandle(obj) {
    this.notify('drag', obj);
  }

  changeHandlePosition(handle, value) {
    handle.style.cssText = this.slider.classList.contains('lrs_direction_vertical') ? `bottom: ${value}px` : `left: ${value}px`;
  }
}
