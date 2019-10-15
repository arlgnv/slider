export default class InputView {
  constructor(input) {
    this.input = input;
    this.input.classList.add('hidden-input');
  }

  getInput() {
    return this.input;
  }

  changeValue(value) {
    this.input.value = value;
  }

  getValue() {
    return this.input.value;
  }
}
