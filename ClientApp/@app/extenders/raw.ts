import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $raw: (target: ValidationObservable<number>, raw: string) => {
        extend(target);

        // extend name prop of observable
        if (ko.isObservable(target.$raw)) {
            target.$raw(ko.toJS(raw));
        } else {
            ko.utils.extend(target, {
                $raw: ko.observable(ko.toJS(raw))
            });
        }

        return target;
    }
});