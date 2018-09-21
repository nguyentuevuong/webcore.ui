import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    required: (target: ValidationObservable<any>, params: IRequireConfig | boolean) => {
        //add some sub-observables to our observable
        extend(target);

        if (!ko.isObservable(target.$require)) {
            target.$require = ko.observable(false);
        }

        // add or update require validate
        if (!params) {
            target.$require(false);
            target.removeValidate!('required');
        } else {
            target.$require(true);
            target.addValidate!('required', (value: any) => {
                if (typeof params == 'object') {
                    if (_.has(params, 'validate')) {
                        if (params.validate.apply(target, [value])) {
                            target.addError!('required', params.message || "This field is required");
                        } else {
                            target.removeError!('required');
                        }
                    } else {
                        if (!value) {
                            target.addError!('required', params.message || "This field is required");
                        } else {
                            target.removeError!('required');
                        }
                    }
                } else if (params) {
                    if (!value) {
                        target.addError!('required', "This field is required");
                    } else {
                        target.removeError!('required');
                    }
                }
            });
        }

        // clear error for first binding time
        target.removeError!('required');

        //return the original observable
        return target;
    }
});

interface IRequireConfig {
    message: string;
    validate: () => boolean;
}