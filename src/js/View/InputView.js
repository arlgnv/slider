export default class InputView {
  constructor(input) {
    this.input = input;

    this.hideInput();
  }

  hideInput() {
    this.input.classList.add('hidden-input');
  }

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value.join(' - ');
  }
}
