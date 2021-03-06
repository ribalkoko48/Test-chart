// внешние переменные для графика
var Data = [];
var daySize = 17;
//Ключ не повторения
var isChartInPage = false;
// Цвет столбцов
var chartHeight = 494,
    gorizont = chartHeight - 50,
    color0 = "#fafafa",
    color1 = "#ffffff",
    stepX,
    stepPoint;

//массивы для определения масштаба диагарммы
var arrWith_devicesEvery_day = [];
var arrWithout_devicesEvery_day = [];

// Координаты ломанной линии
var poliLineMassiv_with_devices = [];
var poliLineMassiv_without_devices = [];

//Корректировка размера даты от величины диаграммы
var stepKorekt;
// __конец__ внешних переменных для графика


var server_data;

var settings = {
    category: "every_day",
    braseletsCheckbox: {
        isActive: false,
        activeItems: ['SPORT'],
        allItems: ['SPORT', 'LIFE', 'LIFE01', 'LIFE05']
    },
    usersCheckbox: {
        isActive: true,
        activeItems: ['with_devices'],
        allItems: ['with_devices', 'without_devices']
    },
    reportType: "user", //bracelet
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
    getDataFromServer()

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
            var month = date_from.getMonth();
            date_to.setFullYear(date_from.getFullYear(), date_from.getMonth(), Rj.getDaysInMonth(date_from))
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


    getDataFromServer()
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
    console.log('получаем данные')
    getDataFromServer()
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
    } else {
        redrawChart()
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

    checkAndShow(e)

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
            dateTo.setDate(dateFrom.getDate() + (Rj.getDaysInMonth(dateFrom) - 1))

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
// Взятие данных с сервера
function getDataFromServer() {

    var xhr = new XMLHttpRequest();

    var url = 'http://192.168.0.145:8008/reports/api/v1/user_analysis_report_data?&date_from=' + Rj.formatDateToURL(settings.date_from) + '&date_to=' + Rj.formatDateToURL(settings.date_to) + '&tz_seconds=10800&format=json';

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
// Нужная коллекция для отрисовки графика с пустыми значениями
function getDateCollection() {


    var dateCollection = [], //[ {metric_date: ...} , {metric_date: ...} , {metric_date: ...} , {metric_date: ...}]
        trashDate = new Date(settings.date_from);

    var howManyDays = Math.ceil((settings.date_to - settings.date_from) / 1000 / 60 / 60 / 24) + 1;


    //ФОРМИРУЕМ КОЛЛЕКЦИЮ С ДАТАМИ
    for (var i = 0; i < howManyDays; i++) {


        if (i !== 0) {//если i ноль то мы не прибавим +1
            trashDate.setDate(trashDate.getDate() + 1) //Установка metric date для первого объекта так как первый metric date не +1
        }


        dateCollection.push({
            metric_date: Rj.formatDate(trashDate, '-') //2016-07-16
        })
    }

    server_data.device.forEach(function (item, i) {
        item.metric_date.substr(0, 10)
    })

    //НАПОЛНЯЕМ
    dateCollection.forEach(function (date, i) {

        server_data.device.forEach(function (el) {

            if (el.metric_date.substr(0, 10) === date.metric_date) {
                dateCollection[i].with_devices = el.with_devices
                dateCollection[i].without_devices = el.without_devices

            }

        })

        server_data.device_type.forEach(function (el) {

            if (el.metric_date.substr(0, 10) === date.metric_date) {

                dateCollection[i].SPORT = el.SPORT
                dateCollection[i].LIFE = el.LIFE
                dateCollection[i].LIFE01 = el.LIFE01
                dateCollection[i].LIFE05 = el.LIFE05

            }

        })


    })

    //Data = settings.reportType == 'user' ? server_data.device : server_data.device_type;

    return dateCollection
}
// ___ГРАФИК____
function redrawChart() {


    offFun()


    Data = getDateCollection()

    console.log(Data)


    stepX = 0;
    stepPoint = 0;

    poliLineMassiv_with_devices.length = 0;
    poliLineMassiv_without_devices.length = 0;

    stepKorekt = Data.length

    // Местонахождение <svg>
    var svgNod = document.querySelector('svg');
    //Создадим объект <g> для графика
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // Перекрывающий объект для точек
    var g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var scale = 0;

    // шаг
    stepPoint = 1024 / stepKorekt;

    var activeCheckbox = settings.reportType == 'user' ? settings.usersCheckbox : settings.braseletsCheckbox,
        checkBoxItems = activeCheckbox.allItems,
        dataForPolylines = {},
        MaxValue = 0;

    //Сначала динамически создали массивы для каждого значания в чекбоксе
    checkBoxItems.forEach(function (item) {
        dataForPolylines[item] = []
    })

    //для каждого значания чексбокса собрали массив из объектов и записали value
    for (var i = 0; i < Data.length; i++) {

        checkBoxItems.forEach(function (item) {

            if (!Data[i][item]) {
                return;
            }
            var value = Data[i][item][settings.category];

            if (value > MaxValue) {
                MaxValue = value
            }

        })
    }


    // Основная функция
    for (var i = 0; i < Data.length; i++) {


        var dayGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dayGroup.setAttribute('class', 'dayGroup');

        dayGroup.appendChild(addRect(i, 'transparent'))

        checkBoxItems.forEach(function (item) {

            if (!Data[i][item]) {
                return;
            }
            var value = Data[i][item][settings.category],
                cx = Math.round(( stepX + stepPoint / 2) * 100) / 100,
                cy = Math.round(((((  value / 100) / ( MaxValue / 90) - 1) * -1) * 100) * 4.44);

            dataForPolylines[item].push({
                value: value,
                cx: cx,
                cy: cy

            })

            //!!!Передавать value в параметры кружку и вставлять в нем как аттрибут data-value
            dayGroup.appendChild(addCircl(cx, cy, getClassName(item)))
            dayGroup.appendChild(addSpanOnCircle(i, item, cy, getClassName(item) + ' valueOnCircle'))

            /* g2.appendChild()
             g2.appendChild()*/
        })
// Отправка узлов в нужной очередности в Nod

        dayGroup.appendChild(addMetricDate(i, 'metricDate'))

        g.appendChild(addRect(i))
        g2.appendChild(dayGroup)


        stepX += stepPoint;

/*

        //ЛОГИКА ПОКАЗА ПОДСКАЗКИ TOOLTIP
        //открытие
        dayGroup.addEventListener('mouseenter', function (e) {
            var rectCoords = e.target.getBoundingClientRect();


            //!!!Брать все кружки брать их data-value искать в подсказке по одноменному классу дивы и вставлять в них value

            var tooltip = Rj.$('.tooltip');

            tooltip.classList.add('active')

            if (settings.reportType == "user"){
                Rj.$('.userChecked').classList.add('active')
                 Rj.$('.braceletChecked').classList.remove('active')
            }
            else {
                Rj.$('.userChecked').classList.remove('active')
                 Rj.$('.braceletChecked').classList.add('active')
            }

                      //передача даты в "окно-подсказка"
            tooltip.querySelector('.tooltipMetricDate span').innerHTML = e.target.querySelector('.metricDate').innerHTML
            if (!!e.target.querySelector('.with_devices.valueOnCircle')) {
                tooltip.querySelector('.with_devices  span').innerHTML = e.target.querySelector('.with_devices.valueOnCircle').innerHTML
            }
            else {
                tooltip.querySelector('.with_devices  span').innerHTML = ' ';
            }
            if (!!e.target.querySelector('.without_devices.valueOnCircle')) {
                tooltip.querySelector('.without_devices  span').innerHTML = e.target.querySelector('.without_devices.valueOnCircle').innerHTML
            } else {
                tooltip.querySelector('.without_devices  span').innerHTML = ' ';
            }
            if (!!e.target.querySelector('.SPORT.valueOnCircle')) {
                tooltip.querySelector('.SPORT  span').innerHTML = e.target.querySelector('.SPORT.valueOnCircle').innerHTML
            } else {
                tooltip.querySelector('.SPORT  span').innerHTML = ' ';
            }
            if (!!e.target.querySelector('.LIFE.valueOnCircle')) {
                tooltip.querySelector('.LIFE  span').innerHTML = e.target.querySelector('.LIFE.valueOnCircle').innerHTML
            } else {
                tooltip.querySelector('.LIFE  span').innerHTML = ' ';
            }
            if (!!e.target.querySelector('.SPORT.valueOnCircle')) {
                tooltip.querySelector('.LIFE01  span').innerHTML = e.target.querySelector('.LIFE01.valueOnCircle').innerHTML
            } else {
                tooltip.querySelector('.LIFE01  span').innerHTML = ' ';
            }

            if (!!e.target.querySelector('.LIFE05.valueOnCircle')) {
                tooltip.querySelector('.LIFE05  span').innerHTML = e.target.querySelector('.LIFE05.valueOnCircle').innerHTML
            } else {
                tooltip.querySelector('.LIFE05  span').innerHTML = ' ';
            }
//конец работы с "окном-подсказказок"
            tooltip.style.left = rectCoords.left
        })

        //закрытие
        dayGroup.addEventListener('mouseleave', function (e) {
            Rj.$('.tooltip').classList.remove('active')
        })
*/


    }

    g.appendChild(lineSvg(i))

    svgNod.appendChild(g)
    svgNod.appendChild(g2)
    svgNod.appendChild(g3)

    checkBoxItems.forEach(function (item) {

        var coordsArray = dataForPolylines[item].map(function (el) {
            return el.cx + ',' + el.cy
        });

        svgNod.appendChild(poliLn(coordsArray, getClassName(item)))
    })


    isChartInPage = true;


    function getClassName(item) {
        return Rj.findInArray(activeCheckbox.activeItems, item) ? item + ' active' : item;
    }

// Отчиска графика (Nod)
    function offFun() {
        var svgNod = document.querySelector('svg');
        //Опустошили содержимое SVG
        svgNod.innerHTML = '';
        // Повтор графика on
        isChartInPage = false;

        scale = 0;
        arrWith_devicesEvery_day = [];
        arrWithout_devicesEvery_day = [];
    };

//Ломанная линия координат
    function poliLn(array, className) {

        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('class', className);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#909090');
        polyline.setAttribute('points', array);

        return polyline;
    }


// Прямая лини горизонта
    function lineSvg(ln) {

        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', gorizont);
        line.setAttribute('x2', stepX);
        line.setAttribute('y2', gorizont);
        line.setAttribute('stroke-width', 2);
        line.setAttribute('stroke', "#909090");

        return line;
    }

// Отрисовка даты под линией горизонта
    function addMetricDate(i, className) {
        var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', Math.round(( stepX + stepPoint / 2) * 100) / 100);
        tspan.setAttribute('y', gorizont + 30);
        tspan.setAttribute('class', 'active ' + className)
        tspan.innerHTML = Data[i].metric_date.substr(0, 10).split('-').join('.');



        return textForDiagram(tspan, daySize);
    };

//Отрсовка подписей точек
    function addSpanOnCircle(i, item, cy, className) {
        var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', Math.round(( stepX + stepPoint / 2) * 100) / 100);
        tspan.setAttribute('y', cy - 10);
        tspan.setAttribute('class', className);

        tspan.innerHTML = Data[i][item][settings.category];

        return textForDiagram(tspan, daySize);
    }

// Отрисовка столбцов графика
    function addRect(i, transparent) {

        //выбор цвета столбца
        var color = i % 2 == 0 ? color0 : color1;

        //формируем столбец
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', stepX)
        rect.setAttribute('y', 0)
        rect.setAttribute('width', stepPoint)
        rect.setAttribute('height', chartHeight)
        rect.setAttribute('fill', transparent ? '#000000' : color)


        return rect;
    };


// Отрисовка точек на графике
    function addCircl(cx, cy, className) {

        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', className);
        circle.setAttribute('cx', Math.round(cx));
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 4);
        circle.setAttribute('stroke', '#1581A5');
        circle.setAttribute('stroke-width', 2);
        circle.setAttribute('fill', "#FFFFFF");

        return circle;
    };

}


//Орисовка выбранных в checkBox линий
function checkAndShow(e) {
    var className = e.target.value,
        elements = document.querySelectorAll('.' + className);

    if (e.target.checked) {
        elements.forEach(function (el) {
            el.classList.add('active')
        })
    } else {
        elements.forEach(function (el) {
            el.classList.remove('active')
        })
    }

}

function textForDiagram(tspan, daySize) {

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Roboto');
    text.setAttribute('font-size', daySize);
    text.setAttribute('fill', "#000000");
    text.appendChild(tspan);

    return text;
}
