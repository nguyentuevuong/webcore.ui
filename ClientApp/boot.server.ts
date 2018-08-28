// code for ssr

// import external libs
/*import 'lodash';
import 'jquery';
import 'knockout';
import 'popper.js';
import 'bootstrap';

import * as _ from 'lodash';
import * as ko from 'knockout';

import { createBrowserHistory } from 'history';

// import components
import './common/app-prefix';
import "./common/ajax-ext";
import './common/app-i18n';
import './components/_cp-loader';
import './controls/_ctrl-loader';
import './views/_vws-loader';

import * as domino from 'domino';
import { Promise } from 'es6-promise';
import { createServerRenderer, RenderResult, BootFuncParams, BootFunc } from 'aspnet-prerendering';

export default createServerRenderer(((params: BootFuncParams) => {
    let window = domino.createWindow(require('./index.html'), params.url);

    // History component needs no trailing slash
    const base = window.document.querySelector('base'),
        baseUrl = base!.getAttribute('href') || '',
        baseName = baseUrl.substring(0, baseUrl.length - 1);

    // Tell Knockout to start up an instance of your application
    ko.applyBindings({
        baseName: baseName,
        history: createBrowserHistory({ basename: baseName })
    }, window.document.querySelector('body'));

    return new Promise<RenderResult>((resolve, reject) => {
        resolve({
            html: window.document.querySelector("body>div")!.outerHTML
        });
    });
}) as BootFunc);*/