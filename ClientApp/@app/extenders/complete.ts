import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $complete: (target: ValidationObservable<number>, complete: boolean) => {
        extend(target);

        // extend name prop of observable
        if (ko.isObservable(target.$complete)) {
            target.$complete(ko.toJS(complete));
        } else {
            ko.utils.extend(target, {
                $complete: ko.observable(ko.toJS(complete))
            });
        }

        return target;
    }
});