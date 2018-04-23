import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// Google Map Autocomplete
import autoComplete from './modules/autoComplete';

autoComplete($('#address') , $('#lat') , $('#lng'));