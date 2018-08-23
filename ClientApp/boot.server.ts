// code for ssr
import 'lodash';
import 'knockout';
import 'jquery';

/*
import * as domino from 'domino';
import { Promise } from 'es6-promise';
import { createServerRenderer, RenderResult, BootFuncParams, BootFunc } from 'aspnet-prerendering';

export default createServerRenderer(((params: BootFuncParams) => {
    let window = domino.createWindow(require('./index.html'), 'http://localhost:9000');

    return new Promise<RenderResult>((resolve, reject) => {
        resolve({
            html: window.document.querySelector("body>div")!.outerHTML
        });
    });
}) as BootFunc);
*/