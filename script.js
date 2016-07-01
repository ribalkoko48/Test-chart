
var mainList = document.querySelectorAll('.selectType');

console.log(mainList)

mainList.forEach(function(element_LI){
    element_LI.addEventListener('click', periodScreen);
})


function periodScreen() {
    var ulNode = this.querySelector('.prop_list');
   
    if (ulNode.style.display == "none") {
        ulNode.style.display = "block";
    }
    else {
        ulNode.style.display = "none";
    }

}

