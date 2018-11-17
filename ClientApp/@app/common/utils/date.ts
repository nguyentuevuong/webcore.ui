import { ko } from '@app/providers';

export class date {
    /** get index of day in week (start: 0 = Sunday) */
    public static zeller(day: number, month: number, year: number) {
        return new Date(year, month - 1, day).getDay();
        //return ((13 * ((month < 3) ? (month + 10) : (month - 2)) - 1) / 5 + (year % 100) / 4 + Math.floor(year / 100) / 4 + day + (year % 100) - 2 * Math.floor(year / 100)) % 7;
    }

    /** check year is leap or not (1: true, 0: false) */
    public static isLeap(year: number) {
        return new Date(year, 2, 0).getDate() > 28;
        //return ((year % 4) || ((year % 100 === 0) && (year % 400))) ? 0 : 1;
    }

    /** get number of days in month */
    public static daysInMonth(month: number, year: number) {
        return new Date(year, month, 0).getDate();
        //return (month === 2) ? (28 + date.isLeap(year)) : 31 - (month - 1) % 7 % 2;
    }

    /** render days in month as array */
    public static daysMatrix(month: number, year: number) {
        let utils = ko.utils,
            firstDate: Date = utils.date.utc(year, month, 1),
            startIndex: number = utils.date.utc(year, month, 1).getDay();

        utils.date.addDays(firstDate, -(startIndex + 1));

        return utils.range(0, 41).map(() => utils.date.addDays(firstDate, 1));
    }

    public static daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    public static monthsInYear = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    // Regexes and supporting functions are cached through closure 
    public static format(date: Date, mask?: string, utc?: boolean) {
        let token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val: String | number, len?: number) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            }, masks: {
                [key: string]: string
            } = {
                "default": "ddd mmm dd yyyy HH:MM:ss",
                shortDate: "m/d/yy",
                mediumDate: "mmm d, yyyy",
                longDate: "mmmm d, yyyy",
                fullDate: "dddd, mmmm d, yyyy",
                shortTime: "h:MM TT",
                mediumTime: "h:MM:ss TT",
                longTime: "h:MM:ss TT Z",
                isoDate: "yyyy-mm-dd",
                isoTime: "HH:MM:ss",
                isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
                isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
            }, i18n = {
                dayNames: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ],
                monthNames: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ]
            };

        mask = String(masks[mask || ''] || mask || masks["default"]);

        // Allow setting the utc argument via the mask
        mask = mask.replace(/^(UTC:)/, () => { utc = true; return ''; });

        let d: number = utc ? date.getUTCDate() : date.getDate(),
            D: number = utc ? date.getUTCDay() : date.getDay(),
            m: number = utc ? date.getUTCMonth() : date.getMonth(),
            y: number = utc ? date.getUTCFullYear() : date.getFullYear(),
            H: number = utc ? date.getUTCHours() : date.getHours(),
            M: number = utc ? date.getUTCMinutes() : date.getMinutes(),
            s: number = utc ? date.getUTCSeconds() : date.getSeconds(),
            L: number = utc ? date.getUTCMilliseconds() : date.getMilliseconds(),
            o: number = utc ? 0 : date.getTimezoneOffset(),
            flags: {
                [key: string]: any
            } = {
                d: d,
                dd: pad(d),
                ddd: i18n.dayNames[D],
                dddd: i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: i18n.monthNames[m],
                mmmm: i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop()!.replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : Number(d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, $0 => $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1));
    }
}