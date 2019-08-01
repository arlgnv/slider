import { assert } from "chai";
import { createSliderTemplate } from "./utilities";

describe("Create slider template", () => {
    const settings = {value: 0, min: 0, max: 100, step: 1, range: false, view: "horizontal", hideTip: true, theme: "aqua"};

    it("function returns string", () => {
        assert.isString(createSliderTemplate(settings));
    });
    
    it("function returns correct string", () => {
        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf(settings.theme), -1);
    });
});