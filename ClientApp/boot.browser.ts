import * as _ from 'lodash';
import * as $ from 'jquery';
import * as ko from 'knockout';

import * as crossroads from 'crossroads';
import { createBrowserHistory } from 'history';

import { i18n } from '@app/common/lang';
import { Components } from '@app/common/ko';

// import external libs
import 'popper.js';
import 'bootstrap';

// import components
import '@app/common/ajax-ext';

// import common control
import '@app/common';
import '@app/controls';
import '@app/extenders';
import '@app/components';

// import views & components
import '@views';
import '@components';

// History component needs no trailing slash
const base = document.querySelector('base'),
    baseUrl = base!.getAttribute('href') || '',
    baseName = baseUrl.substring(0, baseUrl.length - 1);

// Tell Knockout to start up an instance of your application
ko.applyBindings({
    baseName: baseName,
    history: createBrowserHistory({ basename: baseName })
}, document.body);

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
    i18n: i18n,
    routes: Components,
    crossroads: crossroads
});