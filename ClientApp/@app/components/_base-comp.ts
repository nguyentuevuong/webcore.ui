import * as lb from './label-comp';

import * as ko from 'knockout';
import * as _ from 'lodash';

import { randomId } from '@app/common/id';

export class BaseComponentControl {
    $id = randomId;
    $name: string = randomId();

    configs: IBaseConfigs = {
        columns: {
            label: ko.observable('col-md-12'),
            control: ko.observable('col-md-12')
        },
        require: ko.observable(false),
        disabled: ko.observable(false),
        label: {
            text: ko.observable(''),
            constraint: ko.observable(''),
            configs: {
                css: ko.observable(''),
                inline: ko.observable(false),
                require: ko.observable(false)
            }
        }
    };

    constructor(params: IBaseParamConstructor, element?: HTMLElement) {
        let self = this,
            configs = self.configs,
            label = configs.label,
            columns = configs.columns;

        ko.computed({
            read: () => {
                configs.require!(ko.toJS(params.configs!.require) || false);
                configs.disabled!(ko.toJS(params.configs!.disabled) || false);

                if (columns) {
                    columns.label!(ko.toJS(params.configs!.columns!.label));
                    columns.control!(ko.toJS(params.configs!.columns!.control));
                }

                if (label) {
                    let lconfigs = label.configs;

                    label.text!(ko.toJS(params.configs!.label!.text) || '');
                    label.constraint!(ko.toJS(params.configs!.label!.constraint) || '');

                    if (lconfigs) {
                        lconfigs.css!(ko.toJS(params.configs!.label!.configs!.css) || '');
                        lconfigs.inline!(ko.toJS(params.configs!.label!.configs!.inline) || false);

                        _.extend(lconfigs, {
                            require: self.configs!.require
                        });
                    }
                }
            }
        });
    }
}

export interface IControlColumns {
    label: KnockoutObservable<string> | undefined;
    control: KnockoutObservable<string> | undefined;
}

export interface IBaseConfigs {
    columns?: IControlColumns | undefined;
    label?: lb.IParam | undefined;
    inline?: KnockoutObservable<boolean> | undefined;
    require?: KnockoutObservable<boolean> | undefined;
    disabled?: KnockoutObservable<boolean> | undefined;
}

export interface IBaseParamConstructor {
    configs: IBaseConfigs;
}