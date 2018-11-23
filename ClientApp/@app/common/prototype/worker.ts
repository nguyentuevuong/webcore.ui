import { ko } from '@app/providers';

ko.utils.extend(Function.prototype, {
    toWorker: function () {
        let self = this,
            strict = /"use strict";/,
            toString = `(${self})()`,
            blob = new Blob([toString.replace(strict, '')]),
            toStringURL = URL.createObjectURL(blob);

        return new Worker(toStringURL);
    }
});