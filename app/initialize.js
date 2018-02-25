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
      columnThree = document.getElementById('column-3'),
      modal = document.getElementById('modal'),
      close = document.getElementById('close');


  close.addEventListener('click', closeModal);



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
            priceRange = document.createElement('b'),
            images = [];

        product.images.forEach((image) => {
          images.push(image.href);
        })
        console.log(images);

        if(product.priceRange){
          item.setAttribute('data-lowPrice', product.priceRange.selling.low);
          item.setAttribute('data-highPrice', product.priceRange.selling.high);
          priceRange.innerHTML = product.priceRange.selling.low + '$ to ' + product.priceRange.selling.high + '$';
        }

        // console.log(images);

        item.setAttribute('data-name', product.name);
        item.setAttribute('data-images', images.join(','));
        item.className = 'product-detail';
        img.src = product.hero.href;
        img.alt = product.name
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
    // console.log(e.target.parentNode);
    // console.log('open modal here');
    // console.log(modal);
    var imageURLSArray = e.target.parentNode.dataset.images.split(','),
        mainImages = document.getElementById('main-display'),
        thumbnailImages = document.getElementById('thumbnails'),
        imageCounter = 0;

    mainImages.innerHTML = "";
    thumbnailImages.innerHTML = "";
    // console.log(e.target.parentNode.dataset.images);

    imageURLSArray.forEach((imageURL) => {
      let carouselItem = document.createElement('div'),
          thumbnailItem = document.createElement('div'),
          carouselImage = document.createElement('img'),
          thumbImage = document.createElement('img');

      carouselItem.className = imageCounter === 0 ? 'item active':'item';
      thumbnailItem.className = 'thumb';
      thumbnailItem.setAttribute('data-target', '#carousel');
      thumbnailItem.setAttribute('data-slide-to', imageCounter);
      carouselImage.src = imageURL;
      thumbImage.src = imageURL;

      carouselItem.appendChild(carouselImage);
      thumbnailItem.appendChild(thumbImage);

      // thumbnailItem.addEventListener('click', function)

      // console.log(carouselItem, thumbnailItem);
      imageCounter++;
      mainImages.appendChild(carouselItem);
      thumbnailImages.appendChild(thumbnailItem);
      // mainImages[0].appendChild(`<div class="item"> <img src="${imageURL}"> </div>`);
      // thumbnailImages[0].appendChild(`<div data-target="#carousel" data-slide-to="0" class="thumb"><img src="${imageURL}"></div>`)
    })

    modal.style.display = "block";


    // var child = document.createElement('div');
    //     child.className = 'inside';
    // var text = document.createElement('h1');
    //     text.className = 'inside-text';
    //     text.innerHTML = 'Hello Worlds';
    // child.appendChild(text);
    //
    // var modal = new Modal(child, true);
    // modal.show();

  }

  function closeModal(){
    modal.style.display = "none";
  }


})()
