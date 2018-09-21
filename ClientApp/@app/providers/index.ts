import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

// not using jquery in knockout
ko.options.useOnlyNativeEvents = true;

export { $, _, ko, $ as jQuery }