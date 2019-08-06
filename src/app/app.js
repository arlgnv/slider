import { createSliderTemplate, checkSettings } from "./utilities.js";
import Model from "./mvc/model.js";
import View from "./mvc/view.js";
import Controller from "./mvc/controller.js";

export default class App {
    constructor(input, settings) {
        if(!checkSettings(settings)) throw new Error("You should read docs and set correct parameters");

        input.insertAdjacentHTML("beforeBegin", createSliderTemplate(settings));

        this.model = new Model(settings);
        this.view = new View(input, input.previousElementSibling);
        this.controller = new Controller(this.model, this.view);

        this.init();
    }

    init() {
        this.view.changeValue(this.model.state.value);

        if (!this.model.state.hideTip) {
            this.view.changeTipPosition(-Math.round(this.view.tip.offsetWidth - this.view.handle.offsetWidth) / 2);
        }
    }
}