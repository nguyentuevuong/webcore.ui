import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $tabindex: (target: ValidationObservable<number>, tabindex: string) => {
        extend(target);

        // extend tabindex prop of observable
        if (ko.isObservable(target.$tabindex)) {
            target.$tabindex(ko.toJS(tabindex));
        } else {
            ko.utils.extend(target, {
                $tabindex: ko.observable(ko.toJS(tabindex))
            });
        }

        return target;
    }
});