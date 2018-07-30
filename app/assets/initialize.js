(function($) {
    let jsonData = {},
        currentSelection = [],
        body = document.getElementsByTagName('body'),
        columnOne = document.getElementById('column-1'),
        columnTwo = document.getElementById('column-2'),
        columnThree = document.getElementById('column-3'),
        modal = document.getElementById('modal'),
        close = document.getElementById('close'),
        filters = document.getElementById('filters');

    //retrieves json and begins product page creation
    function getJson() {
        let request = new XMLHttpRequest();
        request.open('GET', 'products.json', true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                jsonData = JSON.parse(request.responseText);
                currentSelection = jsonData.groups;
                buildProductPage();
                showPage();
            } else {
                console.log('something went horribly wrong');
            }
        }
        request.send();
    }

    //creates product detail cards and adds them to the columns
    function buildProductPage() {
        let distributionCounter = currentSelection.length,
            allProducts = [],
            tabIndexCounter = 0;

        columnOne.innerHTML = "";
        columnTwo.innerHTML = "";
        columnThree.innerHTML = "";

        currentSelection.forEach((product) => {
            let item = document.createElement('div'),
                img = document.createElement('input'),
                name = document.createElement('h3'),
                productLink = document.createElement('a'),
                priceRange = document.createElement('b'),
                images = [];

            product.images.forEach((image) => {
                images.push(image.href);
            })

            if (product.priceRange) {
                item.setAttribute('data-lowPrice', product.priceRange.selling.low);
                item.setAttribute('data-highPrice', product.priceRange.selling.high);
                priceRange.innerHTML = product.priceRange.selling.low + '$ to ' + product.priceRange.selling.high + '$';
                priceRange.className = 'price';
            }

            img.src = product.hero.href;
            img.alt = product.name;
            img.setAttribute('type', 'image');

            img.onmousedown = openModal;
            img.onkeypress = keyActivate;
            productLink.innerHTML = product.name;
            productLink.setAttribute('href', product.links.www);
            productLink.setAttribute('target', '_blank');
            name.className = 'name';
            name.appendChild(productLink);

            item.setAttribute('data-name', product.name);
            item.setAttribute('data-images', images.join(','));
            item.className = 'product-detail';
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

    //dynamically creates modal/carousel for each product
    function openModal(e) {
        let imageURLSArray = e.target.parentNode.dataset.images.split(','),
            mainImages = document.getElementById('main-display'),
            thumbnailImages = document.getElementById('thumbnails'),
            carousel = document.getElementById('carousel'),
            imageCounter = 0,
            tabIndexCounter = 1;

        mainImages.innerHTML = "";
        thumbnailImages.innerHTML = "";

        imageURLSArray.forEach((imageURL) => {
            let carouselItem = document.createElement('div'),
                thumbnailItem = document.createElement('div'),
                carouselImage = document.createElement('img'),
                thumbImage = document.createElement('img'),
                leftArrow = document.createElement('span'),
                rightArrow = document.createElement('span');


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
        $('.carousel').carousel('cycle');

        thumbnailImages.firstChild.firstChild.focus();
        thumbnailImages.lastChild.firstChild.onblur = tabTrap;

        close.addEventListener('click', closeModal);
        close.setAttribute('tabIndex', 0);
        close.onblur = tabBegin;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function dispatchMouseEvent(target, var_args) {
        let e = document.createEvent("MouseEvents");
        e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
    };

    function closeModal() {
        $('.carousel').carousel('pause');
        modal.style.display = "none";
    }

    function keyActivate(e, second) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            openModal(e);
        }
    }

    function thumbnailActivate(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            dispatchMouseEvent(e.target, 'click', true, true);
        }
    }

    function tabTrap(e) {
        close.focus();
    }

    function tabBegin(e) {
        let thumbnailImages = document.getElementById('thumbnails');
        e.preventDefault();
        thumbnailImages.firstChild.firstChild.focus();
    }

    function sortby(e) {
      if(e.target.classList.contains("checkboxes")) {

        let productsWithprices = [],
            productsWithoutPrices = [];

          if(e.target.value === "alphabet"){
            currentSelection.sort(function(a, b){
              if(a.name < b.name) return -1;
              if(a.name > b.name) return 1;
                return 0;
            })

            buildProductPage()
          }else if(e.target.value === "Highest"){
            productsWithPrices = currentSelection.filter( x => !!x.priceRange);
            productsWithoutPrices = currentSelection.filter( x => !x.priceRange);

            productsWithPrices.sort(function(a, b){
              if(a.priceRange.selling.high > b.priceRange.selling.high) return 1;
              if(a.priceRange.selling.high < b.priceRange.selling.high) return -1;

                return 0;

            })


            currentSelection = productsWithPrices.concat(productsWithoutPrices);

            buildProductPage()
          }else if(e.target.value === "Lowest"){
            productsWithprices = currentSelection.filter( x => !!x.priceRange);
            productsWithoutPrices = currentSelection.filter( x => !x.priceRange);

            productsWithPrices.sort(function(a, b){
                if(a.priceRange.selling.low > b.priceRange.selling.low) return 1;
                if(a.priceRange.selling.low < b.priceRange.selling.low) return -1;

                return 0;
            })

            currentSelection = productsWithPrices.concat(productsWithoutPrices);

            buildProductPage()
          }
      }
    }

    function showPage() {
      document.getElementsByClassName('brunch')[0].classList.remove("loading-page")
      document.getElementsByClassName("loader")[0].classList.remove("loader")


    }

    filters.addEventListener("click", sortby);

    document.addEventListener('DOMContentLoaded', () => {
        getJson();
        showPage();
    });
})(jQuery);
