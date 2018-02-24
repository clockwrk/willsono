(function (){
  document.addEventListener('DOMContentLoaded', () => {
    // do your setup here
    getJson();
    console.log('Initialized app');
  });

  var jsonData = {},
      currentSelection = [],
      columnOne = document.getElementById('column-1'),
      columnTwo = document.getElementById('column-2'),
      columnThree = document.getElementById('column-3');


  function getJson() {
    var request = new XMLHttpRequest();
    request.open('GET', 'products.json', true);

    request.onload =function() {
      if (request.status >= 200 && request.status < 400){
        jsonData = JSON.parse(request.responseText);
        currentSelection = jsonData.groups;
        buildProductPage();

      }else {
        console.log('something went wrong')
      }
    }
    request.send();


  }

  function buildProductPage() {
      var distributionCounter = currentSelection.length,
                  allProducts = [];

      currentSelection.forEach((product) => {
        let item = document.createElement('div'),
            img = document.createElement('img'),
            name = document.createElement('h3'),
            priceRange = document.createElement('b');
            console.log(product.priceRange)

        if(product.priceRange){
          item.setAttribute('data-lowPrice', product.priceRange.selling.low);
          item.setAttribute('data-highPrice', product.priceRange.selling.high);
          priceRange.innerHTML = product.priceRange.selling.low + '$ to ' + product.priceRange.selling.high + '$';
        }

        item.setAttribute('data-name', product.name);
        item.className = 'product-detail';
        img.src = product.hero.href;
        img.onclick = openModal;
        name.innerHTML = product.name;

        item.appendChild(img);
        item.appendChild(name);
        item.appendChild(priceRange);

        if(distributionCounter <= currentSelection.length * 1/ 3) {
          columnThree.appendChild(item);
        } else if(distributionCounter <= currentSelection.length * 2/3){
          columnTwo.appendChild(item);
        } else {
          columnOne.appendChild(item);
        }
        distributionCounter --;
      });
  }

  function openModal(e) {
    console.log(e.target.parent);
    console.log('open modal here');
  }


})()
