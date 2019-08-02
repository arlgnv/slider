import { createSliderTemplate, checkSettings } from "./../../app/utilities.js";

describe("Utilities", () => {
    describe("Functions", () => {
        describe("createSliderTemplate", () => {
            it("returns string type", () => {
                const settings = {};

                assert.isString(createSliderTemplate(settings));
            });

            it("string has basic theme if \"settings.theme\" is unknown", () => {
                const settings = {theme: "parapampampam"};

                const template = createSliderTemplate(settings);

                assert.notEqual(template.indexOf("aqua"), -1);
            });

            it("string has settings' theme", () => {
                const settings = {theme: "aqua"};

                const template = createSliderTemplate(settings);

                assert.notEqual(template.indexOf(settings.theme), -1);
            });
        });

        describe("checkSettings", () => {
            it("It's ok with valid settings", () => {
                const settings = {value: 0,min: 0,max: 100,step: 1,range: false,view: "horizontal",hideTip: true,theme: "aqua"};

                assert.isOk(checkSettings(settings));
            });

            it("It's wrong with incorrect settings", () => {
                let settings = {value: "5",min: [],max: "13",step: false,range: false,view: "horizontal",hideTip: true,theme: "aqua"};     
                assert.isNotOk(checkSettings(settings)); // value, min, max, step must be numbers

                settings = {value: 0,min: 0,max: 100,step: 1,range: 3,view: "horizontal",hideTip: "alala",theme: "aqua"};
                assert.isNotOk(checkSettings(settings)); //range, hideTip are must be boolean

                settings = {value: 0,min: 0,max: 100,step: 1,range: false,view: true,hideTip: true,theme: {}};
                assert.isNotOk(checkSettings(settings)); //view, theme are must be strings
            });
        });
    });

    describe("Classes", () => {});
});

mocha.run();
