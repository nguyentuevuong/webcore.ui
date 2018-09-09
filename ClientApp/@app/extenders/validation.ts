import { _, ko } from '@app/providers';

export function extend(target: ValidationObservable<any>, rule?: IRule) {
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
            _.forIn(target.validationSubscribes, (subscribe: (value: any) => void, key: string) => {
                subscribe(ko.toJS(target));
            });
        },
        validationMessage: target.validationMessage || ko.observable(''),
        validationMessages: target.validationMessages || ko.observable({}),
        rules: target.rules || {},
        validationSubscribes: target.validationSubscribes || {},
        removeValidate: target.removeValidate || function (key: string) {
            if (target.validationSubscribes) {
                let subscribe = target.validationSubscribes[key];

                if (subscribe) {
                    _.unset(target.validationSubscribes, key);
                }
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

    // add rule
    if (rule) {
        _.forIn(rule, (v: boolean, k: string) => {
            target.rules![k] = v;
        });
    }
}