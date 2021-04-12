


// //Keys
// import { firebaseConfig } from './keys.js';

let firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
console.log(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// retrieve from firebase
const database = firebase.firestore();


function cryptoRender() {
  
  let apiCall = fetch(`https://data.messari.io/api/v1/assets?with-metrics`);
  apiCall
  .then(res => res.json())
  .then(results => {
    for(let i = 0; i < results.data.length; i++) {
      console.log(`Crypto: ${results.data[i].symbol}`);
      console.log(`Price USD: ${results.data[i].metrics.market_data.price_usd}`);
      console.log(`1hr % Change: ${results.data[i].metrics.market_data.percent_change_usd_last_1_hour}`);
      console.log(`24hr Volume: ${results.data[i].metrics.market_data.volume_last_24_hours}`);    
      console.log(`Tagline: ${results.data[i].profile.tagline}`);
      console.log(`Category: ${results.data[i].profile.category}`);
      console.log(`Sector: ${results.data[i].profile.sector}`);
      console.log(``);
    
      let article = document.createElement('article');
      article.innerHTML = `
        <article class="article">
          <section class="featuredImage">
            
          </section>
          <section class="articleContent">
              <h3>${results.data[i].symbol}</h3></a>
              <h6>${results.data[i].profile.tagline}</br></h6>
              <h6>Category:</br> ${results.data[i].profile.category}</h5>
              <h6>Sector:</br> ${results.data[i].profile.sector}</br></h5>

              <button class="btn-1" 
                data-symbol="${results.data[i].symbol}" 
                data-tag="${results.data[i].profile.tagline}"
                data-category="${results.data[i].profile.category}" 
                data-sector="${results.data[i].profile.sector}" 
                data-price="${results.data[i].metrics.market_data.price_usd}" 
                data-hrChange="${results.data[i].metrics.market_data.percent_change_usd_last_1_hour}" 
                data-dayVolume="${results.data[i].metrics.market_data.volume_last_24_hours}" 
              type="button">
                Add to Favorites
              </button>

          </section>
          <section class="impressions">
            Price USD:</br>${results.data[i].metrics.market_data.price_usd}</br></br>
            1hr % Change:</br>${results.data[i].metrics.market_data.percent_change_usd_last_1_hour}</br></br>
            24hr Volume:</br>${results.data[i].metrics.market_data.volume_last_24_hours}
          </section>
          <div class="clearfix"></div>
        </article>
      `;
      document.getElementById('main').appendChild(article);

      document.addEventListener('click', function(event) {
        sendFirebase(event);
      });
    }
  })
  .catch(err => console.log(err));
  //clear out id = "main"
  document.getElementById('main').innerHTML = ''; 
}


//Read firebase data and create favorites DOM
function favRender() {
  
  database.collection("Crypto").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("SYMBOL: " , doc.data().symbol);
      let article = document.createElement('article');
        article.innerHTML = `
          <article class="article">
            <section class="featuredImage">
              
            </section>
            <section class="articleContent">
                <h3>${doc.data().symbol}</h3></a>
                <h6>${doc.data().tagline}</br></h6>
                <h6>Category:</br> ${doc.data().category}</h5>
                <h6>Sector:</br> ${doc.data().sector}</br></h5>

                <button class="btn-2" 
                  data-iddoc="${doc.data().symbol}"
                type="button">
                  Remove
                </button>

            </section>
            <section class="impressions">
              Price USD:</br>${doc.data().price}</br></br>
              1hr % Change:</br>${doc.data().change}</br></br>
              24hr Volume:</br>${doc.data().volume}
            </section>
            <div class="clearfix"></div>
          </article>
        `;
        document.getElementById('main').appendChild(article);

        
    });
  });
}
//Listener for Remove button
document.addEventListener('click', function(event) {
  deleteCrypto(event);
});

//To Firebase
function sendFirebase(event) {
  if (event.target.classList.value.includes('btn-1')){
    event.preventDefault();
    // Add a new document in collection "cities"
    database.collection("Crypto").doc(`${event.target.dataset.symbol}`).set({
      symbol: `${event.target.dataset.symbol}`,
      tagline: `${event.target.dataset.tag}`,
      category: `${event.target.dataset.category}`,
      sector: `${event.target.dataset.sector}`,
      price: `${event.target.dataset.price}`,
      change: `${event.target.dataset.hrchange}`,
      volume: `${event.target.dataset.dayvolume}`
    })
    .then(() => {
      console.log("Document is successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
}

//Clicking Remove in Favorites to delete a document in Firebase
function deleteCrypto(event) {
  if (event.target.classList.value.includes('btn-2')) {
    
    database.collection("Crypto").doc(`${event.target.dataset.iddoc}`).delete().then(() => {
      console.log("Document successfully deleted!");
      document.getElementById('main').innerHTML = '';
      favRender();
      
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });

  }
}


//Sets view option from drop down
function setCrypto(setSourceFunc, text) {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"
  setSourceFunc();
  document.getElementById('sourceChoice').innerHTML = '';
  document.getElementById('sourceChoice').appendChild(document.createTextNode(text));
}


//Clicking Crypto List to populate article list on DOM
document.getElementById('cryptoList').addEventListener('click', (evt) => {
  setCrypto(cryptoRender, ': Crypto List');
});

//Clicking Favorites to populate article list on DOM
document.getElementById('favs').addEventListener('click', (evt) => {
  document.getElementById('main').innerHTML = '';
  setCrypto(favRender, ': Favorites');
});


//Clicking Crypto to populate all articles list on DOM
document.getElementById('cryptoTitle').addEventListener('click', (evt) => {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"
  setCrypto(cryptoRender, '');
});




// Onload populate all articles list on DOM
window.onload = function() {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"
  setCrypto(cryptoRender, '');
  cryptoRender();
}






