var Rj = {

    /*
     * Принимает объект даты
     * Возвращает число количество дней в месяце
     * */
    getDaysInMonth: function(date) {
            var resultDate = new Date( date );

            resultDate.setMonth(date.getMonth() + 1)
            resultDate.setDate(resultDate.getDate() - 1)

            return resultDate.getDate()

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
    }

};
