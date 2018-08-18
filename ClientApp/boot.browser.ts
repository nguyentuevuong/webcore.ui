import * as _ from 'lodash';
import * as $ from 'jquery';
import * as ko from 'knockout';
import * as crossroads from 'crossroads';

import { createBrowserHistory } from 'history';
import { Routes } from './common/app-router';

// import external libs
import 'popper.js';
import 'bootstrap';

// import components
import "./common/ajax-ext";
import './common/app-i18n';
import './components/_cp-loader';
import './controls/_ctrl-loader';
import './views/_vws-loader';

// History component needs no trailing slash
const base = document.querySelector('base'),
    baseUrl = base!.getAttribute('href') || '',
    baseName = baseUrl.substring(0, baseUrl.length - 1);

// Tell Knockout to start up an instance of your application
ko.applyBindings({
    baseName: baseName,
    history: createBrowserHistory({ basename: baseName })
}, document.querySelector('body'));

// Basic hot reloading support. Automatically reloads and restarts the Knockout app each time
// you modify source files. This will not preserve any application state other than the URL.
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => ko.cleanNode(document.body));
}

// for debugger
ko.utils.extend(window, {
    _: _,
    $: $,
    ko: ko,
    routes: Routes,
    crossroads: crossroads
});