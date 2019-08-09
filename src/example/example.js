const slider = $(".range1");

slider.rangeSlider({
    min: 0,
    max: 100,
    from: 20,
    step: 14,
    hideTip: false,
    range: true,
    to: 40
});

const sliderApp = slider.data("rangeSlider");

$(".range2").rangeSlider({
    min: -10,
    max: 50,
    from: 11,
    step: 1,
    hideTip: false,
    range: true,
    to: 45,
    theme: "red"
});