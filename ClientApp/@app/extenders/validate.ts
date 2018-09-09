import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    validate: (target: ValidationObservable<any>, params: () => string | undefined) => {
        let subscribe = (value: string) => {
            let invalid = params.apply(target, [value]);

            if (!!invalid) {
                target.addError('validate', invalid);
            } else {
                target.removeError('validate');
            }
        };

        //add some sub-observables to our observable
        extend(target);

        //validate whenever the value changes
        if (!params) {
            target.removeValidate('validate');
        } else {
            target.addValidate('validate', subscribe);
        }

        // clear error for first binding time
        target.removeError('validate');

        //return the original observable
        return target;
    }
});