function createSliderTemplate(parameters) {
  const sliderClassName = `lrs lrs_theme_${parameters.theme}${parameters.view === 'vertical' ? ' lrs_theme_vertical' : ''}`.trim();

  return `
  <span class="${sliderClassName}">
    <span class="lrs__handle lrs__handle_from"></span>
    ${parameters.tip ? '<span class="lrs__tip lrs__tip_from"></span>' : ''}
    <span class="lrs__bar"></span>
    ${parameters.range ? `
    <span class="lrs__handle lrs__handle_to"></span>
    ${parameters.tip ? '<span class="lrs__tip lrs__tip_to"></span>' : ''}` : ''}
  </span>`;
}

function correctSettings(settings) {
  const parameters = settings;

  parameters.min = parseFloat(parameters.min);
  if (Number.isNaN(parameters.min)) parameters.min = 0;

  parameters.from = parseFloat(parameters.from);
  if (Number.isNaN(parameters.from)) parameters.from = parameters.min;

  parameters.max = parseFloat(parameters.max);
  if (Number.isNaN(parameters.max)) parameters.max = 100;
  if (parameters.max < parameters.min) {
    const min = Math.min(parameters.max, parameters.min);
    const max = Math.max(parameters.max, parameters.min);

    parameters.min = min;
    parameters.max = max;
  }

  parameters.step = parseFloat(parameters.step);
  if (Number.isNaN(parameters.step)) parameters.step = 1;
  if (parameters.step < 1) parameters.step = 1;

  parameters.theme = parameters.theme !== 'aqua' && parameters.theme !== 'red' ? 'aqua' : parameters.theme;

  parameters.vertical = parameters.vertical !== false && parameters.vertical !== true ? false : parameters.vertical;

  parameters.tip = parameters.tip !== false && parameters.tip !== true ? false : parameters.tip;

  parameters.range = parameters.range !== true && parameters.range !== false ? false : parameters.range;

  if (parameters.range === true) {
    parameters.to = parseFloat(parameters.to);
    if (Number.isNaN(parameters.to)) parameters.to = parameters.max;

    if (parameters.from < parameters.min
      || parameters.from > parameters.max) parameters.from = parameters.min;
    if (parameters.to < parameters.min
      || parameters.to > parameters.max) parameters.to = parameters.max;
    if (parameters.from > parameters.to) {
      const max = Math.max(parameters.from, parameters.to);
      const min = Math.min(parameters.from, parameters.to);

      parameters.from = min;
      parameters.to = max;
    }
  }

  if (parameters.range === false) {
    if (parameters.from < parameters.min) parameters.from = parameters.min;
    if (parameters.from > parameters.max) parameters.from = parameters.max;
  }

  parameters.onChange = typeof parameters.onChange !== 'function' ? null : parameters.onChange;

  return parameters;
}

export { createSliderTemplate, correctSettings };
