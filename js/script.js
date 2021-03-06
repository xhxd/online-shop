//Firebase Config
var firebaseConfig = {
  apiKey: "AIzaSyCFSZ1C89OeY1Bm5L_ytmv4Bu3qpsuhadQ",
  authDomain: "online-shop-d228b.firebaseapp.com",
  projectId: "online-shop-d228b",
  storageBucket: "online-shop-d228b.appspot.com",
  messagingSenderId: "1046697458709",
  appId: "1:1046697458709:web:3e7f7392d5d0d143b1e21c",
  measurementId: "G-9W2X5676P2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
var auth = firebase.auth();

//Declaring the variables
var dataArr = [];
var machineData = [];
const searchBar = document.querySelector(".search__bar");

//Loading the machines
const loadMachines = async () => {
  db.collection("products")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        dataArr.push(doc.data());
        machineData.push(doc.data());
        console.log(machineData);
        displayMachines(dataArr);
        console.log(doc.id);
      });
    });
};

//Declaring the tables
var tableData = [];
var tableString = "";

//Loading the machine tables
const loadTables = (product) => {
  tableData = [];
  console.log(product.replace(" and ", " & "));
  db.collection("products")
    .doc(product.replace(" and ", " & "))
    .collection("table")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        tableData.push(doc.data().value);
      });
      tableString = tableData
        .map((element) => {
          console.log(element);
          return `
            <tr>
              <td>${element[0]}</td>
              <td>${element[1]}</td>
            </tr>
        `;
        })
        .join("");
      document.querySelector(".dataTable").innerHTML = tableString;
    });
};

//Declaring the Production array
var productionLineArr = [];
var productionData = [];

//Loading the Production lines
const loadProductionLine = () => {
  db.collection("productionLine")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        productionLineArr.push(doc.data());
        productionData.push(doc.data());
        console.log(productionLineArr);
        displayProductionLine(productionLineArr);
      });
    });
};

//Declaring the food equipment array
var foodEquipmentArr = [];

//Loading the food equipments
const loadFoodEquipment = () => {
  db.collection("foodEquipment")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        foodEquipmentArr.push(doc.data());
        console.log(foodEquipmentArr);
        displayFoodEquipment(foodEquipmentArr);
      });
    });
};

//Making the header responsive
var mMedia = window.matchMedia("(max-width: 770px)");
var headerHTML = "";

if (mMedia.matches) {
  headerHTML = `
    <div class="menu-wrap">
        <input type="checkbox" class="toggler">
        <div class="hamburger">
            <div></div>
        </div>
        <div class="menu">
            <div>
                <div>
                    <ul>
                    <li><img src="images/Logo2.png" alt="" class="headerMenu__logo" /></li>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="html/aboutus.html">About Us</a></li>
                    <li><a href="html/saved.html">Bookmarks</a></li>
                    <li><a href="html/account.html">Account</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  `;
  document.querySelector(".header").innerHTML = headerHTML;
}

//The slideshow part
var slideIndex = 1;
showSlides(slideIndex);

window.setInterval(plusSlidesInTime, 10000);

function plusSlidesInTime() {
  plusSlides(1);
}

//Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.querySelectorAll(".mySlides");
  var dots = document.querySelectorAll(".dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//The search bar function
searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();

  var mq = window.matchMedia("(max-width: 770px)");
  var style = "";

  if (mq.matches) {
    style = document.createElement("style");
    style.innerHTML = `
      .products {
        margin-top: 80px;
      }
    `;
    document.head.appendChild(style);
  }

  if (searchString !== "") {
    document.querySelector(".slideshow__container").style.display = "none";
    document.querySelector(".all__dots").style.display = "none";
    document.querySelector(".productionLines__heading").style.visibility =
      "hidden";
    document.querySelector(".foodEquipments__heading").style.visibility =
      "hidden";
    document.querySelector(".food__equipments").style.display = "unset";
    document.querySelector(".production__lines").style.display = "unset";
  } else {
    document.querySelector(".slideshow__container").style.display = "unset";
    document.querySelector(".all__dots").style.display = "unset";
    document.querySelector(".productionLines__heading").style.visibility =
      "visible";
    document.querySelector(".foodEquipments__heading").style.visibility =
      "visible";
    document.querySelector(".food__equipments").style.display = "unset";
    document.querySelector(".production__lines").style.display = "unset";
    document.querySelector(".header__options--home").style.color = "#e31e25";
    document.querySelector(".header__options--home").style.border =
      "0 5px 0 0 solid #e31e25";
  }
  const filteredMachines = dataArr.filter((machine) => {
    return machine.name.toLowerCase().includes(searchString);
  });

  const filteredProduction = productionLineArr.filter((machine) => {
    return machine.name.toLowerCase().includes(searchString);
  });

  const filteredEquipments = foodEquipmentArr.filter((machine) => {
    return machine.name.toLowerCase().includes(searchString);
  });

  displayMachines(filteredMachines, filteredProduction);
  displayProductionLine(filteredProduction);
  displayFoodEquipment(filteredEquipments);
});

