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
