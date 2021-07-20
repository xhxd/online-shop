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
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var db = firebase.firestore();

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

  document.querySelector(".fb__embed").style.display = "none";
}

ui.start("#firebaseui-auth-container", {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
      autoUpgradeAnonymousUsers: true,
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  // Other config options...
});

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "../html/account.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);

var userInfo = [];

var userString = "";

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var uid = user.uid;
    var uName = user.displayName;
    var uEmail = user.email;
    if (user.photoURL !== null) {
      var uPhoto = user.photoURL;
    } else {
      var uPhoto = "../images/blankPP.jpg";
    }
    userInfo.push(uid, uName, uEmail, uPhoto);
    userString = `
      <div class="user__photo">
        <img src=${uPhoto} alt="Avatar" class="avatar">
      </div>
      <br>
      <div class="user__name">
        <h2>Welcome ${uName}</h2>
      </div>
      <br>
      <div class="user__email">
        <p>Your e-mail address is ${uEmail}</p>
      </div>
      <br>
      <button class="signout__button" onclick="signOut()"> Sign Out </button>
    `;

    document.querySelector(".user__info").innerHTML = userString;
    document.querySelector(".company__logo").style.visibility = "hidden";
    document.querySelector(".company__name").style.visibility = "hidden";
    document.querySelector("#firebaseui-auth-container").style.visibility =
      "hidden";

    // ...
  } else {
    document.querySelector(".company__logo").style.visibility = "visible";
    document.querySelector(".company__name").style.visibility = "visible";
    document.querySelector("#firebaseui-auth-container").style.visibility =
      "visible";
    document.querySelector(".user__info").style.display = "none";
    userString = "";
    // User is signed out
    // ...
  }
});

const signOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log("User Signed out");
      userInfo = [];
    })
    .catch((error) => {
      console.log(error);
    });
};

console.log(userInfo);
