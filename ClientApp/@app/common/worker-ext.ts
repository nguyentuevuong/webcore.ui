import * as _ from 'lodash';

_.extend(Function.prototype, {
    toWorker: function () {
        let self = this,
            strict = /"use strict";/,
            toString = `(${self})()`,
            blob = new Blob([toString.replace(strict, '')]),
            toStringURL = URL.createObjectURL(blob);

        return new Worker(toStringURL);
    }
});

interface BindingConstructor {
    new(): any;
}

export function worker() {
    return function (constructor: BindingConstructor) {
        let strict = /"use strict";/,
            toString = `(${constructor})()`,
            blob = new Blob([toString.replace(strict, '')]),
            toStringURL = URL.createObjectURL(blob);

        return new Worker(toStringURL);
    }
}