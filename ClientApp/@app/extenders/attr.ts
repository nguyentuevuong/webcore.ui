import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $attr: (target: ValidationObservable<number>, attr: { [key: string]: any }) => {
        extend(target);

        // init attr object
        if (!target.$attr) {
            target.$attr = ko.observable({});
        }

        let $attr: { [key: string]: KnockoutObservable<any> } = ko.toJS(target.$attr);

        if (!attr) {
            _.forIn(target.$attr, (value: any, key: string) => {
                if (ko.isObservable($attr[key])) {
                    $attr[key](undefined);
                }
            });
        } else {
            _.forIn(attr, (value: any, key: string) => {
                if (ko.isObservable($attr[key])) {
                    $attr[key](value);
                } else {
                    $attr[key] = ko.observable(ko.toJS(value));
                }
            });
        }

        target.$attr($attr);

        return target;
    }
});