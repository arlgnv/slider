function createSliderTemplate(parameters) {
  return `
    <span class="lrs lrs_${parameters.theme}${
  parameters.view === 'vertical' ? ' lrs_vertical' : ''
}">
        <span class="lrs__range">
            <span class="lrs__handle lrs__handle-from">
                <span class="${
  parameters.hideTip ? 'lrs__tip lrs__tip_hidden' : 'lrs__tip'
}"></span>
            </span>
            <span class="lrs__progress-bar">
            </span>
            <span class="lrs__handle lrs__handle-to${
  !parameters.range ? ' lrs__handle_hidden' : ''
}">
                <span class="${
  parameters.hideTip ? 'lrs__tip lrs__tip_hidden' : 'lrs__tip'
}"></span>
            </span>
        </span>
    </span>`;
}

function correctSettings(settings) {
  const parameters = settings;

  if (parameters.from) {
    if (typeof parameters.from === 'string') parameters.from = +parameters.from;
    if (parameters.from < parameters.min) parameters.from = parameters.min;
  }

  if (parameters.min) {
    if (typeof parameters.min === 'string') parameters.min = +parameters.min;
  }

  if (parameters.max) {
    if (typeof parameters.max === 'string') parameters.max = +parameters.max;
  }

  if (parameters.step) {
    if (typeof parameters.step === 'string') parameters.step = +parameters.step;
    if (parameters.step < 1) parameters.step = 1;
  }

  if (parameters.theme) {
    if (parameters.theme !== 'aqua' && parameters.theme !== 'red') {
      parameters.theme = 'aqua';
    }
  }

  if (parameters.range) {
    if (typeof parameters.to === 'string') parameters.to = +parameters.to;
    if (parameters.from > parameters.to) parameters.from = parameters.to;
    if (parameters.to < parameters.from) parameters.to = parameters.from;
    if (parameters.to > parameters.max) parameters.to = parameters.max;
  }

  if (!parameters.range) {
    if (parameters.from > parameters.max) parameters.from = parameters.max;
  }

  return parameters;
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, callback) {
    this.events[type] = callback;
  }

  emit(type, arg) {
    if (this.events[type]) this.events[type](arg);
  }
}

export { createSliderTemplate, correctSettings, EventEmitter };
