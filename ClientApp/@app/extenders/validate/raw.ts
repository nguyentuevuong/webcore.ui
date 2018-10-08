import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validate';

ko.utils.extend(ko.extenders, {
    $raw: (target: ValidationObservable<number>, raw: IMaskRawValue) => {
        extend(target);

        // extend name prop of observable
        if (ko.isObservable(target.$raw)) {
            target.$raw(ko.toJS(raw));
        } else {
            ko.utils.extend(target, {
                $raw: ko.observableOrig(ko.toJS(raw)).extend({ deferred: true })
            });
        }

        return target;
    }
});