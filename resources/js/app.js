
require('./bootstrap');

window.Vue = require('vue');

/** from Tixbee */

/* Axios */

import axios from 'axios';
window.axios = require('axios');

/* JSON to CSV */

import JsonCSV from 'vue-json-csv'

Vue.component('downloadCsv', JsonCSV)

/* Google Charts */

import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts);

/* V-Calendar */

import VCalendar from 'v-calendar';
Vue.use(VCalendar);
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
Vue.component('date-picker', DatePicker)

/* DatePicker */

import DateRangePicker from "@gravitano/vue-date-range-picker";
Vue.use(DateRangePicker);

/* HTML to Paper */

import VueHtmlToPaper from 'vue-html-to-paper';
const options = {
    name: '_blank',
    specs: [
        'fullscreen=yes',
        'titlebar=no',
        'scrollbars=yes'
    ],
    styles: [
        'https://tixbee.com/css/print.css'
    ]
}
Vue.use(VueHtmlToPaper, options);

/* Vuikit */

import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
Vue.use(Vuikit)
Vue.use(VuikitIcons)

/* Moment JS */

Vue.use(require('vue-moment'));

/** End of from Tixbee */


Vue.component('zips-component', require('./components/Zips.vue').default);



const app = new Vue({
    el: '#app',
});
