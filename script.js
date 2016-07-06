var settings = {
    category: "everyday",
    checkbox: ['sport', 'life'],
    date_for: null,
    date_to: null,
    period: "disable",
    scale: "user"
};


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
    var target = event.target;

    if (!target.closest('.selectType')) {
        closeAllPropLists()
    }
    //  console.log(settings)
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

//содержимое объекта
    // console.log(settings)

}

// Добавление checkbox в объект

//обработчик для  checkbox на body (Что не сделай, checkbox отразится в объекте)
document.querySelector('body').addEventListener('click', checkedModelBracelet);

function checkedModelBracelet() {
    //содержимое объекта
    console.log(settings)
    //берем все input в области
    document.querySelectorAll('#braceletModel input').forEach(function (item) {
        //кто выделен = добавляем
        if (item.checked == true) {
            var atrib = item.getAttribute('value');
            var keyObj = item.getAttribute('name');
            settings[keyObj] = atrib;

//кто не выделен = false
        } else {
            atrib = null;
            keyObj = item.getAttribute('name');
            settings[keyObj] = atrib;
            /*//содержимое объекта
             console.log(settings)*/
        }
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