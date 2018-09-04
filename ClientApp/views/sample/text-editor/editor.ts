import * as ko from 'knockout';
import * as $ from 'jquery';
import { component } from '@app/common/ko';



@component({
    url: 'sample/text-editor',
    title: 'Text editor',
    icon: 'fa fa-file-text',
    template: require('./editor.html')
})
class TextEditorViewModel {
    value = ko.observable('');
    clear = () => {
        $('.form-group.row').trigger('clear');
    }
    validate = () => {
        $('.form-group.row').trigger('validate');
    }
}