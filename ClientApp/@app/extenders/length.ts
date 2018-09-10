import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    length: (target: ValidationObservable<number>, length: { min: number, max: number }) => {
        extend(target);

        // extend name prop of observable
        if (_.has(target, '$name')) {
            target.$name!(ko.toJS(name));
        } else {
            ko.utils.extend(target, {
                $name: ko.observable(ko.toJS(name))
            });
        }

        return target;
    }
});