import { createSliderTemplate, checkSettings } from "./utilities.js";
import Model from "./mvc/model.js";
import View from "./mvc/view.js";
import Controller from "./mvc/controller.js";

export default class App {
    constructor(input, settings) {
        if (!checkSettings(settings)) throw new Error("You should read docs and set correct parameters");

        this.startState = settings;

        input.insertAdjacentHTML("beforeBegin", createSliderTemplate(this.startState));

        this.model = new Model(this.startState);
        this.view = new View(input, input.previousElementSibling);
        this.controller = new Controller(this.model, this.view);

        this.init();
    }

    init() {
        this.view.changeValue(this.startState.from);

        const handleFromPosition = this.controller.getHandlePositionFromValue(this.startState.from);
        this.view.changeHandlePosition(handleFromPosition, this.view.handleFrom);

        const tipFromPosition = -((this.view.tipFrom.offsetWidth - this.view.handleFrom.offsetWidth) / 2);
        this.view.changeTipPosition(tipFromPosition, this.view.tipFrom);

        if (this.startState.range) {
            this.view.changeValue(this.startState.from, this.startState.to);

            const handleToPosition = this.controller.getHandlePositionFromValue(this.startState.to);
            this.view.changeHandlePosition(handleToPosition, this.view.handleTo);

            const tipToPosition = -((this.view.tipTo.offsetWidth - this.view.handleTo.offsetWidth) / 2);
            this.view.changeTipPosition(tipToPosition, this.view.tipTo);
        }
    }
}
