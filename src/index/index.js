const slider1 = $(".js-range-slider1");
slider1.rangeSlider({
    min: 0,
    max: 100,
    from: 0,
    step: 1,
    hideTip: false,
});

setHandlers(slider1);

// =======================

const slider2 = $(".js-range-slider2");
slider2.rangeSlider({
    min: 0,
    max: 200,
    from: 0,
    step: 1,
    hideTip: false,
    range: true,
    to: 90
});

setHandlers(slider2);

// =======================

const slider3 = $(".js-range-slider3");

slider3.rangeSlider({
    min: 0,
    max: 100,
    from: 0,
    step: 1,
    view: "vertical",
    hideTip: false,
});

setHandlers(slider3);

// =======================

const slider4 = $(".js-range-slider4");

slider4.rangeSlider({
    min: 0,
    max: 100,
    from: 10,
    step: 1,
    hideTip: false,
    view: "vertical",
    range: true,
    to: 90
});

setHandlers(slider4);

// =======================

function setHandlers(elem) {
    const app = elem.data("rangeSlider");

    elem.on("blur", function() {
        const value = $(this).val();
        
        if (value.indexOf(" - ") !== -1) {
            const values = value.split(" - ");

            app.update({
                from: values[0],
                to: values[1]
            });
        } else {
            app.update({from: value});
        }
    });

    elem.closest(".demonstration__block").find("input[type=submit]").on("click", function(evt){
        evt.preventDefault();
        
        const obj = {};

        $(this).closest(".demonstration__form").find("input:not([type=submit])").each(function(){
            obj[this.name] = +this.value;

            if (this.type === "checkbox") obj[this.name] = this.checked;
        });

        app.update(obj);
    });
}