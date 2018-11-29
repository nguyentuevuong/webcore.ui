// import external observable
import '@app/common/ko/context';
import '@app/common/ko/observable';

// import prototype
import '@app/common/prototype';

// import custom bootstrap event
import '@app/common/ui/bootstrap';

// import history extend
import '@app/common/router/history';

// import common control
import '@app/common';
import '@app/controls';
import '@app/extenders';
import '@app/components';

// import views & components
import '@views';
import '@components';

import { ko } from '@app/providers';
import { CodeHighlighter } from '@app/common/utils';

// History component needs no trailing slash
const base = document.querySelector('base'),
    baseUrl = base!.getAttribute('href') || '',
    baseName = baseUrl.substring(0, baseUrl.length - 1);

// Tell Knockout to start up an instance of your application
ko.applyBindings({
    baseName: baseName
}, document.body);

// Basic hot reloading support. Automatically reloads and restarts the Knockout app each time
// you modify source files. This will not preserve any application state other than the URL.
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => ko.cleanNode(document.body));
}

ko.utils.extend(window, { ko, CodeHighlighter });