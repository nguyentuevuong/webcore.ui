import { ko } from '@app/providers';
import { extend } from '@app/extenders/validate';
ko.utils.extend(ko.extenders, {
    $disable: (target: ValidationObservable<number>, disable: boolean) => {
        extend(target);

        // extend disabled prop of observable
        if (ko.isObservable(target.$disable)) {
            target.$disable(ko.toJS(disable));
        } else {
            ko.utils.extend(target, {
                $disable: ko.observable(ko.toJS(disable))
            });
        }

        // extend enable prop of observable
        if (ko.isObservable(target.$enable)) {
            target.$enable(!ko.toJS(disable));
        } else {
            ko.utils.extend(target, {
                $enable: ko.observable(!ko.toJS(disable))
            });
        }

        return target;
    }
});