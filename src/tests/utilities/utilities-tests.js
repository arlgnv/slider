import { createSliderTemplate } from "./../../app/utilities.js";

describe("Create slider template", () => {
    it("function returns string", () => {
        const settings = {};

        assert.isString(createSliderTemplate(settings));
    });

    it("function returns string with theme", () => {
        const settings = {};
        settings.theme = "aqua";
        
        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf(settings.theme), -1);
    });
});

mocha.run();