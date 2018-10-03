import { ko } from '@app/providers';

var IMask = require('imask');

ko.utils.extend(ko, {
    observableString: function (initialValue: string | undefined | null) {
        return ko.observable(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    bind: 'string',
                    mask: String,
                }
            });
    },
    observableDate: function (initialValue: Date | undefined | null) {
        return ko.observable(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    bind: 'date',
                    mask: Date,
                    min: new Date(1900, 1, 1),
                    max: new Date(9999, 12, 31)
                }
            }) as KnockoutObservableDate;
    },
    observableTime: function (initialValue: number | undefined | null) {
        return ko.observable(initialValue)
            .extend({
                required: false
            }).extend({
                $icons: {
                    after: 'fa fa-clock-o'
                },
                $type: {
                    bind: 'time'
                },
                //$width: 130,
                $value: initialValue, // convert to display value
                $raw: {
                    unmaskedValue: initialValue
                }
            });
    },
    observableClock: function (initialValue: number | undefined | null) {
        return ko.observable(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    bind: 'clock',
                    mask: Number,
                    min: -720,  // -12:00 (12h yesterday)
                    max: 2160   // 36:00 (12h tomorow)
                }
            });
    },
    observableNumber: function (initialValue: number | undefined | null) {
        return ko.observable(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    bind: 'number',
                    mask: Number
                }
            });
    }
});