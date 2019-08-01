function createSliderTemplate(parameters) {
    let template;

    if (parameters.hideTip === false) {
        template = `
        <span class="lrs lrs--${parameters.theme}">
        <span class="lrs__range">
        <span class="lrs__tip"></span>
        <span class="lrs__handle"></span>
        </span>
        </span>`;
    } else {
        template = `
        <span class="lrs lrs--${parameters.theme}">
        <span class="lrs__range">
        <span class="lrs__handle">
        </span>
        </span>
        </span>`;
    }

    return template;
}

export {createSliderTemplate};