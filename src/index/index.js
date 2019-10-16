/* eslint-disable func-names */
/* global $ */

import '../js/slider';
import './index.scss';

const $firstSlider = $('.js-first-slider');
$firstSlider.rangeSlider({
  min: 0,
  max: 50,
  from: 0,
  step: 1,
  hasTip: true,
  onChange(value) {
    const values = value.split(' - ');
    const $valueFrom = $firstSlider.closest('.slider').find('.js-slider-from-value');
    const $valueTo = $firstSlider.closest('.slider').find('.js-slider-to-value');

    $valueFrom.val(values[0]);
    $valueTo.val(values[1]);
  },
});

// =======================

const $secondSlider = $('.js-second-slider');
$secondSlider.rangeSlider({
  min: 0,
  max: 200,
  from: 10,
  step: 1,
  hasTip: true,
  hasInterval: true,
  to: 190,
  theme: 'red',
  onChange(value) {
    const values = value.split(' - ');
    const $valueFrom = $secondSlider.closest('.slider').find('.js-slider-from-value');
    const $valueTo = $secondSlider.closest('.slider').find('.js-slider-to-value');

    $valueFrom.val(values[0]);
    $valueTo.val(values[1]);
  },
});

// =======================

const $thirdSlider = $('.js-third-slider');
$thirdSlider.rangeSlider({
  min: 10,
  max: 80,
  from: 20,
  step: 1,
  hasTip: true,
  theme: 'aqua',
  isVertical: true,
  onChange(value) {
    const values = value.split(' - ');
    const $valueFrom = $thirdSlider.closest('.slider').find('.js-slider-from-value');
    const $valueTo = $thirdSlider.closest('.slider').find('.js-slider-to-value');

    $valueFrom.val(values[0]);
    $valueTo.val(values[1]);
  },
});

$('.js-slider-from-value').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('blur', () => {
    sliderData.update({ from: +$field.val() });
  });
});

$('.js-slider-to-value').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('blur', () => {
    sliderData.update({ to: +$field.val() });
  });
});

$('.js-slider-min-value').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('blur', () => {
    sliderData.update({ min: +$field.val() });
  });
});

$('.js-slider-max-value').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('blur', () => {
    sliderData.update({ max: +$field.val() });
  });
});

$('.js-slider-step').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('blur', () => {
    sliderData.update({ step: +$field.val() });
  });
});


$('.js-slider-tip').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('change', () => {
    if ($field.val() === 'show') sliderData.update({ hasTip: true });
    if ($field.val() === 'hide') sliderData.update({ hasTip: false });
  });
});

$('.js-slider-theme').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('change', () => {
    if ($field.val() === 'aqua') sliderData.update({ theme: 'aqua' });
    if ($field.val() === 'red') sliderData.update({ theme: 'red' });
  });
});

$('.js-slider-type').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('change', () => {
    if ($field.val() === 'single') sliderData.update({ hasInterval: false });
    if ($field.val() === 'double') sliderData.update({ hasInterval: true });
  });
});

$('.js-slider-view').each(function () {
  const $field = $(this);
  const sliderData = $field.closest('.slider').find('input[name$=slider]').data('rangeSlider');

  $field.on('change', () => {
    if ($field.val() === 'horizontal') sliderData.update({ isVertical: false });
    if ($field.val() === 'vertical') sliderData.update({ isVertical: true });
  });
});
