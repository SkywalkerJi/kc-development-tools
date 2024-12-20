$(function () {
  function select() {
    let $ptab = $(this.parentElement.parentElement);
    let $lis = $ptab.find("ul li,ul a");
    for (let i = 0; i < $lis.length; ++i) {
      if (i == this.index) $lis[i].classList.add("selected");
      else $lis[i].classList.remove("selected");
    }
    let $divs = $ptab.find("> div");
    for (let i = 0; i < $divs.length; ++i) {
      if (i == this.index) $divs[i].classList.remove("hidden");
      else $divs[i].classList.add("hidden");
    }
  }
  let $tabs = $(".tab");
  let hash = window.location.hash.substr(1);
  for (let i = 0; i < $tabs.length; ++i) {
    let tab = $tabs[i];
    let $tab = $(tab);
    let $lis = $tab.find("ul li,ul a");
    for (let j = 0; j < $lis.length; ++j) {
      $lis[j].index = j;
      $lis[j].onclick = select;
    }
    if (hash != "") {
      hash += "d";
      let $divs = $(tab).find("> div");
      for (let j = 0; j < $divs.length; ++j) {
        if ($divs[j].id == hash) {
          for (let k = 0; k < $lis.length; ++k)
            $lis[k].classList.remove("selected");
          for (let k = 0; k < $divs.length; ++k)
            $divs[k].classList.add("hidden");
          $lis[j].classList.add("selected");
          $divs[j].classList.remove("hidden");
          break;
        }
      }
    }
  }
});
