// внешние переменные для графика

var responseData = [];
var promt = 0;
var daySize = 14;
//Ключ не повторения
var isChartInPage = false;
// Внешние переменные
//var NodWeek; //= document.querySelector('#chetyre1');
//var NodMonth; //= document.querySelector('#chetyre2');
//var NodYouDay; //= document.querySelector('#chetyre3');
//var namber1;
//var namber2;
// Цвет столбцов
var color0 = "#fafafa";
var color1 = "#ffffff";
var stepX;
var stepPoint;
// Координаты ломанной линии
var poliLineMassiv = [];

//Корректировка размера даты от величины диаграммы
var stepKorekt;


// Выключатель Checked
//document.getElementById('namber1').addEventListener('focus', stopChecked);
//document.getElementById('namber2').addEventListener('focus', stopChecked);
/*function stopChecked() {
 NodWeek.checked = false;
 NodMonth.checked = false;
 }*/
// __конец__ внешних переменных для графика


var server_data;

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

getDataFromServer();


function checkAndSaveDates(e) {
    Rj.$('.correctionDate').classList.remove('active');

    var value = e.target.value,
        checkedDate = e.target.classList.value;

    var arrDates = value.replace(/ /g, '.').split('.');

    //Перебор изменяемого элемента в "Моя Дата"
    var date = new Date();

    //проверка число или нет
    var year = arrDates[0],
        month = arrDates[1],
        day = arrDates[2];
    // проверка год

    if (!year || !month || !day) {
        show_message('неверный формат даты')
        return
    }

    var regexp = /\D/;

    //проверка на число
    if (year.match(regexp) || month.match(regexp) || day.match(regexp)) {
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
    if (month.length !== 2 || (month >= 13 || month < 0)) {
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

    function show_message(mes) {
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
            var different = ~~((date_from > date_to ? date_from - date_to : date_to - date_from ) / 1000 / 60 / 60 / 24) + 1;

            date_from.setDate(date_from.getDate() + (factor * different))
            date_to.setDate(date_to.getDate() + (factor * different))


            break;

    }

    updateDatesInputs()
    updatePeriodDates()

}

function updatePeriodDates() {
    Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)
}
function updateDatesInputs() {
    Rj.$('.date_from').value = Rj.formatDate(settings.date_from)
    Rj.$('.date_to').value = Rj.formatDate(settings.date_to)
}

//закрытие всех окон вне диапазона кнопок
function closeSelectTypeIfOpen(e) {
    getDataFromServer()
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
            console.info('ошибка на переходе года назад')
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

function getDataFromServer() {

    var xhr = new XMLHttpRequest();

    var url = 'http://192.168.0.145:8008/reports/api/v1/user_analysis_report_data?&date_from=' + Rj.formatDateToURL(settings.date_from) + '&date_to=' + Rj.formatDateToURL(settings.date_to) + '&tz_seconds=10800&format=json';
//05.01.2016
    //11.05.2016
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)

        if (this.status != 200) {
            // обработать ошибку
            console.error('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
            return;
        }

        server_data = JSON.parse(this.response).result


        redrawChart()
    }


    xhr.open('GET', url, true);

    xhr.send();
}

// ___ГРАФИК____
function redrawChart() {

    console.log(server_data)
    offFun()


    //	namber1 = +document.getElementById('namber1').value;
    //namber2 = +document.getElementById('namber2').value;
    stepX = 0;
    stepPoint = 0;

    poliLineMassiv.length = 0;


    for (var i = 0; i < server_data.device.length; i++) {
        responseData.push(server_data.device[i])
    }
    stepKorekt = responseData.length


    /*  console.info('Запустилась функция отрисовки графика')
     if (isChartInPage) {
     console.log('нельзя рисовать дважды поэтому вышли')
     return
     }*/


    // Местонахождение <svg>
    var svgNod = document.querySelector('svg');
    //Создадим объект <g> для графика
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // Перекрывающий объект для точек
    var g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');


    // шаг
    stepPoint = 1024 / stepKorekt;


    // Основная функция
    for (var i = 0; i < responseData.length; i++) {

         if (!responseData[i]) continue

        //Внутренние переменные
        var CircHeight = responseData[i].totals.every_day;

        // Формула определения координат кружков
        var cyCircl = Math.round(((((CircHeight / 100) - 1) * -1) * 100) * 4.44)
        // Какая дата? text
        var data = responseData[i].metric_date;

        poliLineMassiv.push(Math.round(( stepX + stepPoint / 2) * 100) / 100)
        poliLineMassiv.push(cyCircl)


        // Отправка узлов в нужной очередности в Nod
        g.appendChild(addRect(i))
        g.appendChild(addSpan(i))
        g2.appendChild(addCircl(i, cyCircl))

        // Повтор графика off
        isChartInPage = true;

    }

    g.appendChild(lineSvg(i))


    svgNod.appendChild(g)
    svgNod.appendChild(poliLn(i))
    svgNod.appendChild(g2)
}

// Отчиска графика (Nod)
function offFun() {
    var svgNod = document.querySelector('svg');
    //Опустошили содержимое SVG
    svgNod.innerHTML = '';
    // Повтор графика on
    isChartInPage = false;
    responseData = [];
    console.info('чистка графика')

};

//Ломанная линия координат
function poliLn() {

    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#909090');
    polyline.setAttribute('points', poliLineMassiv);

    return polyline;
}
// Прямая лини горизонта
function lineSvg(ln) {

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 444);
    line.setAttribute('x2', stepX);
    line.setAttribute('y2', 444);
    line.setAttribute('stroke-width', 2);
    line.setAttribute('stroke', "#909090");

    return line;
}

// Отрисовка даты под линией горизонта
function addSpan(i) {
    var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('x', Math.round(( stepX - stepPoint / 2) * 100) / 100);
    tspan.setAttribute('y', 469);
    tspan.innerHTML = responseData[i].metric_date.substr(0,10).split('-').join('.');



    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Roboto');
    text.setAttribute('font-size', daySize);
    text.setAttribute('fill', "#000000");
    text.appendChild(tspan);

    return text;
};
// Отрисовка столбцов графика
function addRect(i) {
    //выбор цвета столбца
    var color = i % 2 == 0 ? color0 : color1;

    //формируем столбец
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', stepX)
    rect.setAttribute('y', 0)
    rect.setAttribute('width', stepPoint)
    rect.setAttribute('height', 494)
    rect.setAttribute('fill', color)
    stepX += stepPoint;
    return rect;
};
// Отрисовка точек на графике
function addCircl(i, cy) {

    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', Math.round(( stepX - stepPoint / 2) * 100) / 100);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 5);
    circle.setAttribute('stroke', '#1581A5');
    circle.setAttribute('stroke-width', 2);
    circle.setAttribute('fill', "#FFFFFF");

    return circle;
};



