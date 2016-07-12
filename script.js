"use strict";


var data;

var settings = {
    category: "every_day",
    braseletsCheckbox: {
        isActive: false,
        activeItems: ['Sport']
    },
    usersCheckbox: {
        isActive: true,
        activeItems: ['with_devices'] //without_devices
    },

    reportType: "user",
    period: "week"
};




//закрытие ранее отрытых выпадающих окон
window.addEventListener('click', closeSelectTypeIfOpen);

Rj.setListener('.selectType', 'click', openPropList);
Rj.setListener('.prop_list li', 'click', handlerPropList);
Rj.setListener('.checkBox input', 'change', changeItemsInActiveCheckbox);
Rj.setListener('.datePeriod input', 'blur', checkAndSaveDates);
Rj.setListener('.periodArrowWrap', 'click', H1_Button_ChangePeriod)

set_DateFrom_setDateTo_In_Settings();

getDataFromServer()


function checkAndSaveDates(e) {
    Rj.$('.correctionDate').classList.remove('active');

    var value = e.target.value,
        checkedDate = e.target.classList.value;

    var arrDates = value.split('.');

    //Перебор изменяемого элемента в "Моя Дата"
    var date = new Date();

    //проверка число или нет
    var year = arrDates[0],
        month = arrDates[1],
        day = arrDates[2];
    // проверка год

    if(!year || !month || !day){
        show_message('неверный формат даты')
        return
    }

    var regexp = /\D/;

    //проверка на число
    if (year.match(regexp) || month.match(regexp)  || day.match(regexp) ) {
        show_message('допускаются только числа')
        return
    }

    if (year.length !== 4) {
        show_message('год не четыре цифры')
        return
    }

/*    if (year > date.getFullYear()) {
        show_message('год не может быть в будущем')
        return
    }*/

    //проверка месяц
    if (month.length !== 2 || (month >= 12 || month < 0)) {
        show_message('некоректный месяц')
        return
    }

    //проверка день
    if (day.length !== 2 || (day >= 31 && day < 0)) {
        show_message('некоректный день')
        return
    }

    settings[checkedDate] = new Date(value);

    updatePeriodDates()

    function show_message(mes){
        var node = Rj.$('.correctionDate');
        node.classList.add('active')
        node.innerHTML = mes
    }
}

function H1_Button_ChangePeriod(event) {

    //смотрим какая кнопка нажата и вычесляем туда сюда куда мотать
    var factor = event.target.classList.value == 'periodArrow right' ? 1 : -1;


    var date_from = settings.date_from;
    var date_to = settings.date_to;

    switch (settings.period) {
        case 'week':
            date_from.setDate(date_from.getDate() + (factor * 7))
            date_to.setDate(date_to.getDate() + (factor * 7))

            break;
        case 'month':
            date_from.setMonth(date_from.getMonth() + (factor * 1))
            //доделать последний день месяца
            var month = date_from.getMonth();

            date_to.setMonth(month, Rj.getDaysInMonth(date_from))
            break;
        case 'half-year':
            date_from.setMonth(date_from.getMonth() + (factor * 6))
            var month = date_from.getMonth();
            month += factor * 6;
            date_to.setMonth(month, Rj.getDaysInMonth(date_from))
            break;
        case 'year':
            date_from.setFullYear(date_from.getFullYear() + (factor * 1))
            date_to.setFullYear(date_to.getFullYear() + (factor * 1))
            break;
        case 'custom':
            var different = ~~((date_from > date_to ? date_from - date_to : date_to - date_from ) / 1000 / 60 / 60 / 24) + 1 ;

            date_from.setDate(date_from.getDate() + (factor * different))
            date_to.setDate(date_to.getDate() + (factor * different))


            break;

    }

    updateDatesInputs()
    updatePeriodDates()

}

function updatePeriodDates(){
    Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)
}
function updateDatesInputs(){
    Rj.$('.date_from').value = Rj.formatDate(settings.date_from)
    Rj.$('.date_to').value = Rj.formatDate(settings.date_to)
}

//закрытие всех окон вне диапазона кнопок
function closeSelectTypeIfOpen(e) {

    var target = e.target;

    if (!target.closest('.selectType')) {
        closeAllPropLists()
    }

}

function closeAllPropLists() {

    document.querySelectorAll('.selectType').forEach(function (item) {
        item.querySelector('.prop_list').classList.remove('active');
    })
}

