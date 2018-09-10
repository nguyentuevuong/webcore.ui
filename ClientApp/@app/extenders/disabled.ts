import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $disable: (target: KnockoutObservable<number>, disable: boolean) => {
        // extend disabled prop of observable
        if (_.has(target, '$disable')) {
            target.$disable!(ko.toJS(disable));
        } else {
            ko.utils.extend(target, {
                $disable: ko.isObservable(disable) ? disable : ko.observable(ko.toJS(disable))
            });
        }

        // extend enable prop of observable
        if (_.has(target, '$enable')) {
            target.$enable!(!ko.toJS(disable));
        } else {
            ko.utils.extend(target, {
                $enable: ko.observable(!ko.toJS(disable))
            });
        }

        return target;
    }
});