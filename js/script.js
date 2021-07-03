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

var dataArr = [];
var machineData = [];
const searchBar = document.querySelector(".search__bar");

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

var tableData = [];
var tableString = "";

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

var productionLineArr = [];
var productionData = [];

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

var foodEquipmentArr = [];

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

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();

  var mq = window.matchMedia("(max-width: 425px)");
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

var htmlString = "";

const displayMachines = (machines) => {
  htmlString = machines
    .map((machine) => {
      return `
    <div class="product">
      <div class="product__details" onclick="productsDetails(this)">
        <div class="product__image">
            <img src=${machine.image} alt="" />
        </div>
        <div class="product__info">
            <div class="product__name">
                <p>${machine.name}</p>
            </div>
        </div>
      </div>
    <div class="product__button" data-productName="${machine.name}" onclick="saveProduct(this)">
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

  document
    .querySelector(".header__options--home")
    .addEventListener("mouseover", hoverEffectOver);

  document
    .querySelector(".header__options--home")
    .addEventListener("mouseout", hoverEffectOut);

  document.querySelector(".header__options--home").style.color = "gray";
  document.querySelector(".header__options--home").style.border = "none";
  document.querySelector(".slideshow__container").style.display = "none";
  document.querySelector(".all__dots").style.display = "none";
  document.querySelector(".production__lines").style.display = "none";
  document.querySelector(".food__equipments").style.display = "none";

  var mq = window.matchMedia("(max-width: 425px)");
  var style = "";

  if (mq.matches) {
    document.querySelector(".search").style.visibility = "hidden";

    style = document.createElement("style");
    style.innerHTML = `
      .products {
        max-width: 330px;
      }
    `;
    document.head.appendChild(style);
  } else {
    document.querySelector(".search").style.visibility = "visible";
  }

  loadTables(choosenMachineName);

  console.log(filteredOneMachine);
  htmlString = filteredOneMachine.map((item) => {
    return `
    <div class="machine__details">
                <div class="productDetails__top">
                    <div class="image__1">
                        <img src=${item.image} alt="">
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
                            <div class="save__button">
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
            <img src=${line.image} alt="">
        </div>
    </div>
    `;
    })
    .join("");
  document.querySelector(".all__productions").innerHTML = productionLineString;
};

const productionDetails = (e) => {
  var choosenProductionName = e.querySelector(".line__name > h3").innerHTML;
  console.log(choosenProductionName);

  const filteredOneProduction = productionData.filter((production) => {
    return production.name.includes(choosenProductionName);
  });

  var mq = window.matchMedia("(max-width: 425px)");
  var style = "";

  if (mq.matches) {
    document.querySelector(".search").style.visibility = "hidden";

    style = document.createElement("style");
    style.innerHTML = `
      .products {
        max-width: 330px;
      }
    `;
    document.head.appendChild(style);
  } else {
    document.querySelector(".search").style.visibility = "visible";
  }

  document
    .querySelector(".header__options--home")
    .addEventListener("mouseover", hoverEffectOver);

  document
    .querySelector(".header__options--home")
    .addEventListener("mouseout", hoverEffectOut);

  document.querySelector(".header__options--home").style.color = "gray";
  document.querySelector(".header__options--home").style.border = "none";
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
            <img src=${line.image} alt="">
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
                <div class="save__button">
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

var foodEquipmentString = "";

const displayFoodEquipment = (equipments) => {
  foodEquipmentString = equipments
    .map((equipment) => {
      return `
      <div class="food__equipment">
        <div class="equipment__image">
            <img src=${equipment.image} alt="">
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

var savedProductArray = [];

const saveProduct = (e) => {
  var savedItems = JSON.parse(localStorage.getItem("productName"));

  if (localStorage.length == 0) {
    savedProductArray.push(e.getAttribute("data-productName"));
    localStorage.setItem("productName", JSON.stringify(savedProductArray));
  } else {
    if (savedItems.includes(e.getAttribute("data-productName"))) {
      return;
    } else {
      savedProductArray = [];

      savedItems.map((item) => {
        savedProductArray.push(item);
      });

      savedProductArray.push(e.getAttribute("data-productName"));
      localStorage.setItem("productName", JSON.stringify(savedProductArray));
    }
  }
};

loadMachines();
loadProductionLine();
loadFoodEquipment();
