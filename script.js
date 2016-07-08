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

Rj.setListener('.selectType', 'click', openPropList)
Rj.setListener('.prop_list li', 'click', handlerPropList)
Rj.setListener('.checkBox input', 'change', changeItemsInActiveCheckbox);
Rj.setListener('.datePeriod input', 'blur', checkAndSaveDates);

/*
Задача если вдруг ты вундыркинд и сделал все проверки
сделать так чтобы по стрелочкам влево вправо менялся период с ооответствующим интервалом
неделя/месяц/год и тд

 */


//ОБРАБОТЧИК НА БЛЮР ИНПУТОВ С ДАТОЙ - ПРОВЕРКА ПРАВИЛЬНОСТИ ВВОДА показ сообщений запись в settings 

set_DateFrom_setDateTo_In_Settings();


function checkAndSaveDates(){

    //Реализовать проверки

    //Создать в html <p> и показывать ее и определенный текст ошибки вставлять
    //Ясень пень если все гуд сообщалку срыть

    //Если все гуд - создать - записать объект дата в соответствующее свойство setting
    //Обновить даты в периоде


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
            console.log(dateTo.getDate())

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
    //  ?? // Я бы не поставил вставление в это место, формируются даты сразу по нажатию на кнопку.
    // я бы поставил после каждого switch / case

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