console.log(dataArr);

//Displaying the Machines
var htmlString = "";

const displayMachines = (machines) => {
  htmlString = machines
    .map((machine) => {
      return `
    <div class="product">
      <div class="product__details" onclick="productsDetails(this)">
        <div class="product__image">
            <img src=${machine.image} alt=${machine.name} />
        </div>
        <div class="product__info">
            <div class="product__name">
                <p>${machine.name}</p>
            </div>
        </div>
      </div>
    <div class="product__button" data-productName="${machine.name}" data-productImage="${machine.image}" onclick="saveProduct(this)">
        <div class="button__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                class="bi bi-bookmarks" viewBox="0 0 16 16">
                <path
                    d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z" />
                <path
                    d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z" />
            </svg>
        </div>
        <div class="button__text">
            <h4>SAVE</h4>
        </div>
    </div>
  </div>
    `;
    })
    .join("");
  document.querySelector(".products").innerHTML = htmlString;
};

function hoverEffectOver() {
  document.querySelector(".header__options").style.color = "#e31e25";
}

function hoverEffectOut() {
  document.querySelector(".header__options").style.color = "grey";
}

//Displaying the product details
const productsDetails = (e) => {
  var choosenMachineName = e.querySelector(".product__name > p").innerHTML;
  var choosenMachineImage = e.querySelector(".product__image > img.src");
  console.log(choosenMachineName);

  const filteredOneMachine = machineData.filter((machine) => {
    return (
      machine.name.includes(choosenMachineName) ||
      machine.image.includes(choosenMachineImage)
    );
  });

  document.querySelector(".slideshow__container").style.display = "none";
  document.querySelector(".all__dots").style.display = "none";
  document.querySelector(".production__lines").style.display = "none";
  document.querySelector(".food__equipments").style.display = "none";

  var mq = window.matchMedia("(max-width: 770px)");
  var mqMob = window.matchMedia("(max-width: 425px)");
  var style = "";

  if (mqMob.matches) {
    style = document.createElement("style");
    style.innerHTML = `
      .products {
        max-width: 330px;
      }
    `;
    document.head.appendChild(style);
  }

  if (mq.matches) {
    document.querySelector(".search").style.visibility = "hidden";
  } else {
    document.querySelector(".search").style.visibility = "visible";
    document
      .querySelector(".header__options--home")
      .addEventListener("mouseover", hoverEffectOver);

    document
      .querySelector(".header__options--home")
      .addEventListener("mouseout", hoverEffectOut);

    document.querySelector(".header__options--home").style.color = "gray";
    document.querySelector(".header__options--home").style.border = "none";
  }

  loadTables(choosenMachineName);

  console.log(filteredOneMachine);
  htmlString = filteredOneMachine.map((item) => {
    return `
    <div class="machine__details">
                <div class="productDetails__top">
                    <div class="image__1">
                        <img src=${item.image} alt=${item.name}>
                    </div>
                    <div class="all__description">
                        <div class="name">
                            <h3>
                                ${item.name}
                            </h3>
                        </div>
                        <br>
                        <br>
                        <div class="model__number">
                            <p>Model Number: ${item.availableModels}</p>
                        </div>
                        <br>
                        <br>
                        <div class="description">
                            <h3>Description</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                    <div class="contact">
                        <h3>Contact us to get a detailed quotation with price</h3>
                        <br>
                        <div class="contact__info">
                            <p>E-mail</p>
                            <a href="mailto:srkarim2003@yahoo.com">srkarim2003@yahoo.com</a>
                        </div>
                        <div class="contact__info">
                            <p>Phone no.</p>
                            <a href="tel:+8801911476829">+8801911476829</a>
                        </div>
                        <div class="contact__info">
                            <p>WhatsApp</p>
                            <a href="https://wa.me/+8801911476829" target="_blank">+8801911476829</a>
                        </div>
                        <div class="contact__info">
                            <p>WeChat</p>
                            <p>+8801911476829</p>
                        </div>
                        <br>
                        <br>
                        <div class="save__part" style="display:flex; justify-content:center;">
                            <div class="save__button" data-productName="${item.name}" data-productImage="${item.image}" onclick="saveProduct(this)">
                                <div class="save__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                        class="bi bi-bookmarks" viewBox="0 0 16 16">
                                        <path
                                            d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z" />
                                        <path
                                            d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z" />
                                    </svg>
                                </div>
                                <div class="save__text">
                                    <h4>SAVE</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="productDetails__bottom">
                    <table class="dataTable">
                    </table>
                    <img src=${item.image2} alt="">
                </div>
            </div>
    `;
  });
  document.querySelector(".products").innerHTML = htmlString;
};

