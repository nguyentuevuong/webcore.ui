import { _, ko } from '@app/providers';

export function extend(target: ValidationObservable<any>) {
    // extend validations prop
    ko.utils.extend(target, {
        hasError: target.hasError || ko.observable(false),
        addError: target.addError || function (rule: string, message: string) {
            let msgs: IMessages = ko.toJS(target.validationMessages);

            _.set(msgs, rule, message);
            target.validationMessages!(msgs);
        },
        clearError: target.clearError || function () {
            target.validationMessages!({});
        },
        removeError: target.removeError || function (rule: string) {
            let msgs: IMessages = ko.toJS(target.validationMessages);

            _.unset(msgs, rule);
            target.validationMessages!(msgs || {});
        },
        checkError: target.checkError || function () {
            _.forIn(target.validationSubscribes, (subscribe: { callback: (value: any) => void }, key: string) => {
                subscribe.callback(ko.toJS(target));
            });
        },
        validationMessage: target.validationMessage || ko.observable(''),
        validationMessages: target.validationMessages || ko.observable({}),
        validationSubscribes: target.validationSubscribes || {},
        addValidate: target.addValidate || function (key: string, subscribe: any) {
            target.removeValidate(key);

            if (!target.hasSubscriptionsForEvent(subscribe)) {
                let subscription = target.subscribe(subscribe);

                _.set(target.validationSubscribes, key, subscription);
            }
        },
        removeValidate: target.removeValidate || function (key: string) {
            let subscription: { dispose: () => void } = target.validationSubscribes[key];

            if (subscription) {
                subscription.dispose();
            }
        }
    });

    if (!target.validationMessages!.getSubscriptionsCount()) {
        target.validationMessages!.subscribe((msgs: IMessages) => {
            if (_.isEqual(msgs, {})) {
                target.hasError!(false);
                target.validationMessage!('');
            } else {
                target.hasError!(true);
                target.validationMessage!(_.first(_.values(msgs)) || '');
            }
        });
    }
}