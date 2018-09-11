import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    length: (target: ValidationObservable<string>, length: { min: number, max: number }) => {
        extend(target);

        return target;
    }
});