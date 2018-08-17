import * as $ from 'jquery';
import * as _ from 'lodash';

export const
    CLEAR = 'clear',
    VALIDATE = 'validate',
    ERROR = 'error',
    REQUIRE = 'require',
    MSG_ERROR = '_nts_msg_error',
    SAVE_DATA = '_nts_save',
    DATA_KEY = '_nts_data_key',
    NTS_ID = '_nts_id',
    NTS_VALUE = '_nts_data_value',
    NTS_REQUIRE = '_nts_data_require';

export const init = ($element: JQuery<HTMLElement>) => {
    $element
        // define event save data
        .on(SAVE_DATA, (evt: JQuery.Event<HTMLElement>, key: string, value: any) => {
            let data = $element.data(DATA_KEY) || {};

            data[key] = value;
            $element.data(DATA_KEY, data);
        })
        .on(ERROR, (evt: JQuery.Event<HTMLElement>, code: string | any, msg: any) => {
            let data = $element.data(DATA_KEY) || {},
                errors = _(data).keys().filter(k => k.indexOf(MSG_ERROR) > -1).value(),
                exist = _.find(errors, e => e.indexOf(_.isString(code) ? code : code['code']) > -1);

            // save code error
            if (exist) {
                $element
                    .trigger(SAVE_DATA, [exist, `Error (${_.isString(code) ? code : code['code']}): ${_.isString(code) ? code : code['msg']}.`]);
            } else {
                $element
                    .trigger(SAVE_DATA, [`${_.size(errors) + 1}_${MSG_ERROR}_${_.isString(code) ? code : code['code']}`, `Error (${_.isString(code) ? code : code['code']}): ${_.isString(code) ? code : code['msg']}.`]);
            }

            $element
                .trigger(VALIDATE);
        })
        .on(CLEAR, (evt: JQuery.Event<HTMLElement>, code: string | undefined = undefined) => {
            let data = $element.data(DATA_KEY) || {},
                errors = _(data).keys().filter(k => k.indexOf(MSG_ERROR) > -1).value(),
                exist = code && _.find(errors, e => e.indexOf(code) > -1);

            if (!code) {
                // remove all error
                _.each(errors, r => {
                    $element.trigger(SAVE_DATA, [r, null]);
                });

                // remove class error
                $element
                    .removeClass('has-error');

                // remove red border in control
                $element
                    .find('.form-control')
                    .removeClass('is-invalid');

                // remove error text
                $element
                    .find('small.form-text')
                    .text('');
            } else {
                if (exist) {
                    $element
                        .trigger(SAVE_DATA, [exist, null]); // remove error by code
                }

                // re validate (for other error)
                $element
                    .trigger(VALIDATE);
            }
        })
        .on(REQUIRE, (evt: JQuery.Event<HTMLElement>) => {

        })
        .on(VALIDATE, (evt: JQuery.Event<HTMLElement>) => {
            let data = $element.data(DATA_KEY) || {},
                errors = _(data).keys().filter(k => k.indexOf(MSG_ERROR) > -1).value(),
                has_errors = _(errors).map(r => ({ k: r, v: data[r] })).filter(r => !!r.v).value();

            if (data[NTS_REQUIRE] && !data[NTS_VALUE]) {
                let $input = $element
                    .addClass('has-error')
                    .find('.form-control');

                if (!$input.is('[readonly]') && !$input.is('[disabled]')) {
                    $input.addClass('is-invalid');
                }

                if (data[MSG_ERROR]) {
                    $element.find('small.form-text')
                        .text(`${data[MSG_ERROR]}`);
                }
            } else {
                $element
                    .trigger(CLEAR);
            }
        });
};

export const validator = ($element: JQuery<HTMLElement>, validate: any | undefined = undefined) => {
    let data = $element.data(DATA_KEY) || {};

    if (validate) {
        let keys = _.keys(validate);

    }

    return $element;
};