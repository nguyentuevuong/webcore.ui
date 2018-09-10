import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $enable: (target: ValidationObservable<number>, enable: boolean) => {
        extend(target);

        // extend disabled prop of observable
        if (ko.isObservable(target.$disable)) {
            target.$disable(!ko.toJS(enable));
        } else {
            ko.utils.extend(target, {
                $disable: ko.observable(!ko.toJS(enable))
            });
        }

        // extend enable prop of observable
        if (ko.isObservable(target.$enable)) {
            target.$enable(ko.toJS(enable));
        } else {
            ko.utils.extend(target, {
                $enable: ko.observable(ko.toJS(enable))
            });
        }

        return target;
    }
});