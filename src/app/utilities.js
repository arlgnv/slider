function createSliderTemplate(parameters) {
    if (parameters.theme !== "aqua" && parameters.theme !== "red") parameters.theme = "aqua";

    return `
    <span class="lrs lrs--${parameters.theme}${parameters.view === "vertical" ? " lrs--vertical" : ""}">
        <span class="lrs__range">
            <span class="lrs__handle lrs__handle-from">
                <span class="${parameters.hideTip ? "lrs__tip lrs__tip--hidden" : "lrs__tip"}"></span>
            </span>
            <span class="lrs__progress-bar">
            </span>
            <span class="lrs__handle lrs__handle-to${!parameters.range ? " lrs__handle--hidden" : ""}">
                <span class="${parameters.hideTip ? "lrs__tip lrs__tip--hidden" : "lrs__tip"}"></span>
            </span>
        </span>
    </span>`;
}

function checkSettings(settings) {
    const { from, to, min, max, step, range, view, hideTip, theme } = settings;

    if (typeof from !== "number" || typeof min !== "number" || typeof max !== "number" || typeof step !== "number") {
        return false;
    }

    if (typeof range !== "boolean" || typeof hideTip !== "boolean") {
        return false;
    }

    if (typeof view !== "string" || typeof theme !== "string") {
        return false;
    }

    if (step < 1) return false;

    if (range) {
        if (typeof to !== "number") return false;

        if (from < min || from > to || to > max) return false;
    }

    if (!range) {
        if (from < min || from > max) return false;
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
