(function() {


  var jsonData = {},
    currentSelection = [],
    columnOne = document.getElementById('column-1'),
    columnTwo = document.getElementById('column-2'),
    columnThree = document.getElementById('column-3'),
    modal = document.getElementById('modal'),
    close = document.getElementById('close');

  var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
  };

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
      tabIndexCounter = 10     ;

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
    e.target.blur();
    var imageURLSArray = e.target.parentNode.dataset.images.split(','),
      mainImages = document.getElementById('main-display'),
      thumbnailImages = document.getElementById('thumbnails'),
      imageCounter = 0,
      tabIndexCounter = 1;

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
      thumbImage.onkeypress = thumbnailActivate;

      carouselItem.appendChild(carouselImage);
      thumbnailItem.appendChild(thumbImage);

      imageCounter++;
      tabIndexCounter++;
      mainImages.appendChild(carouselItem);
      thumbnailImages.appendChild(thumbnailItem);
    })

    modal.style.display = "block";
    thumbnailImages.firstChild.firstChild.focus();
    thumbnailImages.lastChild.firstChild.onblur = tabTrap;

    close.addEventListener('click', closeModal);
    close.setAttribute('tabIndex', 0);
    close.onblur = tabBegin;
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function keyActivate(e,second) {
    e.preventDefault();
    if(e.keyCode === 13 || e.keyCode == 32){
      openModal(e);
    }
  }

  function thumbnailActivate(e) {
    e.preventDefault();
    if(e.keyCode === 13 || e.keyCode === 32){
      dispatchMouseEvent(e.target, 'click', true, true);
    }
  }

  function tabTrap(e) {
    e.preventDefault();
    close.focus();
  }

  function tabBegin(e) {
    var thumbnailImages = document.getElementById('thumbnails');
    e.preventDefault();
    thumbnailImages.firstChild.firstChild.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // do your setup here
    getJson();
    console.log('Initialized app');
  });
})()
