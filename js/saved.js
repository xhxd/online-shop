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
var auth = firebase.auth();
var db = firebase.firestore();

var productsArr = [];

const loadMachines = async () => {
  db.collection("products")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
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

var productionData = [];

const loadProductionLine = async () => {
  db.collection("productionLine")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        productionData.push(doc.data());
      });
    });
};

var savedThings;
var savedProduction;

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
                    <li><img src="../images/Logo2.png" alt="" class="headerMenu__logo" /></li>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="./aboutus.html">About Us</a></li>
                    <li><a href="./saved.html">Bookmarks</a></li>
                    <li><a href="./account.html">Account</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  `;
  document.querySelector(".header").innerHTML = headerHTML;
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var userRemains = [];
    var uName = user.displayName;

    savedThings = JSON.parse(localStorage.getItem("productName"));
    savedProduction = JSON.parse(localStorage.getItem("productionName"));
    console.log(savedThings);
    console.log(savedProduction);

    var htmlString = "";
    var productionString = "";

    const displaySaved = (saves) => {
      htmlString = saves
        .map((save) => {
          return `
        <div class="saved__product">
          <div class="savedProduct__details" onclick="allProductDetails(this)">
            <img src=${save.image}
              alt="" class="savedProduct__image">
            <p class="savedProduct__name">${save.name}</p>
          </div>
          <button class="savedProduct__button" data-savedName="${save.name}" onclick="removeItem(this)">Delete</button>
        </div>
        `;
        })
        .join("");
      document.querySelector(".saved__products").innerHTML = htmlString;
    };

    const displaySavedProduction = (saves) => {
      productionString = saves
        .map((save) => {
          return `
        <div class="saved__product" >
          <div class="savedProduct__details" onclick="productionDetails(this)">
            <img src=${save.image}
                alt="" class="savedProduct__image">
            <p class="savedProduct__name">${save.name}</p>
          </div>
          <button class="savedProduct__button" data-savedName="${save.name}" onclick="removeProduction(this)">Delete</button>
        </div>
        `;
        })
        .join("");
      document.querySelector(".saved__production").innerHTML = productionString;
    };

    console.log(productsArr);
    console.log(productionData);

    loadMachines();
    loadProductionLine();
    displaySaved(savedThings);
    displaySavedProduction(savedProduction);

    if (savedThings.length == 0 && savedProduction.length == 0) {
      document.querySelector(
        ".saved__products"
      ).innerHTML = `<h2>No Saved Products 😶</h2>`;

      var style = document.createElement("style");
      style.innerHTML = `
        .saved__products {
          width: 100%;
          text-align: center;
        }
  
        .right__part {
          width: 100%;
          height: 100vh;
          align-items: center;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    document.querySelector(
      ".saved__products"
    ).innerHTML = `<h2>Sign in to see the saved products (Go to Accounts page)</h2>`;

    var style = document.createElement("style");
    style.innerHTML = `
      .saved__products {
        width: 100%;
        text-align: center;
      }

      .right__part {
        width: 100%;
        height: 100vh;
        align-items: center;
      }
    `;
    document.head.appendChild(style);
  }
});

var filteredProduct = [];

const removeItem = (e) => {
  filteredProduct = [];
  let removeName = e.getAttribute("data-savedName");
  console.log(removeName);

  savedThings = JSON.parse(localStorage.getItem("productName"));

  filteredProduct = savedThings.filter((thing) => {
    return !thing.name.includes(removeName);
  });

  console.log(filteredProduct);

  e.parentElement.style.display = "none";

  localStorage.setItem("productName", JSON.stringify(filteredProduct));
};

var filteredProduction = [];

const removeProduction = (e) => {
  filteredProduction = [];
  let removeName = e.getAttribute("data-savedName");
  console.log(removeName);

  savedProduction = JSON.parse(localStorage.getItem("productionName"));

  filteredProduction = savedProduction.filter((thing) => {
    return !thing.name.includes(removeName);
  });

  console.log(filteredProduction);

  e.parentElement.style.display = "none";

  localStorage.setItem("productionName", JSON.stringify(filteredProduction));
};

function hoverEffectOver() {
  document.querySelector(".header__options--saved").style.color = "#e31e25";
}

function hoverEffectOut() {
  document.querySelector(".header__options--saved").style.color = "grey";
}

var detailsString = "";

const allProductDetails = (e) => {
  var choosenMachineName = e.querySelector(".savedProduct__name").innerHTML;
  var choosenMachineImage = e.querySelector(".savedProduct__image.src");
  console.log(choosenMachineName);

  const filteredOneMachine = productsArr.filter((machine) => {
    return (
      machine.name.includes(choosenMachineName) ||
      machine.image.includes(choosenMachineImage)
    );
  });

  var mq = window.matchMedia("(max-width: 425px)");
  var style = "";

  if (mq.matches) {
    style = document.createElement("style");
    style.innerHTML = `
          .products {
            max-width: 330px;
          }
          .saved__products {
            margin-top: 30px;
          }
        `;
    document.head.appendChild(style);
  } else {
    style = document.createElement("style");
    style.innerHTML = `
          .saved__products {
            margin-top: 30px;
          }
        `;
    document.head.appendChild(style);

    document
      .querySelector(".header__options--saved")
      .addEventListener("mouseover", hoverEffectOver);

    document
      .querySelector(".header__options--saved")
      .addEventListener("mouseout", hoverEffectOut);

    document.querySelector(".header__options--saved").style.color = "gray";
    document.querySelector(".header__options--saved").style.border = "none";
  }

  document.querySelector(".saved__production").style.display = "none";
  document.querySelector(".title").style.display = "none";

  loadTables(choosenMachineName);

  console.log(filteredOneMachine);
  detailsString = filteredOneMachine.map((item) => {
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
  document.querySelector(".saved__products").innerHTML = detailsString;
};

const productionDetails = (e) => {
  var choosenProductionName = e.querySelector(".savedProduct__name").innerHTML;
  console.log(choosenProductionName);

  const filteredOneProduction = productionData.filter((production) => {
    return production.name.includes(choosenProductionName);
  });

  var mq = window.matchMedia("(max-width: 425px)");
  var style = "";

  if (mq.matches) {
    style = document.createElement("style");
    style.innerHTML = `
      .products {
        top: 30px;
        margin: 20px;
        margin-top: 20px
      }
    `;
    document.head.appendChild(style);
  } else {
    style = document.createElement("style");
    style.innerHTML = `
          .saved__products {
            margin-top: 30px;
          }
        `;
    document.head.appendChild(style);

    document
      .querySelector(".header__options--saved")
      .addEventListener("mouseover", hoverEffectOver);

    document
      .querySelector(".header__options--saved")
      .addEventListener("mouseout", hoverEffectOut);

    document.querySelector(".header__options--saved").style.color = "gray";
    document.querySelector(".header__options--saved").style.border = "none";
  }

  document.querySelector(".saved__products").style.display = "none";
  document.querySelector(".title").style.display = "none";

  console.log(filteredOneProduction);
  detailsString = filteredOneProduction.map((line) => {
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
  document.querySelector(".saved__production").innerHTML = detailsString;
};
