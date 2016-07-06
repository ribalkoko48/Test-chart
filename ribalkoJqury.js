var  Rj = {

  setListener: function(cssSelector, type, callback){
      //от клика по любой област "Вид отчета"
      var allElements = document.querySelectorAll(cssSelector);

      allElements.forEach(function(el){
          el.addEventListener(type, callback);
      })

      return allElements;
  }

};