// обработчик событий для окрытия выпадающих окон
function openPropList() {
    closeAllPropLists();

    // закрываем если было открыто
    var ulNode = this.querySelector('.prop_list');

    if (ulNode.classList.contains("active")) {
        ulNode.classList.remove('active');
    } else {
        ulNode.classList.add('active');
    }


}

function handlerPropList(e) {
    e.stopPropagation();

    setPropListValue(e);
    setInSettingsObj(e)

}

// замена подписи на кнопке
function setPropListValue(e) {
    var selectedText = e.currentTarget.innerHTML,
        selectId = e.target.parentElement.parentElement.id,
        value = e.currentTarget.getAttribute('data-' + selectId);

    //если клик по периоду и если выбран пункт "выбочрочно"
    if (selectId == 'period') {
        if (value == 'custom') {
            document.querySelector('.datePeriod').classList.add('active')
        }
        else {
            document.querySelector('.datePeriod').classList.remove('active');
        }
    }

    if (selectId == 'reportType') {
        if (value == 'bracelet') {
            settings.braseletsCheckbox.isActive = true;
            settings.usersCheckbox.isActive = false

        } else {
            settings.braseletsCheckbox.isActive = false;
            settings.usersCheckbox.isActive = true
        }

        updateActiveCheckboxInDOM();

    }

    e.currentTarget.parentElement.parentElement.querySelector('span').innerHTML = selectedText;
    e.currentTarget.parentElement.classList.remove('active');
}

function setInSettingsObj(e) {
    // название выбранного свойства
    var keyObj = e.target.parentElement.parentElement.id;
// назване атрибута выбранного элемента
    var atrib = 'data-' + keyObj;
// содержимое ключа
    var valueProperty = e.target.getAttribute([atrib]);
//внесение выбранных элементов в объект (ключ(propertyObj) : значение(valueProperty))
    settings[keyObj] = valueProperty;

    if (keyObj == 'period') {

        set_DateFrom_setDateTo_In_Settings()
    }

}

// Добавление checkbox в разделе "Вид отчета" в объект settings={}

function changeItemsInActiveCheckbox(e) {

    var inputName = e.currentTarget.getAttribute('name'),
        chekedInputs = document.querySelectorAll('input[name=' + inputName + ']:checked');

    settings[inputName].activeItems = [];

    chekedInputs.forEach(function (el) {
        settings[inputName].activeItems.push(el.getAttribute('value'))
    })
}

// Добавление объекта даты (date_from и date_to)в settings
function set_DateFrom_setDateTo_In_Settings() {

    var periodChecked = settings.period;

    var dateFrom = new Date(),
        dateTo = new Date();

    switch (periodChecked) {
        case 'week':
            var todayNumberDay = dateFrom.getDay();

            dateFrom.setDate(dateFrom.getDate() - (todayNumberDay - 1));
            dateTo.setDate(dateFrom.getDate() + 6);

            break;
        case 'month':
            dateFrom.setDate(1);
            dateTo.setDate(Rj.getDaysInMonth(dateFrom))

            break;
        case 'half-year':
            dateFrom.setMonth(0, 1);
            dateTo.setMonth(6, -0);

            break;
        case 'year':
            dateFrom.setMonth(0, 1);
            dateTo.setFullYear(dateTo.getFullYear() + 1, 0, -0);

            break;
        case 'custom':
            updateDatesInputs()

            return
    }

    //вставляем в значения в setings
    settings.date_from = dateFrom;
    settings.date_to = dateTo;

    Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)

}
// Добавление выбранных элементов в объект
//
function updateActiveCheckboxInDOM() {

    if (settings.braseletsCheckbox.isActive) {
        document.querySelector('#checkboxForBraceletModels').classList.add('active')
    } else {
        document.querySelector('#checkboxForBraceletModels').classList.remove('active')
    }

    if (settings.usersCheckbox.isActive) {
        document.querySelector('#checkboxForUsersType').classList.add('active')
    } else {
        document.querySelector('#checkboxForUsersType').classList.remove('active')
    }

}

function getDataFromServer(){

    var xhr = new XMLHttpRequest();

    var url = 'http://localhost:8008/reports/api/v1/user_analysis_report_data?&date_from=05.01.2016&date_to=11.05.2016&tz_seconds=10800&format=json';

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)

        if (this.status != 200) {
            // обработать ошибку
            console.eroor( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
            return;
        }

        data = JSON.parse(this.response).result

        console.log(data)

        redrawChart()
    }


    xhr.open('GET', url, true);

    xhr.send();
}


function redrawChart(){
    console.log('рисуем график по данным и по выбранным сетингам')
}
