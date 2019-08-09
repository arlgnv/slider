import { createSliderTemplate, checkSettings } from "./utilities.js";
import Model from "./mvc/model.js";
import View from "./mvc/view.js";
import Controller from "./mvc/controller.js";

export default class App {
    constructor(input, settings) {
        if (!checkSettings(settings)) throw new Error("You should read docs and set correct parameters");

        input.insertAdjacentHTML("beforeBegin", createSliderTemplate(settings));

        this.model = new Model(settings);
        this.view = new View(input, input.previousElementSibling);
        this.controller = new Controller(this.model, this.view);

        this.init();
    }

    init() {
        this.view.changeValue(this.model.state.from);

        const handleFromPosition = this.controller.getHandlePositionFromValue(this.model.state.from);
        this.view.changeHandlePosition(handleFromPosition, this.view.handleFrom);

        const tipFromPosition = -((this.view.tipFrom.offsetWidth - this.view.handleFrom.offsetWidth) / 2);
        this.view.changeTipPosition(tipFromPosition, this.view.tipFrom);

        if (this.model.state.range) {
            this.view.changeValue(this.model.state.from, this.model.state.to);

            const handleToPosition = this.controller.getHandlePositionFromValue(this.model.state.to);
            this.view.changeHandlePosition(handleToPosition, this.view.handleTo);

            const tipToPosition = -((this.view.tipTo.offsetWidth - this.view.handleTo.offsetWidth) / 2);
            this.view.changeTipPosition(tipToPosition, this.view.tipTo);
        }
    }
}
