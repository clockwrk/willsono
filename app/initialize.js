(function (){
  document.addEventListener('DOMContentLoaded', () => {
    // do your setup here
    getJson();

    console.log('Initialized app');
  });

  var jsonData = [];

  function getJson() {
    var request = new XMLHttpRequest();
    request.open('GET', 'products.json', true);

    request.onload =function() {
      if (request.status >= 200 && request.status < 400){
        var jsonData = JSON.parse(request.responseText);
        console.log(jsonData);
      }else {
        console.log('something went wrong')
      }
    }
    request.send();
  }
})()
