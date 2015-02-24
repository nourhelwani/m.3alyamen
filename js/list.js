(function (window) {

    var list = (function () {
        function list(params) {
            this.items = [];
        }
        list.prototype = {
            add: function (item) {
                this.items.push(item);
            },
            remove: function (item) {
                alert('dsa');
                var indexOf = this.items.indexOf(item);
                if (indexOf != -1) {
                    this.items.splice(indexOf, 1);
                }
            },
            find: function (callback, action) {
                var callbackReturn,
                     items = this.items,
                     length = this.items.length,
                     matches = [],
                     i = 0;

                for (; i < length ; i++) {
                    callbackReturn = callback(items[i], i);
                    if (callbackReturn) {
                        matches.push(items[i]);
                    }
                }
                if (action) {
                    action.call(this, matches);
                }

                return matches;
            }
        };
        return list;
    })();

    list.Create = function (params) {
        return new list(params);
    }
    window.list = list;
})(window);