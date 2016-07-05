var settings = {};


//закрытие ранее отрытых выпадающих окон
window.addEventListener('click', closeSelectTypeIfOpen);


var mainList = document.querySelectorAll('.selectType');

mainList.forEach(function (element_LI) {
    element_LI.addEventListener('click', openPropList);
});

//выбор периода
var prop_listliAll = document.querySelectorAll('.prop_list li');

prop_listliAll.forEach(function (element_li) {

    element_li.addEventListener('click', setPropListValue)

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

// замена подписи на кнопке
function setPropListValue(e) {
    var selectedValue = e.currentTarget.innerHTML,
        value = e.currentTarget.getAttribute('data-period');

    //если выбран пункт "мой период"
    if (value == 'disable') {
        document.querySelector('.disable').classList.add('activeMyDay')
    }
var attr = e.target.getAttribute('data-period');
    if (attr == 'week'|| attr == 'month'|| attr == 'half-year' || attr == 'year') {

        document.querySelector('.disable').classList.remove('activeMyDay')
           settings.date_for = null;
            settings.date_to = null;
    }

    this.parentElement.parentElement.querySelector('span').innerHTML = selectedValue;
    this.parentElement.classList.remove('active');


    e.stopPropagation()
}

// Добавление выбранных элементов в объект
//

//находим все li + обработчик
document.querySelectorAll('.prop_list li').forEach(function (select_il) {
    select_il.addEventListener('click', setEventAnObject)
})

function setEventAnObject(e) {
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