export default function correctSettings(settings) {
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

  parameters.isVertical = parameters.isVertical !== false && parameters.isVertical !== true ? false : parameters.isVertical;

  parameters.hasTip = parameters.hasTip !== false && parameters.hasTip !== true ? false : parameters.hasTip;

  parameters.hasInterval = parameters.hasInterval !== true && parameters.hasInterval !== false ? false : parameters.hasInterval;

  if (parameters.hasInterval) {
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

  if (parameters.hasInterval) {
    if (parameters.from < parameters.min) parameters.from = parameters.min;
    if (parameters.from > parameters.max) parameters.from = parameters.max;
  }

  parameters.onChange = typeof parameters.onChange !== 'function' ? null : parameters.onChange;

  return parameters;
}
