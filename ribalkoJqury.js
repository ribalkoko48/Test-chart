var Rj = {
    $: function (css) {
        return document.querySelector(css)
    },
    /*
     * Принимает объект даты
     * Возвращает число количество дней в месяце
     * */
    getDaysInMonth: function (date) {
        var resultDate = new Date(date);

        resultDate.setMonth(date.getMonth() + 1)
        resultDate.setDate(resultDate.getDate() - 1)

        return resultDate.getDate()

    },
    
    findInArray: function(arr, el){
        var res = arr.find(function(item){
                return item == el
            });
        
        return !!res
    },


    /*
     * Принимает css селектор, тип события, и функцию обработчик
     * Получает все элементы по селектору и вешает на каждый событие
     * */
    setListener: function (cssSelector, type, callback) {
        var allElements = document.querySelectorAll(cssSelector);

        allElements.forEach(function (el) {
            el.addEventListener(type, callback);
        })

        return allElements;
    },

    formatDate: function (date, replacer) {
        if(!replacer) replacer = '.'
        return date.getFullYear() + replacer + this.parseInt(date.getMonth() + 1) + replacer + this.parseInt(date.getDate())
    },

    formatDateToURL: function (date) {
        return this.parseInt(date.getDate()) + '.' + this.parseInt(date.getMonth() + 1) + '.' + this.parseInt(date.getFullYear())
    },

    Array_max: function( array ){
    return Math.max.apply( Math, array )
},



    parseInt: function (num) {
        //если число меньше десяти добавить нолик впереди а если нет то вернуть как есть
        return num < 10 ? '0' + num : num
    }

};
