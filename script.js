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
    date_for: null,
    date_to: null,
    reportType: "user",
    period: "week"
};


//закрытие ранее отрытых выпадающих окон
window.addEventListener('click', closeSelectTypeIfOpen);

Rj.setListener('.selectType', 'click', openPropList )
Rj.setListener('.prop_list li', 'click', handlerPropList )
Rj.setListener('.checkBox input', 'change', changeItemsInActiveCheckbox);


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
            document.querySelector('.datePeriod').classList.remove('active')
            settings.date_for = null;
            settings.date_to = null;
        }
    }

    if (selectId == 'reportType') {
        if (value == 'bracelet') {
            settings.braseletsCheckbox.isActive = true
            settings.usersCheckbox.isActive = false

        } else {
            settings.braseletsCheckbox.isActive = false
            settings.usersCheckbox.isActive = true
        }

        updateActiveCheckboxInDOM()

        //checkedModelBracelet(e)
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

}

// Добавление checkbox в разделе "Вид отчета" в объект settings={}






function changeItemsInActiveCheckbox(e) {
    //Вариант 1
    /*var inputName = e.currentTarget.getAttribute('name'),
        chekedInputs = document.querySelectorAll('input[name=' + inputName + ']:checked');

    settings[inputName].activeItems = []

    chekedInputs.forEach(function(el){
        settings[inputName].activeItems.push(el.getAttribute('value'))
    })*/

    //Вариант 2
    var inputName = e.currentTarget.getAttribute('name');
    if(e.target.checked){//Удалился или добавлися как чекнутый
        settings[inputName].activeItems.push(e.target.value)
    } else {
        settings[inputName].activeItems.forEach(function(item, i , list){
            if (item === e.target.value){
                list.splice(i, 1)
            }
        })
    }
}


//Добавление в объект ручного ввода периода даты

document.querySelector('.date_for').onchange = function (e) {
    keyObj = e.target.className;
    atrib = e.target.value;
    settings[keyObj] = +atrib;
};
document.querySelector('.date_to').onchange = function (e) {
    keyObj = e.target.className;
    atrib = e.target.value;
    settings[keyObj] = +atrib;

};














































// Добавление выбранных элементов в объект
//
function updateActiveCheckboxInDOM(){

    if(settings.braseletsCheckbox.isActive){
        document.querySelector('#checkboxForBraceletModels').classList.add('active')
    } else {
        document.querySelector('#checkboxForBraceletModels').classList.remove('active')
    }

    if(settings.usersCheckbox.isActive){
        document.querySelector('#checkboxForUsersType').classList.add('active')
    } else {
        document.querySelector('#checkboxForUsersType').classList.remove('active')
    }

}