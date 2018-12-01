// replace callback support for safari.
if ("a".replace(/a/, function () { return "b" }) != "b") {
    let default_replace = String.prototype.replace;

    String.prototype.replace = function (search: string | RegExp, replace: string | Function) {
        // replace is not function
        if (typeof replace != "function") {
            let searchValue: string = arguments[0],
                replacement: string = arguments[1];

            return default_replace(searchValue, replacement);
        }

        let str = "" + this,
            callback = replace;

        // search string is not RegExp
        if (!(search instanceof RegExp)) {
            var idx = str.indexOf(search);
            return (
                idx == -1 ? str :
                    default_replace.apply(str, [search, callback(search, idx, str)])
            )
        }

        let reg = search,
            result = [],
            lastidx = reg.lastIndex,
            re;

        while ((re = reg.exec(str)) != null) {
            let idx: number = re.index,
                args = re.concat(idx.toString(), str);

            result.push(
                str.slice(lastidx, idx),
                callback.apply(null, args).toString()
            );

            if (!reg.global) {
                lastidx += RegExp.lastMatch.length;
                break
            } else {
                lastidx = reg.lastIndex;
            }
        }

        result.push(str.slice(lastidx));

        return result.join("")
    }
}