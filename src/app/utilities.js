function createSliderTemplate(parameters) {
    if (parameters.theme !== "aqua" && parameters.theme !== "red") parameters.theme = "aqua";

    return `
    <span class="lrs lrs--${parameters.theme}${parameters.view === "vertical" ? " lrs--vertical" : ""}">
        <span class="lrs__range">
            <span class="${parameters.hideTip ? "lrs__tip lrs__tip--hidden" : "lrs__tip"}"></span>
            <span class="lrs__handle">
            </span>
        </span>
    </span>`;
}

function checkSettings(settings) {
    const { from, min, max, step, range, view, hideTip, theme } = settings;

    if (from < min || from > max) return false;

    if (typeof from !== "number" || typeof min !== "number" || typeof max !== "number" || typeof step !== "number") {
        return false;
    }

    if (Math.sign(from) == -1 || Math.sign(min) == -1 || Math.sign(max) == -1 || Math.sign(step) == -1) {
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
