import { ko } from '@app/providers';
import { extend, IValidateExtenders } from '@app/extenders/validate';

ko.utils.extend(ko.extenders, {
    required: (target: IValidateExtenders, overrideMessage: string) => {
        //add some sub-observables to our observable
        extend(target);

        //validate whenever the value changes
        ko.computed({
            read: () => {
                target.hasError(ko.toJS(target) ? false : true);
                target.validationMessage(ko.toJS(target) ? "" : overrideMessage || "This field is required");
            }
        });

        // clear error for first binding time
        target.clearError();

        //return the original observable
        return target;
    }
});