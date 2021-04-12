parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QdeU":[function(require,module,exports) {
let e={apiKey:"AIzaSyAJLb6DBvl9-0V9oK69638k6OsMjyIVcnA",authDomain:"cryptoga-41764.firebaseapp.com",projectId:"cryptoga-41764",storageBucket:"cryptoga-41764.appspot.com",messagingSenderId:"Y88558198684",appId:"1:88558198684:web:e321b2f96853740587b259"};console.log(e),firebase.initializeApp(e);const t=firebase.firestore();function a(){fetch("https://data.messari.io/api/v1/assets?with-metrics").then(e=>e.json()).then(e=>{for(let t=0;t<e.data.length;t++){console.log(`Crypto: ${e.data[t].symbol}`),console.log(`Price USD: ${e.data[t].metrics.market_data.price_usd}`),console.log(`1hr % Change: ${e.data[t].metrics.market_data.percent_change_usd_last_1_hour}`),console.log(`24hr Volume: ${e.data[t].metrics.market_data.volume_last_24_hours}`),console.log(`Tagline: ${e.data[t].profile.tagline}`),console.log(`Category: ${e.data[t].profile.category}`),console.log(`Sector: ${e.data[t].profile.sector}`),console.log("");let a=document.createElement("article");a.innerHTML=`\n        <article class="article">\n          <section class="featuredImage">\n            \n          </section>\n          <section class="articleContent">\n              <h3>${e.data[t].symbol}</h3></a>\n              <h6>${e.data[t].profile.tagline}</br></h6>\n              <h6>Category:</br> ${e.data[t].profile.category}</h5>\n              <h6>Sector:</br> ${e.data[t].profile.sector}</br></h5>\n\n              <button class="btn-1" \n                data-symbol="${e.data[t].symbol}" \n                data-tag="${e.data[t].profile.tagline}"\n                data-category="${e.data[t].profile.category}" \n                data-sector="${e.data[t].profile.sector}" \n                data-price="${e.data[t].metrics.market_data.price_usd}" \n                data-hrChange="${e.data[t].metrics.market_data.percent_change_usd_last_1_hour}" \n                data-dayVolume="${e.data[t].metrics.market_data.volume_last_24_hours}" \n              type="button">\n                Add to Favorites\n              </button>\n\n          </section>\n          <section class="impressions">\n            Price USD:</br>${e.data[t].metrics.market_data.price_usd}</br></br>\n            1hr % Change:</br>${e.data[t].metrics.market_data.percent_change_usd_last_1_hour}</br></br>\n            24hr Volume:</br>${e.data[t].metrics.market_data.volume_last_24_hours}\n          </section>\n          <div class="clearfix"></div>\n        </article>\n      `,document.getElementById("main").appendChild(a),document.addEventListener("click",function(e){o(e)})}}).catch(e=>console.log(e)),document.getElementById("main").innerHTML=""}function n(){t.collection("Crypto").get().then(e=>{e.forEach(e=>{console.log(e.id," => ",e.data()),console.log("SYMBOL: ",e.data().symbol);let t=document.createElement("article");t.innerHTML=`\n          <article class="article">\n            <section class="featuredImage">\n              \n            </section>\n            <section class="articleContent">\n                <h3>${e.data().symbol}</h3></a>\n                <h6>${e.data().tagline}</br></h6>\n                <h6>Category:</br> ${e.data().category}</h5>\n                <h6>Sector:</br> ${e.data().sector}</br></h5>\n\n                <button class="btn-2" \n                  data-iddoc="${e.data().symbol}"\n                type="button">\n                  Remove\n                </button>\n\n            </section>\n            <section class="impressions">\n              Price USD:</br>${e.data().price}</br></br>\n              1hr % Change:</br>${e.data().change}</br></br>\n              24hr Volume:</br>${e.data().volume}\n            </section>\n            <div class="clearfix"></div>\n          </article>\n        `,document.getElementById("main").appendChild(t)})})}function o(e){e.target.classList.value.includes("btn-1")&&(e.preventDefault(),t.collection("Crypto").doc(`${e.target.dataset.symbol}`).set({symbol:`${e.target.dataset.symbol}`,tagline:`${e.target.dataset.tag}`,category:`${e.target.dataset.category}`,sector:`${e.target.dataset.sector}`,price:`${e.target.dataset.price}`,change:`${e.target.dataset.hrchange}`,volume:`${e.target.dataset.dayvolume}`}).then(()=>{console.log("Document is successfully written!")}).catch(e=>{console.error("Error writing document: ",e)}))}function c(e){e.target.classList.value.includes("btn-2")&&t.collection("Crypto").doc(`${e.target.dataset.iddoc}`).delete().then(()=>{console.log("Document successfully deleted!"),document.getElementById("main").innerHTML="",n()}).catch(e=>{console.error("Error removing document: ",e)})}function r(e,t){document.getElementById("main").innerHTML="",e(),document.getElementById("sourceChoice").innerHTML="",document.getElementById("sourceChoice").appendChild(document.createTextNode(t))}document.addEventListener("click",function(e){c(e)}),document.getElementById("cryptoList").addEventListener("click",e=>{r(a,": Crypto List")}),document.getElementById("favs").addEventListener("click",e=>{document.getElementById("main").innerHTML="",r(n,": Favorites")}),document.getElementById("cryptoTitle").addEventListener("click",e=>{document.getElementById("main").innerHTML="",r(a,"")}),window.onload=function(){document.getElementById("main").innerHTML="",r(a,""),a()};
},{}]},{},["QdeU"], null)
//# sourceMappingURL=app.4787dc5b.js.map