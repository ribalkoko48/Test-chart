var  Rj = {

  setListener: function(cssSelector, type, callback){
      //�� ����� �� ����� ������ "��� ������"
      var allElements = document.querySelectorAll(cssSelector);

      allElements.forEach(function(el){
          el.addEventListener(type, callback);
      })

      return allElements;
  }

};
