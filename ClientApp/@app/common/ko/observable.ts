import { ko } from '@app/providers';

let orgObser = ko.observable;

ko.utils.extend(ko, {
    observable: function(initialValue: any | undefined) {
        return orgObser(initialValue).extend({
            required: false
        });
    },
    observableString: function(initialValue: string | undefined) {
        return orgObser(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    mask: String
                }
            });
    },
    observableDate: function(initialValue: Date | undefined) {
        return orgObser(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    mask: Date,
                    min: new Date(1900, 1, 1),
                    max: new Date(9999, 12, 31)
                }
            });
    },
    observableTime: function(initialValue: number | undefined) {
        return orgObser(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    mask: Number,
                    min: 0,  // 00:00
                    max: 4320 // 72:00
                }
            });
    },
    observableClock: function(initialValue: number | undefined) {
        return orgObser(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    mask: Number,
                    min: -720,  // (12h yesterday)
                    max: 2160 // 36:00 (12h tomorow)
                }
            });
    },
    observableNumber: function(initialValue: number | undefined) {
        return orgObser(initialValue)
            .extend({
                required: false
            }).extend({
                $type: {
                    mask: Number
                }
            });
    }
});