
(function(){
  "use strict";

  /* ---------- Cut icons ---------- */
  function icon(kind){
    var marble = '<path d="M4 16c6 6 12-6 18 0M4 24c6-6 12 6 18 0" stroke="#ffffff" stroke-opacity=".55" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    if(kind==='ground'){
      return '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#8a3b2c"/><circle cx="15" cy="16" r="2.6" fill="#c98a5e"/><circle cx="27" cy="14" r="2" fill="#c98a5e"/><circle cx="30" cy="24" r="2.6" fill="#c98a5e"/><circle cx="18" cy="28" r="2" fill="#c98a5e"/><circle cx="24" cy="22" r="1.8" fill="#c98a5e"/></svg>';
    }
    if(kind==='ribs'){
      return '<svg viewBox="0 0 44 44"><rect x="4" y="4" width="36" height="36" rx="6" fill="#7a4a2c"/><path d="M12 12v20M20 10v24M28 12v20M36 14v16" stroke="#e9cfa8" stroke-width="3" stroke-linecap="round"/></svg>';
    }
    // ribeye / tenderloin / striploin: marbled oval
    return '<svg viewBox="0 0 44 44"><rect x="2" y="2" width="40" height="40" rx="20" fill="#c98a5e"/>'+marble+'</svg>';
  }

  var CUTS = [
    {name:"USDA Prime Ribeye", sub:"Bone-in, hand cut", grade:"prime", size:"12oz", price:"$220 / ct", icon:"ribeye", image:"images/prime-ribeye.jpeg"},
    {name:"USDA Prime Tenderloin", sub:"Center cut, trimmed", grade:"prime", size:"8oz", price:"$260 / ct", icon:"ribeye", image:"images/tenderloin.jpeg"},
    {name:"USDA Choice Striploin", sub:"Boneless, portioned", grade:"choice", size:"10oz", price:"$165 / ct", icon:"ribeye", image:"images/striploin.jpeg"},
    {name:"USDA Choice Ground Beef", sub:"80/20, fresh ground daily", grade:"choice", size:"50lb", price:"$145 / case", icon:"ground", image:"images/ground-beef.jpeg"},
    {name:"Beef Short Ribs", sub:"Bone-in, 4-bone rack", grade:"prime", size:"5lb", price:"$180 / box", icon:"ribs", image:"images/short-ribs.jpeg"}
  ];

  var tbody = document.getElementById("inv-body");
  var empty = document.getElementById("inv-empty");

  function renderInventory(filter){
    tbody.innerHTML = "";
    var shown = 0;
    CUTS.forEach(function(c){
      if(filter!=="all" && c.grade!==filter) return;
      shown++;
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td data-label="Cut"><div class="cut-cell">'+(c.image ? '<img class="cut-photo" src="'+c.image+'" alt="'+c.name+'" loading="lazy">' : icon(c.icon))+'<div><div class="cut-name">'+c.name+'</div><div class="cut-sub">'+c.sub+'</div></div></div></td>'+
        '<td data-label="Grade"><span class="grade '+(c.grade==="choice"?"choice":"")+'">'+(c.grade==="prime"?"Prime":"Choice")+'</span></td>'+
        '<td data-label="Unit size">'+c.size+'</td>'+
        '<td data-label="Price" class="price">'+c.price+'</td>';
      tbody.appendChild(tr);
    });
    empty.style.display = shown ? "none" : "block";
  }
  renderInventory("all");

  document.getElementById("filters").addEventListener("click", function(e){
    var btn = e.target.closest(".chip");
    if(!btn) return;
    document.querySelectorAll("#filters .chip").forEach(function(c){c.classList.remove("on")});
    btn.classList.add("on");
    renderInventory(btn.dataset.filter);
  });

  /* ---------- Page routing ---------- */
  var pages = ["home","inventory","about","contact"];
  function go(name, push){
    if(pages.indexOf(name)===-1) name = "home";
    pages.forEach(function(p){
      document.getElementById("page-"+p).classList.toggle("active", p===name);
    });
    document.querySelectorAll("nav.links a").forEach(function(a){
      a.classList.toggle("active", a.dataset.page===name);
    });
    document.getElementById("menu").classList.remove("open");
    document.getElementById("burger").classList.remove("open");
    window.scrollTo({top:0, behavior:"instant"});
    if(push !== false) history.pushState({page:name}, "", "#"+name);
  }
  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-page]");
    if(!el) return;
    e.preventDefault();
    go(el.dataset.page);
  });
  window.addEventListener("popstate", function(e){
    go((e.state && e.state.page) || location.hash.replace("#","") || "home", false);
  });
  go(location.hash.replace("#","") || "home", false);

  /* ---------- Mobile menu ---------- */
  document.getElementById("burger").addEventListener("click", function(){
    document.getElementById("menu").classList.toggle("open");
    this.classList.toggle("open");
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("quote-form");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var ok = true;
    var fields = [
      {id:"f-name", test: function(v){return v.trim().length>0}},
      {id:"f-email", test: function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}},
      {id:"f-message", test: function(v){return v.trim().length>0}}
    ];
    fields.forEach(function(f){
      var input = document.getElementById(f.id);
      var errBox = input.parentElement.querySelector(".field-err");
      var valid = f.test(input.value);
      input.classList.toggle("err", !valid);
      if(errBox) errBox.style.display = valid ? "none" : "block";
      if(!valid) ok = false;
    });
    var msg = document.getElementById("form-msg");
    if(ok){
      msg.style.display = "block";
      form.reset();
      document.querySelectorAll("#quote-form .err").forEach(function(i){i.classList.remove("err")});
    } else {
      msg.style.display = "none";
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
