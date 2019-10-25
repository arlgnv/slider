export default class InputView {
  constructor(private input: HTMLInputElement) {
    this.input = input;

    this.input.classList.add('lrs-hidden-input');
  }

  getInput(): HTMLInputElement {
    return this.input;
  }

  changeValue(value: string): void {
    this.input.value = value;
  }

  getValue(): string {
    return this.input.value;
  }
}
