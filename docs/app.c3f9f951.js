// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/app.js":[function(require,module,exports) {
// //Keys
// import { firebaseConfig } from './keys.js';
let firebaseConfig = {
  apiKey: "AIzaSyAJLb6DBvl9-0V9oK69638k6OsMjyIVcnA",
  authDomain: "cryptoga-41764.firebaseapp.com",
  projectId: "cryptoga-41764",
  storageBucket: "cryptoga-41764.appspot.com",
  messagingSenderId: "88558198684",
  appId: "1:88558198684:web:e321b2f96853740587b259"
};
console.log(firebaseConfig); // Initialize Firebase

firebase.initializeApp(firebaseConfig); // retrieve from firebase

const database = firebase.firestore();

function cryptoRender() {
  let apiCall = fetch(`https://data.messari.io/api/v1/assets?with-metrics`);
  apiCall.then(res => res.json()).then(results => {
    for (let i = 0; i < results.data.length; i++) {
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
      document.addEventListener('click', function (event) {
        sendFirebase(event);
      });
    }
  }).catch(err => console.log(err)); //clear out id = "main"

  document.getElementById('main').innerHTML = '';
} //Read firebase data and create favorites DOM


function favRender() {
  database.collection("Crypto").get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("SYMBOL: ", doc.data().symbol);
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
} //Listener for Remove button


document.addEventListener('click', function (event) {
  deleteCrypto(event);
}); //To Firebase

function sendFirebase(event) {
  if (event.target.classList.value.includes('btn-1')) {
    event.preventDefault(); // Add a new document in collection "cities"

    database.collection("Crypto").doc(`${event.target.dataset.symbol}`).set({
      symbol: `${event.target.dataset.symbol}`,
      tagline: `${event.target.dataset.tag}`,
      category: `${event.target.dataset.category}`,
      sector: `${event.target.dataset.sector}`,
      price: `${event.target.dataset.price}`,
      change: `${event.target.dataset.hrchange}`,
      volume: `${event.target.dataset.dayvolume}`
    }).then(() => {
      console.log("Document is successfully written!");
    }).catch(error => {
      console.error("Error writing document: ", error);
    });
  }
} //Clicking Remove in Favorites to delete a document in Firebase


function deleteCrypto(event) {
  if (event.target.classList.value.includes('btn-2')) {
    database.collection("Crypto").doc(`${event.target.dataset.iddoc}`).delete().then(() => {
      console.log("Document successfully deleted!");
      document.getElementById('main').innerHTML = '';
      favRender();
    }).catch(error => {
      console.error("Error removing document: ", error);
    });
  }
} //Sets view option from drop down


function setCrypto(setSourceFunc, text) {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"

  setSourceFunc();
  document.getElementById('sourceChoice').innerHTML = '';
  document.getElementById('sourceChoice').appendChild(document.createTextNode(text));
} //Clicking Crypto List to populate article list on DOM


document.getElementById('cryptoList').addEventListener('click', evt => {
  setCrypto(cryptoRender, ': Crypto List');
}); //Clicking Favorites to populate article list on DOM

document.getElementById('favs').addEventListener('click', evt => {
  document.getElementById('main').innerHTML = '';
  setCrypto(favRender, ': Favorites');
}); //Clicking Crypto to populate all articles list on DOM

document.getElementById('cryptoTitle').addEventListener('click', evt => {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"

  setCrypto(cryptoRender, '');
}); // Onload populate all articles list on DOM

window.onload = function () {
  document.getElementById('main').innerHTML = ''; //clear out id = "main"

  setCrypto(cryptoRender, '');
  cryptoRender();
};
},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63846" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map