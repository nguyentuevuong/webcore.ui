import * as _ from 'lodash';
import * as ko from 'knockout';
import * as crossroads from 'crossroads';
import { createBrowserHistory, History } from 'history';

// not using jquery in knockout
ko.options.useOnlyNativeEvents = true;

export { _, ko, History, History as history, crossroads, createBrowserHistory }