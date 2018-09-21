import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $value: (target: ValidationObservable<number>, value: string) => {
        extend(target);

        // extend name prop of observable
        if (ko.isObservable(target.$value)) {
            target.$value(ko.toJS(value));
        } else {
            ko.utils.extend(target, {
                $value: ko.observable(ko.toJS(value)).extend({ deferred: true })
            });
        }

        return target;
    }
});