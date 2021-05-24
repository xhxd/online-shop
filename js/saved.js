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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var userRemains = [];
    var uName = user.displayName;

    db.collection("saved")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          userRemains.push(doc.data().name);
        });
      });

    console.log(userRemains);
    console.log(uName);

    var n = userRemains.includes(uName);
    console.log(n);
  } else {
    // No user is signed in.
  }
});