//Displaying the production lines
var productionLineString = "";

const displayProductionLine = (lines) => {
  productionLineString = lines
    .map((line) => {
      return `
      <div class="production__line" onclick="productionDetails(this)">
        <div class="line__name">
            <h3>${line.name}</h3>
        </div>
        <div class="line__image">
            <img src=${line.image} alt=${line.name}>
        </div>
    </div>
    `;
    })
    .join("");
  document.querySelector(".all__productions").innerHTML = productionLineString;
};

//Displaying the production line details
const productionDetails = (e) => {
  var choosenProductionName = e.querySelector(".line__name > h3").innerHTML;
  console.log(choosenProductionName);

  const filteredOneProduction = productionData.filter((production) => {
    return production.name.includes(choosenProductionName);
  });

  var mq = window.matchMedia("(max-width: 770px)");
  var style = "";

  if (mq.matches) {
    document.querySelector(".search").style.visibility = "hidden";

    style = document.createElement("style");
    style.innerHTML = `
      .products {
        top: 30px;
        margin: 10px;
      }
    `;
    document.head.appendChild(style);
  } else {
    document.querySelector(".search").style.visibility = "visible";

    document
      .querySelector(".header__options--home")
      .addEventListener("mouseover", hoverEffectOver);

    document
      .querySelector(".header__options--home")
      .addEventListener("mouseout", hoverEffectOut);

    document.querySelector(".header__options--home").style.color = "gray";
    document.querySelector(".header__options--home").style.border = "none";
  }

  document.querySelector(".slideshow__container").style.display = "none";
  document.querySelector(".all__dots").style.display = "none";
  document.querySelector(".production__lines").style.display = "none";
  document.querySelector(".food__equipments").style.display = "none";

  console.log(filteredOneProduction);
  htmlString = filteredOneProduction.map((line) => {
    return `
      <div class="machine__details">
        <div class="productionDetails__top">
          <div class="production__image">
            <img src=${line.image} alt=${line.name}>
          </div>
            <div class="production__contacting">
                <div class="production__name">
                    <h2>${line.name}</h2>
                </div>
                <br>
                <h3>Contact us to get a detailed quotation with price</h3>
                <br>
                <table>
                    <tr>
                        <td>E-mail</td>
                        <td><a href="mailto:srkarim2003@yahoo.com" style="color: #f74258;">srkarim2003@yahoo.com</a></td>
                    </tr>
                    <tr>
                        <td>Phone no.</td>
                        <td><a href="tel:+8801911476829" style="color: #f74258;">+8801911476829</a></td>
                    </tr>
                    <tr>
                        <td>WhatsApp</td>
                        <td><a href="https://wa.me/+8801911476829" target="_blank" style="color: #f74258;">+8801911476829</a></td>
                    </tr>
                    <tr>
                        <td>WeChat</td>
                        <td style="color: #f74258;">+8801911476829</td>
                    </tr>
                </table>
                <div class="save__part" style="display:flex; justify-content:center; width:60%; margin-top:20px;">
                <div class="save__button"data-productName="${line.name}" data-productImage="${line.image}" onclick="saveProduction(this)">
                    <div class="save__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            class="bi bi-bookmarks" viewBox="0 0 16 16">
                            <path
                                d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z" />
                            <path
                                d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z" />
                        </svg>
                    </div>
                    <div class="save__text">
                        <h4>SAVE</h4>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <div class="productionDetails__bottom">
        <div class="production__description">
            <strong>
                <p>Product Description:</p>
            </strong>
            <p>${line.description}</p>
        </div>
        <br>
        <div class="production__specs">
            <strong>Raw Material: </strong>
            ${line.rawMaterial}
        </div>
        <br>
        <div class="production__specs">
            <strong>Final Products: </strong>
            ${line.finalProduct}
        </div>
        <br>
        <div class="production__specs">
            <strong>Machine Material: </strong>
            ${line.machineMaterial}
        </div>
        <br>
        <div class="production__specs">
            <strong>Electricity Component Brand: </strong>
            ${line.electricityComponentBrand}
        </div>
        <br>
    </div>
    </div>
    `;
  });
  document.querySelector(".products").innerHTML = htmlString;
};

