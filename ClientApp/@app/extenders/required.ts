import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    required: (target: ValidationObservable<any>, params: IRequireConfig | boolean) => {
        let subscribe = (value: any) => {
            if (target.rules['required']) {
                if (typeof params == 'object') {
                    if (_.has(params, 'validate')) {
                        if (params.validate.apply(target, [value])) {
                            target.addError('required', params.message || "This field is required");
                        } else {
                            target.removeError('required');
                        }
                    } else {
                        if (!value) {
                            target.addError('required', params.message || "This field is required");
                        } else {
                            target.removeError('required');
                        }
                    }
                } else if (params) {
                    if (!value) {
                        target.addError('required', "This field is required");
                    } else {
                        target.removeError('required');
                    }
                }
            }
        };

        //add some sub-observables to our observable
        extend(target, {
            required: !!params
        });

        // remove old validate
        target.removeValidate!('required');

        // register subscibr
        if (!target.hasSubscriptionsForEvent(subscribe)) {
            target.subscribe(subscribe);
            target.validationSubscribes["required"] = subscribe;
        }

        // clear error for first binding time
        target.removeError('required');

        //return the original observable
        return target;
    }
});

interface IRequireConfig {
    message: string;
    validate: () => boolean;
}