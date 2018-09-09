import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    validate: (target: ValidationObservable<any>, params: () => string) => {
        let subscribe = (value: string) => {
            if (target.rules['validate']) {
                let invalid = params.apply(target, [value]);

                if (!!invalid) {
                    target.addError('validate', invalid);
                } else {
                    target.removeError('validate');
                }
            }
        };

        //add some sub-observables to our observable
        extend(target, {
            validate: !!params
        });
        // remove old validate
        target.removeValidate('validate');

        //validate whenever the value changes
        if (!target.hasSubscriptionsForEvent(subscribe)) {
            target.subscribe(subscribe);
            target.validationSubscribes["validate"] = subscribe;
        }

        // clear error for first binding time
        target.removeError('validate');

        //return the original observable
        return target;
    }
});