//Displaying food equipments
var foodEquipmentString = "";

const displayFoodEquipment = (equipments) => {
  foodEquipmentString = equipments
    .map((equipment) => {
      return `
      <div class="food__equipment">
        <div class="equipment__image">
            <img src=${equipment.image} alt=${equipment.name}>
        </div>
        <div class="equipment__name">
            <p>${equipment.name}</p>
        </div>
      </div>
    `;
    })
    .join("");
  document.querySelector(".all__equipments").innerHTML = foodEquipmentString;
};

//Saving the products
var savedProductArray = [];
var savedItemTruth = [];

const saveProduct = (e) => {
  var savedItems = JSON.parse(localStorage.getItem("productName"));
  savedItemTruth = [];
  for (let sItem in savedItems) {
    savedItemTruth.push(
      savedItems[sItem].name == e.getAttribute("data-productName")
    );
  }
  console.log(savedItemTruth);

  const truthVerifier = (element) => element == true;
  var truth = savedItemTruth.some(truthVerifier);
  console.log(truth);
  //console.log(savedItemName);

  if (localStorage.length == 0) {
    savedProductArray = [];

    savedProductArray.push({
      name: e.getAttribute("data-productName"),
      image: e.getAttribute("data-productImage"),
    });
    localStorage.setItem("productName", JSON.stringify(savedProductArray));
  } else {
    if (truth === true) {
      return;
    } else {
      savedProductArray = [];

      savedItems.map((item) => {
        savedProductArray.push(item);
      });

      savedProductArray.push({
        name: e.getAttribute("data-productName"),
        image: e.getAttribute("data-productImage"),
      });
      localStorage.setItem("productName", JSON.stringify(savedProductArray));
    }
  }
};

var savedProductionArray = [];
var savedProductionTruth = [];

const saveProduction = (e) => {
  var savedProduction = JSON.parse(localStorage.getItem("productionName"));
  savedProductionTruth = [];
  for (let sItem in savedProduction) {
    savedProductionTruth.push(
      savedProduction[sItem].name == e.getAttribute("data-productName")
    );
  }
  console.log(savedProductionTruth);

  const truthVerifierProduction = (element) => element == true;
  var truthProduction = savedProductionTruth.some(truthVerifierProduction);
  console.log(truthProduction);
  //console.log(savedItemName);

  if (localStorage.getItem("productionName") === null) {
    savedProductionArray = [];

    savedProductionArray.push({
      name: e.getAttribute("data-productName"),
      image: e.getAttribute("data-productImage"),
    });
    localStorage.setItem(
      "productionName",
      JSON.stringify(savedProductionArray)
    );
  } else {
    if (truthProduction === true) {
      return;
    } else {
      savedProductionArray = [];

      savedProduction.map((item) => {
        savedProductionArray.push(item);
      });

      savedProductionArray.push({
        name: e.getAttribute("data-productName"),
        image: e.getAttribute("data-productImage"),
      });
      localStorage.setItem(
        "productionName",
        JSON.stringify(savedProductionArray)
      );
    }
  }
};

loadMachines();
loadProductionLine();
loadFoodEquipment();
