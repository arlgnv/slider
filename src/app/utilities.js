function createSliderTemplate(parameters) {
    if (parameters.theme !== "aqua" && parameters.theme !== "red") parameters.theme = "aqua";

    let template;

    if (parameters.hideTip === true) {
        template = `<span class="lrs lrs--${parameters.theme}">
        <span class="lrs__range">
        <span class="lrs__tip lrs__tip--hidden"></span>
        <span class="lrs__handle"></span>
        </span>
        </span>`;
    } else {
        template = `
    <span class="lrs lrs--${parameters.theme}">
    <span class="lrs__range">
    <span class="lrs__tip"></span>
    <span class="lrs__handle">
    </span>
    </span>
    </span>`;
    }

    return template;
}

function checkSettings(settings) {
    const { value, min, max, step, range, view, hideTip, theme } = settings;

    if (value < min) return false;

    if (typeof value !== "number" || typeof min !== "number" || Math.sign(min) == -1 || typeof max !== "number" || typeof step !== "number") {
        return false;
    }

    if (Math.sign(value) == -1 || Math.sign(min) == -1 || Math.sign(max) == -1 || Math.sign(step) == -1) {
        return false;
    }

    if (typeof range !== "boolean" || typeof hideTip !== "boolean") {
        return false;
    }

    if (typeof view !== "string" || typeof theme !== "string") {
        return false;
    }

    return true;
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

export { createSliderTemplate, checkSettings, EventEmitter };
