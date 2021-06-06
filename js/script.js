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
      });
    });
};

var tableData = [];

const loadTables = (product) => {
  tableData = [];
  db.collection("products")
    .doc(`${product}`)
    .collection("table")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        tableData.push(doc.data().value);
      });
      tableData.map((element) => {
        console.log(element);
        return `
            <tr>
              <td>${element[0]}</td>
              <td>${element[1]}</td>
            </tr>
        `;
      });
    });
};

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredMachines = dataArr.filter((machine) => {
    return machine.name.toLowerCase().includes(searchString);
  });
  displayMachines(filteredMachines);
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
    <div class="product__button">
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

const productsDetails = (e) => {
  loadTables();
  var choosenMachineName = e.querySelector(".product__name > p").innerHTML;
  var choosenMachineImage = e.querySelector(".product__image > img.src");
  console.log(choosenMachineName);

  const filteredOneMachine = machineData.filter((machine) => {
    return (
      machine.name.includes(choosenMachineName) ||
      machine.image.includes(choosenMachineImage)
    );
  });

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
                            <p>Model Number: UWFM-01C, UWF4-02C</p>
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
                            <p>srkarim2003@gmail.com</p>
                        </div>
                        <div class="contact__info">
                            <p>Phone no.</p>
                            <p>+8801911476829</p>
                        </div>
                        <div class="contact__info">
                            <p>WhatsApp</p>
                            <p>+8801911476829</p>
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
                    ${loadTables(choosenMachineName)}
                    </table>
                    <img src=${item.image2} alt="">
                </div>
            </div>
    `;
  });
  document.querySelector(".products").innerHTML = htmlString;
};

loadMachines();
