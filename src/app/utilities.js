function createSliderTemplate(parameters) {
  return `
    <span class="lrs lrs_${parameters.theme}${parameters.view === "vertical" ? " lrs_vertical" : ""}">
        <span class="lrs__range">
            <span class="lrs__handle lrs__handle-from">
                <span class="${parameters.hideTip ? "lrs__tip lrs__tip_hidden" : "lrs__tip"}"></span>
            </span>
            <span class="lrs__progress-bar">
            </span>
            <span class="lrs__handle lrs__handle-to${!parameters.range ? " lrs__handle_hidden" : ""}">
                <span class="${parameters.hideTip ? "lrs__tip lrs__tip_hidden" : "lrs__tip"}"></span>
            </span>
        </span>
    </span>`;
}

function correctSettings(settings) {
  if (settings.from) {
    if (typeof settings.from === "string") settings.from = +settings.from;
    if (settings.from < settings.min) settings.from = settings.min;
  }

  if (settings.min) {
    if (typeof settings.min === "string") settings.min = +settings.min;
  }

  if (settings.max) {
    if (typeof settings.max === "string") settings.max = +settings.max;
  }

  if (settings.step) {
    if (typeof settings.step === "string") settings.step = +settings.step;
    if (settings.step < 1) settings.step = 1;
  }

  if (settings.theme) {
    if (settings.theme !== "aqua" && settings.theme !== "red") settings.theme = "aqua";
  }

  if (settings.range) {
    if (typeof settings.to === "string") settings.to = +settings.to;
    if (settings.from > settings.to) settings.from = settings.to;
    if (settings.to < settings.from) settings.to = settings.from;
    if (settings.to > settings.max) settings.to = settings.max;
  }

  if (!settings.range) {
    if (settings.from > settings.max) settings.from = settings.max;
  }

  return settings;
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
