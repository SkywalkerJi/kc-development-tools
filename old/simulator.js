let head = document.createElement("tr");
let failtr = document.createElement("tr");
let collapse = document.createElement("a");
(function () {
  let tnode = document.createElement("th");
  tnode.className = "i18n";
  tnode.appendChild(document.createTextNode(getString("Name")));
  tnode.style.width = "250px";
  head.appendChild(tnode);
  tnode = document.createElement("th");
  tnode.className = "i18n";
  tnode.appendChild(document.createTextNode(getString("Percentage")));
  tnode.style.width = "50px";
  head.appendChild(tnode);
  failtr.className = "failtr";
  tnode = document.createElement("td");
  let tnode2 = document.createElement("span");
  tnode2.innerHTML = getString("Failed");
  tnode2.className = "i18n";
  tnode.appendChild(tnode2);
  tnode.appendChild(document.createTextNode(" "));
  collapse.href = "javascript:void(0);";
  collapse.onclick = function () {
    if (this.innerHTML == "[+]") {
      $(this.parentNode.parentNode.parentNode)
        .find(".fail")
        .css("display", "table-row");
      this.innerHTML = "[-]";
    } else {
      $(this.parentNode.parentNode.parentNode).find(".fail").css("display", "");
      this.innerHTML = "[+]";
    }
  };
  collapse.innerHTML = "[+]";
  tnode.appendChild(collapse);
  failtr.appendChild(tnode);
  tnode = document.createElement("td");
  failtr.appendChild(tnode);
})();

$(function () {
  $("#result")[0].appendChild(head);
  $("#simd [name='fuel']")[0].onchange = updateSim;
  $("#simd [name='ammu']")[0].onchange = updateSim;
  $("#simd [name='steel']")[0].onchange = updateSim;
  $("#simd [name='baux']")[0].onchange = updateSim;
  $("#simd [name='secretary']")[0].onchange = updateSim;
  $("#simd [name='hqlevel']")[0].onchange = updateSim;
  updateSim();
});

function updateSim() {
  let isitaly = 0;
  let secretary = parseInt($("#simd [name='secretary']")[0].value);
  if (secretary > 99) {
    isitaly = secretary;
    if (
      isitaly == 100 ||
      isitaly == 107 ||
      isitaly == 108 ||
      isitaly == 109 ||
      isitaly == 112 ||
      isitaly == 113 ||
      isitaly == 114 ||
      isitaly == 115 ||
      isitaly == 121 ||
      isitaly == 122 ||
      isitaly == 123 ||
      isitaly == 124 ||
      isitaly == 125 ||
      isitaly == 126 ||
      isitaly == 127
    ) {
      secretary = 1;
    } else if (isitaly == 101 ||
      isitaly == 105 ||
      isitaly == 111 ||
      isitaly == 117 ||
      isitaly == 118 ||
      isitaly == 119 ||
      isitaly == 120
    ) {
      secretary = 0;
    } else if (
      isitaly == 102 ||
      isitaly == 103 ||
      isitaly == 104 ||
      isitaly == 106 ||
      isitaly == 110 ||
      isitaly == 116
    ) {
      secretary = 2;
    } else if (
      isitaly == 128 ||
      isitaly == 129
    ) {
      secretary = 3;
    }
  }
  let result = develop(
    $("#simd [name='fuel']")[0].value,
    $("#simd [name='ammu']")[0].value,
    $("#simd [name='steel']")[0].value,
    $("#simd [name='baux']")[0].value,
    secretary,
    isitaly,
    $("#simd [name='hqlevel']")[0].value
  );
  let succ = result[0],
    fail = result[1];
  let table = $("#result")[0];
  while (table.children[1] != undefined) table.removeChild(table.children[1]);
  for (let i = 0; i < succ.length; ++i) table.appendChild(succ[i].toTRNode());
  failtr.children[1].innerHTML = result[2] + "%";
  collapse.innerHTML = "[+]";
  table.appendChild(failtr);
  for (let i = 0; i < fail.length; ++i) table.appendChild(fail[i].toTRNode());
}
