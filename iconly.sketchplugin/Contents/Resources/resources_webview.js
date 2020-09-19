/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/webview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}); // // call the plugin from the webview
// document.getElementById('button').addEventListener('click', () => {
//   window.postMessage('nativeLog', 'Called from the webview')
// })
// // call the webview from the plugin
// window.setRandomNumber = (randomNumber) => {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }

var base_url = "https://piqo.design/iconly/api/";
var icon_container;
var icons_json = [];
var icon_types = [];
var serach = "";
var c_type = "Bold";

function toggleLoading(showLoading) {
  if (showLoading) {
    document.querySelector(".container").classList.add("hide");
    document.querySelector(".loading").classList.add("active");
  } else {
    document.querySelector(".container").classList.remove("hide");
    document.querySelector(".loading").classList.remove("active");
  }
}

function getIcons() {
  var list = icons_json.find(function (k) {
    return k.name == c_type;
  }).icons; // console.log(list);

  var result = list.filter(function (k) {
    return k.tags.toLowerCase().includes(serach);
  });
  var icons = [];
  result.forEach(function (k) {
    icons.push({
      name: k.name,
      icon: k.icon
    });
  });
  checkIconFound(icons);
  return icons;
}

var offsetX = 0;
var offsetY = 0;

function renderIcons() {
  var icons = getIcons();
  icon_container.innerHTML = '';
  icons.forEach(function (icon_object) {
    var span = document.createElement("span");
    span.classList.add("icon");
    span.setAttribute('draggable', "true"); // span.addEventListener("dragstart" , dragStart);
    // span.addEventListener("dragend" , dragIconToArtboard);

    span.addEventListener("click", addIconToArtboard);
    span.innerHTML = icon_object.icon;
    span.setAttribute("data-name", icon_object.name);
    icon_container.appendChild(span);
  });
}

function dragStart(e) {
  offsetX = e.offsetX;
  offsetY = e.offsetY;
}

function addIconToArtboard(e) {
  // parent.postMessage({ pluginMessage: { type: 'load-svg'  , drag : {}, icon : this.innerHTML , name : this.getAttribute("data-name") } }, '*')
  // const message = { numberOfCopies, startingOptions, stepOptions };
  var message = {
    icon: this.innerHTML,
    name: this.getAttribute("data-name")
  }; //	Send options to plugin

  window.postMessage('nativeLog', JSON.stringify(message));
}

function checkIconFound(icons) {
  if (icons.length) {
    document.querySelector(".not-found-container").classList.remove("active");
  } else {
    document.querySelector(".not-found-container").classList.add("active");
  }
}

function setType(e) {
  c_type = this.getAttribute("data-type");
  renderIcons();
  setActiveBtn(c_type);
}

function setActiveBtn(c_type) {
  var types = document.querySelectorAll("[data-type]");
  types.forEach(function (type_el) {
    var type = type_el.getAttribute("data-type");

    if (type == c_type) {
      type_el.classList.add("active");
    } else {
      type_el.classList.remove("active");
    }
  });
}

function fillTypeBtns() {
  var str = icon_types.map(function (k, i) {
    return "\n        <li class=\"type-btn ".concat(i == 0 ? "active" : "", "\" data-type=\"").concat(k.slug, "\">\n            <span class=\"label light\">").concat(k.name, "</span>\n            <span class=\"label bold\">").concat(k.name, "</span>\n        </li>\n        ");
  });
  var type_container = document.querySelector(".types-btn");
  type_container.innerHTML = str.join("");
  var type_btns = document.querySelectorAll(".type-btn"); // console.log(type_btns);

  type_btns.forEach(function (type) {
    type.addEventListener("click", setType);
  });
}

function loadIcons() {
  axios({
    method: "get",
    url: base_url + "total?cat=essential&id=" + new Date().getTime()
  }).then(function (res) {
    console.log("data", res);
    icons_json = res.data.icons; // console.log("icons_json" , typeof icons_json);

    toggleLoading(false);
    renderIcons();
    setSettings(res.data.settings);
  }).catch(function (e) {
    console.log("e", e);
  });
}

function setSettings(settings) {
  settings.forEach(function (setting) {
    switch (setting.slug) {
      case "essential-icon-types":
        icon_types = JSON.parse(setting.value);
        fillTypeBtns();
        break;

      case "request-icon":
        document.querySelector(".request-btn").setAttribute("href", setting.value);
        break;

      case "piqo-link":
        document.querySelector("#piqo-link").setAttribute("href", setting.value);
        break;

      default:
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  icon_container = document.getElementById("icon-container");
  var input = document.getElementById("search-inp");
  input.addEventListener("input", function (e) {
    serach = this.value.toLowerCase();
    renderIcons();
  });
  loadIcons();
});

function interceptClickEvent(event) {
  var target = event.target.closest('a');

  if (target && target.getAttribute('target') === '_blank') {
    event.preventDefault();
    window.postMessage('externalLinkClicked', target.href);
  }
} // listen for link click events at the document level


document.addEventListener('click', interceptClickEvent);

/***/ })

/******/ });
//# sourceMappingURL=resources_webview.js.map