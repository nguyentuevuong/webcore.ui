import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';
import { History } from 'history';

// not using jquery in knockout
ko.options.useOnlyNativeEvents = true;

export { $, _, ko, $ as jQuery, History, History as history }