// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// // call the plugin from the webview
// document.getElementById('button').addEventListener('click', () => {
//   window.postMessage('nativeLog', 'Called from the webview')
// })

// // call the webview from the plugin
// window.setRandomNumber = (randomNumber) => {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }

let base_url = "https://piqo.design/iconly/api/";
let icon_container;
let icons_json = [];

let icon_types = [];

let serach = "";
let c_type = "Bold";

function toggleLoading(showLoading){

    if(showLoading){
        document.querySelector(".container").classList.add("hide");
        document.querySelector(".loading").classList.add("active");
    }else{
        document.querySelector(".container").classList.remove("hide");
        document.querySelector(".loading").classList.remove("active");
    }
}

function getIcons(){
    let list = icons_json.find(k => k.name == c_type).icons;
    // console.log(list);
    
    let result = list.filter(k => k.tags.toLowerCase().includes(serach));
    let icons = [];
    result.forEach(k => {
        icons.push({name : k.name , icon : k.icon});
    });
    checkIconFound(icons);
    return icons;
}

let offsetX = 0;
let offsetY = 0;


function renderIcons(){
    let icons = getIcons();
    icon_container.innerHTML = '';
    icons.forEach(icon_object => {
        let span = document.createElement("span");
        span.classList.add("icon");
        span.setAttribute('draggable', "true");
        // span.addEventListener("dragstart" , dragStart);
        // span.addEventListener("dragend" , dragIconToArtboard);
        span.addEventListener("click" , addIconToArtboard);
        span.innerHTML = icon_object.icon;
        span.setAttribute("data-name" , icon_object.name)
        icon_container.appendChild(span);
    });
}

function dragStart(e){
	offsetX = e.offsetX;
    offsetY = e.offsetY;
}

function addIconToArtboard(e){
    // parent.postMessage({ pluginMessage: { type: 'load-svg'  , drag : {}, icon : this.innerHTML , name : this.getAttribute("data-name") } }, '*')
    // const message = { numberOfCopies, startingOptions, stepOptions };
	const message = { icon : this.innerHTML , name : this.getAttribute("data-name") };
	
	//	Send options to plugin
    window.postMessage('nativeLog',JSON.stringify(message))
}

function checkIconFound(icons){
    if(icons.length){
        document.querySelector(".not-found-container").classList.remove("active");
    }else{
        document.querySelector(".not-found-container").classList.add("active");
    }
}


function setType(e){
    c_type = this.getAttribute("data-type");
    renderIcons();
    setActiveBtn(c_type);
}

function setActiveBtn(c_type){
    let types = document.querySelectorAll("[data-type]");
    types.forEach(type_el => {
        let type = type_el.getAttribute("data-type");
        if(type == c_type){
            type_el.classList.add("active");
        }else{
            type_el.classList.remove("active");
        }
    });
}

function fillTypeBtns(){
    let str = icon_types.map((k , i) => {
        return `
        <li class="type-btn ${i == 0 ? "active" : ""}" data-type="${k.slug}">
            <span class="label light">${k.name}</span>
            <span class="label bold">${k.name}</span>
        </li>
        `;
    })

    let type_container = document.querySelector(".types-btn");
    type_container.innerHTML = str.join("");
        
    let type_btns = document.querySelectorAll(".type-btn");
    // console.log(type_btns);
    
    type_btns.forEach(type => {
        type.addEventListener("click" ,setType);
    });
}


function loadIcons(){
    axios({
        method : "get",
        url : base_url + "total?cat=essential&id="+(new Date().getTime())
    }).then(res => {
        console.log("data" , res);
        
        icons_json = res.data.icons;
        // console.log("icons_json" , typeof icons_json);
        toggleLoading(false);
        renderIcons();
        setSettings(res.data.settings);
    }).catch( e => {
        console.log("e" , e);
        
    })
}

function setSettings(settings){
    settings.forEach(setting => {
        switch (setting.slug) {
            case "essential-icon-types":
                icon_types = JSON.parse(setting.value);
                fillTypeBtns();
                break;
            case "request-icon":
                document.querySelector(".request-btn").setAttribute("href" , setting.value);
                break;
            case "piqo-link":
                document.querySelector("#piqo-link").setAttribute("href" , setting.value);
                break;
            default:
                break;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    icon_container = document.getElementById("icon-container");
    

    let input = document.getElementById("search-inp");
    input.addEventListener("input" , function(e){
        serach = this.value.toLowerCase();
        renderIcons();
    });

    loadIcons();

});


function interceptClickEvent(event) {
  const target = event.target.closest('a')
  if (target && target.getAttribute('target') === '_blank') {
    event.preventDefault()
    window.postMessage('externalLinkClicked', target.href)
  }
}

// listen for link click events at the document level
document.addEventListener('click', interceptClickEvent)