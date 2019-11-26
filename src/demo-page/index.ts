import './index.scss';
import '../slider/js/slider';
import { DEFAULT_PARAMETERS } from '../utilities/constants';
import Slider from '../components/Slider';

const $sliders = $('.js-slider');
$sliders.each(function (i) { new Slider($(this), DEFAULT_PARAMETERS[i]); });
