var settings = {
    category: "everyday",
    braselets: ['sport', 'life'],
    date_for: null,
    date_to: null,
    period: "disable",
    viewReport: "user"
};
var arr = [];

//закрытие ранее отрытых выпадающих окон
window.addEventListener('click', closeSelectTypeIfOpen);


var mainList = document.querySelectorAll('.selectType');

mainList.forEach(function (element_LI) {
    element_LI.addEventListener('click', openPropList);
});

//выбор периода
var prop_listliAll = document.querySelectorAll('.prop_list li');

prop_listliAll.forEach(function (element_li) {

    element_li.addEventListener('click', handlerPropList)

})


//закрытие всех окон вне диапазона кнопок
function closeSelectTypeIfOpen() {
    console.log(arr)
    console.log(settings)
    var target = event.target;

    if (!target.closest('.selectType')) {
        closeAllPropLists()
    }

}

function closeAllPropLists() {
    mainList.forEach(function (item) {
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
    e.stopPropagation()

    setPropListValue(e)
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
            document.querySelector('.datePeriod').classList.remove('active')
            settings.date_for = null;
            settings.date_to = null;
        }
    }
    if (selectId == 'viewReport') {
        if (value == 'bracelet') {
            document.querySelector('.checkBox').classList.add('active')
            checkedModelBracelet(e)
        }
        else {
            document.querySelector('.checkBox').classList.remove('active')
            settings.braselets = [];
        }


    }


    e.currentTarget.parentElement.parentElement.querySelector('span').innerHTML = selectedText;
    e.currentTarget.parentElement.classList.remove('active');
}

// Добавление выбранных элементов в объект
//


function setInSettingsObj(e) {
    // название выбранного свойства
    var keyObj = e.target.parentElement.parentElement.id;
// назване атрибута выбранного элемента
    var atrib = 'data-' + keyObj;
// содержимое ключа
    var valueProperty = e.target.getAttribute([atrib]);
//внесение выбранных элементов в объект (ключ(propertyObj) : значение(valueProperty))
    settings[keyObj] = valueProperty;

}

// Добавление checkbox в объект

//от клика по checkbox запуск вычислений
document.querySelector('#braceletModel').addEventListener('click', checkedModelBracelet);

// добавление в объект, в ключ, массив
function checkedModelBracelet() {
    //предварительная отчиска массива
    settings.braselets = [];
//нахождение всех инпутов
    var inputAll = document.querySelectorAll('#braceletModel input:checked');
    //перебор всех для проверки какие checked
    inputAll.forEach(function (item) {
        settings.braselets.push(item.value)
    })

}


//Добавление в объект ручного ввода периода даты

document.querySelector('.date_for').onchange = function (e) {
    keyObj = e.target.className;
    atrib = e.target.value;
    settings[keyObj] = +atrib;
}
document.querySelector('.date_to').onchange = function (e) {
    keyObj = e.target.className;
    atrib = e.target.value;
    settings[keyObj] = +atrib;

}