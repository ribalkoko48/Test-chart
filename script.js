var mainList = document.querySelectorAll('.selectType');

mainList.forEach(function (element_LI) {
    element_LI.addEventListener('click', openPropList);
});


//выбор периода
var prop_listliAll = document.querySelectorAll('.prop_list li');

prop_listliAll.forEach(function (element_li) {
    element_li.addEventListener('click', setPropListValue)
})

// замена подписи на кнопке
function setPropListValue(e) {
    var selectedValue = this.innerHTML;


    this.parentElement.parentElement.querySelector('span').innerHTML = selectedValue;
    this.parentElement.classList.remove('active');

    e.stopPropagation()
}


// обработчик событий для окрытия выпадающих окон
function openPropList() {
    closeAllPropLists();

    // закрываем если было открыто
    var ulNode = this.querySelector('.prop_list')

    if (ulNode.classList.contains("active")) {
        ulNode.classList.remove('active');
    } else {
        ulNode.classList.add('active');
    }


}
//закрытие ранее отрытых выпадающих окон
window.addEventListener('click', closeSelectTypeIfOpen);

//закрытие всех окон вне диапазона кнопок
function closeSelectTypeIfOpen(event) {
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


//