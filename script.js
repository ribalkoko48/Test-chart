var settings = {
    category: "everyday",
    braseletsCheckbox: {
        isActive: false,
        activeItems: ['Sport']
    },
    usersCheckbox: {
        isActive: true,
        activeItems: ['user']
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
Rj.setListener('.preiodArrowWrap', 'click', H1_Button_ChangePeriod)


/*
 Задача если вдруг ты вундыркинд и сделал все проверки
 сделать так чтобы по стрелочкам влево вправо менялся период с ооответствующим интервалом
 неделя/месяц/год и тд

 */


//ОБРАБОТЧИК НА БЛЮР ИНПУТОВ С ДАТОЙ - ПРОВЕРКА ПРАВИЛЬНОСТИ ВВОДА показ сообщений запись в settings

set_DateFrom_setDateTo_In_Settings();


function checkAndSaveDates() {

    var number;
    var year;
    var month;
    var day;
    var checkedDate = event.target.classList.value;

    if (checkedDate === 'date_from') {
        number = Rj.$('.date_from').value;
    }
    else {
        number = Rj.$('.date_to').value;
    }

    var arrDateFrom = number.split('.');


//Перебор изменяемого элемента в "Моя Дата"
    arrDateFrom.forEach(function (iteam, i) {
        var date = new Date();
//проверка число или нет
        if (!isNaN(iteam)) {
// проверка год
            if (i == 0) {
                if (iteam.length == 4) {
                    if (iteam <= date.getFullYear()) {
                        year = iteam;
                    }
                }
            }
//проверка месяц
            if (i == 1) {
                if (iteam.length == 2) {
                    if (iteam <= 12 && iteam > 0) {
                        month = iteam;
                    }
                }
            }
//проверка день
            if (i == 2) {
                if (iteam.length == 2) {
                    if (iteam <= 31 && iteam > 0) {
                        day = iteam;
                    }
                }
            }
        }
// если чего-то нет
        if (year === undefined || month === undefined || day === undefined) {
            Rj.$('.correctionDate').classList.add('active')
        }
        //если все хорошо, убираем подсказку и вложение в settings
        else {
            Rj.$('.correctionDate').classList.remove('active');
            var settingDate = new Date(year, month, day)
            settings[checkedDate] = settingDate;
        }
    })

}

function H1_Button_ChangePeriod() {

//смотрим какая кнопка нажата
    var znak;
    var leftOrRightButton = event.target.classList.value;

    if (leftOrRightButton == 'periodArrow right') {
        znak = '1';
    }
    else {
        znak = '-1';

    }


// определение нынешнего периода

    if (settings.period == 'week') {
        var date_from = settings.date_from;
        var date_to = settings.date_to;
        date_from.setDate(date_from.getDate() + (znak * 7))
        date_to.setDate(date_to.getDate() + (znak * 7))
        Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)
    }
    else if (settings.period == 'month') {
        date_from = settings.date_from;
        date_to = settings.date_to;
        date_from.setMonth(date_from.getMonth() + (znak * 1))
        //доделать последний день месяца
        var month = date_from.getMonth()
        date_to.setMonth(month, Rj.getDaysInMonth(date_from))
        Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)
    }
    else if (settings.period == 'half-year') {
        date_from = settings.date_from;
        date_to = settings.date_to;
        date_from.setMonth(date_from.getMonth() + (znak * 6))
        var month = date_from.getMonth()
        month += znak * 6;
        date_to.setMonth(month, Rj.getDaysInMonth(date_from))
        Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)


    }
    else if (settings.period == 'year') {
        date_from = settings.date_from;
        date_to = settings.date_to;
        date_from.setFullYear(date_from.getFullYear() + (znak * 1))
        date_to.setFullYear(date_to.getFullYear() + (znak * 1))
        Rj.$('#date_period').innerHTML = Rj.formatDate(settings.date_from) + ' - ' + Rj.formatDate(settings.date_to)
        console.info('Начальный период')
        console.log(date_from.getFullYear())
        console.log(date_from.getMonth())
        console.log(date_from.getDate())

        console.info('конец')
        console.log(date_to.getFullYear())
        console.log(date_to.getMonth())
        console.log(date_to.getDate())
    }
    else {
        console.info('Что тут делать?')
    }


// выбираем число изменений периода


    //конец функции
}

//закрытие всех окон вне диапазона кнопок
function closeSelectTypeIfOpen(e) {
    console.log(settings)
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
    valueProperty = e.target.getAttribute([atrib]);
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
            Rj.formatDate(settings.date_from)
            Rj.$('.date_from').value = Rj.formatDate(settings.date_from)
            Rj.$('.date_to').value = Rj.formatDate(settings.date_to)

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


