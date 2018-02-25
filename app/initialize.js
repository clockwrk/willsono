(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // do your setup here
    getJson();
    console.log('Initialized app');
  });

  var jsonData = {},
    currentSelection = [],
    columnOne = document.getElementById('column-1'),
    columnTwo = document.getElementById('column-2'),
    columnThree = document.getElementById('column-3'),
    modal = document.getElementById('modal'),
    close = document.getElementById('close');

  close.addEventListener('click', closeModal);

  function getJson() {
    var request = new XMLHttpRequest();
    request.open('GET', 'products.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        jsonData = JSON.parse(request.responseText);
        currentSelection = jsonData.groups;
        buildProductPage();
      } else {
        console.log('something went wrong')
      }
    }
    request.send();
  }

  function buildProductPage() {
    var distributionCounter = currentSelection.length,
      allProducts = [],
      tabIndexCounter = 4;

    currentSelection.forEach((product) => {
      let item = document.createElement('div'),
        img = document.createElement('img'),
        name = document.createElement('h3'),
        priceRange = document.createElement('b'),
        images = [];

      product.images.forEach((image) => {
        images.push(image.href);
      })
      console.log(images);

      if (product.priceRange) {
        item.setAttribute('data-lowPrice', product.priceRange.selling.low);
        item.setAttribute('data-highPrice', product.priceRange.selling.high);
        priceRange.innerHTML = product.priceRange.selling.low + '$ to ' + product.priceRange.selling.high + '$';
      }

      item.setAttribute('data-name', product.name);
      item.setAttribute('data-images', images.join(','));
      item.className = 'product-detail';
      img.setAttribute('tabIndex', tabIndexCounter);
      img.src = product.hero.href;
      img.alt = product.name
      img.onclick = openModal;
      img.onkeypress = keyActivate;
      name.innerHTML = product.name;

      item.appendChild(img);
      item.appendChild(name);
      item.appendChild(priceRange);

      if (distributionCounter <= currentSelection.length * 1 / 3) {
        columnThree.appendChild(item);
      } else if (distributionCounter <= currentSelection.length * 2 / 3) {
        columnTwo.appendChild(item);
      } else {
        columnOne.appendChild(item);
      }
      distributionCounter--;
      tabIndexCounter++;
    });
  }

  function openModal(e) {
    var imageURLSArray = e.target.parentNode.dataset.images.split(','),
      mainImages = document.getElementById('main-display'),
      thumbnailImages = document.getElementById('thumbnails'),
      imageCounter = 0,
      tabIndexCounter = 25;

    mainImages.innerHTML = "";
    thumbnailImages.innerHTML = "";

    imageURLSArray.forEach((imageURL) => {
      let carouselItem = document.createElement('div'),
        thumbnailItem = document.createElement('div'),
        carouselImage = document.createElement('img'),
        thumbImage = document.createElement('img');

      carouselItem.className = imageCounter === 0 ? 'item active' : 'item';
      thumbnailItem.className = 'thumb';
      thumbnailItem.setAttribute('data-target', '#carousel');
      thumbnailItem.setAttribute('data-slide-to', imageCounter);
      carouselImage.src = imageURL;
      thumbImage.src = imageURL;
      thumbImage.setAttribute('tabIndex', tabIndexCounter);

      carouselItem.appendChild(carouselImage);
      thumbnailItem.appendChild(thumbImage);

      imageCounter++;
      tabIndexCounter++;
      mainImages.appendChild(carouselItem);
      thumbnailImages.appendChild(thumbnailItem);
    })

    modal.style.display = "block";

  }

  function closeModal() {
    modal.style.display = "none";
  }

  function keyActivate(e) {
    console.log('pressing key');
    if(e.keyCode ==13 || e.keyCode == 32){
      openModal(e);
    }

  }


})()
