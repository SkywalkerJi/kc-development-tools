let selectedItems = [];

function select() {
  if (this.classList.contains("selected")) {
    this.classList.remove("selected");
    let index = selectedItems.indexOf(this.index);
    if (index != -1) selectedItems.splice(index, 1);
  } else {
    this.classList.add("selected");
    selectedItems.push(this.index);
    selectedItems.sort(function (i1, i2) {
      return i1 - i2;
    });
  }
  let hq = 1;
  for (let i = 0; i < selectedItems.length; ++i) {
    if (items[selectedItems[i]][3] * 10 > hq)
      hq = items[selectedItems[i]][3] * 10;
  }
  $("#minhq")[0].innerHTML = hq;
  let hqs = $("[name=hqlevel_]")[0];
  for (let i = 0; i < hqs.children.length; ++i) {
    hqs.children[i].disabled = hqs.children[i].value < hq;
  }
  if (hqs.value < hq) hqs.value = hq;
  updateGen();
}

function createList() {
  let div = $("#gend div")[0];
  div.innerHTML = "";
  let last = -1;
  let type;
  for (let i = 0; i < items.length; ++i) {
    if (items[i][4] != last) {
      type = document.createElement("p");
      let title = document.createElement("span");
      title.className = "type";
      title.appendChild(document.createTextNode(itemtypenames[items[i][4]]));
      type.appendChild(title);
      div.appendChild(type);
      last = items[i][4];
    }
    let item = document.createElement("button");
    item.appendChild(document.createTextNode(items[i][1]));
    item.className = "type" + (items[i][6] ? 4 : items[i][4]);
    item.title = "Require";
    if (i == 75) item.title = "\nFuel ≥ 240\nAmmunition ≥ 260\nBauxite ≥ 250";
    else
      for (let j = 0; j < 4; ++j)
        if (items[i][5][j] > 0)
          item.title += "\n" + materialNames[j] + " ≥ " + items[i][5][j] * 10;
    if (items[i][3] > 0) item.title += "\nHQ Level ≥ " + items[i][3] * 10;
    // if (i == 44) item.title += "\nItalian Flagship";
    item.title = getString(item.title);
    item.onclick = select;
    item.index = i;
    type.appendChild(item);
  }
}

$(createList);
$(function () {
  $("[name=hqlevel_]")[0].onchange = updateGen;
});

const layers = [0, 2, 1, 3];
let results;

function updateGen() {
  if (selectedItems.length == 0) {
    results = [];
    $("#results")[0].innerHTML = getString("No Result");
    return;
  }
  let mins = [10, 10, 10, 10];
  if (selectedItems.find((element) => element == 70))
    mins = [240, 260, 10, 250];
  for (let i = 0; i < selectedItems.length; ++i) {
    for (let j = 0; j < 4; ++j) {
      if (items[selectedItems[i]][5][j] * 10 > mins[j])
        mins[j] = items[selectedItems[i]][5][j] * 10;
    }
  }
  let hq = $("[name=hqlevel_]")[0].value;
  results = [];
  for (let secretary = 0; secretary < 4; ++secretary) {
    for (let layer = 0; layer < 4; ++layer) {
      let materials = mins.slice(0);
      for (let i = 0; i < 4; ++i) {
        if (layers.indexOf(i) < layers.indexOf(layer)) {
          if (materials[i] >= materials[layer]) {
            materials[layer] = materials[i] + 1;
          }
        } else {
          if (materials[i] > materials[layer]) {
            materials[layer] = materials[i];
          }
        }
      }
      for (let isitaly = 99; isitaly < 129; ++isitaly) {
        //水雷
        if (
          secretary != 1 &&
          (isitaly == 100 ||
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
            isitaly == 127)
        )
          continue;
        //炮战
        if (
          secretary != 0 &&
          (isitaly == 101 ||
            isitaly == 105 ||
            isitaly == 111 ||
            isitaly == 117 ||
            isitaly == 118 ||
            isitaly == 119 ||
            isitaly == 120)
        )
          continue;
        //航母
        if (
          secretary != 2 &&
          (isitaly == 102 ||
            isitaly == 103 ||
            isitaly == 104 ||
            isitaly == 106 ||
            isitaly == 110 ||
            isitaly == 116)
        )
          continue;
        //潜水
        if (
          secretary != 3 &&
          (isitaly == 128 ||
            isitaly == 129)
        )
          continue;
        let result = new analysis(
          selectedItems.slice(0),
          develop(
            materials[0],
            materials[1],
            materials[2],
            materials[3],
            secretary,
            isitaly,
            hq
          )
        );
        if (result.acceptable) results.push(result);
      }
    }
  }
  if (results.length == 0) $("#results")[0].innerHTML = getString("No Result");
  else {
    for (let i = 0; i < 5; ++i) {
      sortType = [-1, i];
      results.sort(resultSort);
    }
    display();
  }
}

function display() {
  let div = $("#results")[0];
  div.innerHTML = "";
  for (let i = 0; i < results.length; ++i) {
    let head = document.createElement("div");
    head.className = "resulth";
    let value = "";
    if (results[i].result[3][2] == 0) {
      value = "00" + results[i].result[3][1];
    } else {
      value = results[i].result[3][2];
    }
    head.appendChild(
      document.createTextNode(
        results[i].result[3][0].join("/") +
          " / " +
          $("[name=secretary] [value=" + value + "]")[0].innerText +
          " / " +
          results[i].succ +
          "% / " +
          (100 - results[i].fail) +
          "%"
      )
    );
    let detail = document.createElement("a");
    detail.href = "javascript:void(0);";
    detail.className = "i18n details";
    detail.appendChild(document.createTextNode(getString("Details")));
    detail.input = results[i].result[3];
    detail.onclick = function () {
      $("[name=fuel]")[0].value = this.input[0][0];
      $("[name=ammu]")[0].value = this.input[0][1];
      $("[name=steel]")[0].value = this.input[0][2];
      $("[name=baux]")[0].value = this.input[0][3];
      if (this.input[2] == 0) {
        $("[name=secretary]")[0].value = "00" + this.input[1];
      } else {
        $("[name=secretary]")[0].value = this.input[2];
      }
      $("[name=hqlevel]")[0].value = this.input[3];
      updateSim();
      $("[href='#sim']")[0].click();
    };
    head.appendChild(detail);
    div.appendChild(head);
    let body = document.createElement("div");
    body.className = "resultb";
    let table = document.createElement("table");
    table.border = 1;
    table.cellSpacing = 0;
    let tbody = document.createElement("tbody");
    tbody.innerHTML =
      '<tr><th class="i18n" rowspan=2>' +
      getString("Name") +
      '</th><th class="i18n" rowspan=2>' +
      getString("Percentage") +
      '</th><th class="i18n" colspan=5>' +
      getString("Expected Resource Consumption") +
      '</th></tr><tr><th class="i18n mat">' +
      getString("Fuel") +
      '</th><th class="i18n mat">' +
      getString("Ammu") +
      '</th><th class="i18n mat">' +
      getString("Steel") +
      '</th><th class="i18n mat">' +
      getString("Bauxite") +
      '</th><th class="i18n mat">' +
      getString("Dev. Mat.") +
      "</th></tr>";
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.appendChild(document.createTextNode(getString("Get Target")));
    td.className = "i18n";
    tr.appendChild(td);
    td = document.createElement("td");
    td.appendChild(document.createTextNode(results[i].succ + "%"));
    tr.appendChild(td);
    for (let j = 0; j < 5; ++j) {
      td = document.createElement("td");
      td.appendChild(document.createTextNode(results[i].expected[j]));
      let span = document.createElement("span");
      span.className =
        sortType[0] == -1 && j == sortType[1] ? "sorting" : "sort";
      span.appendChild(document.createTextNode("▼"));
      span.sortType = [-1, j];
      span.onclick = sortResult;
      td.appendChild(span);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.appendChild(document.createTextNode(getString("Failed")));
    td.className = "i18n";
    tr.appendChild(td);
    td = document.createElement("td");
    td.appendChild(document.createTextNode(results[i].fail + "%"));
    tr.appendChild(td);
    for (let j = 0; j < 5; ++j) {
      td = document.createElement("td");
      td.appendChild(document.createTextNode("--"));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    let number;
    for (let j = 0; j < results[i].details.length; ++j) {
      tr = document.createElement("tr");
      td = document.createElement("td");
      for (let k = 0; k < items.length; ++k) {
        if (results[i].details[j][0] == items[k][0]) number = k;
      }
      td.appendChild(document.createTextNode(items[number][1]));
      tr.appendChild(td);
      td = document.createElement("td");
      td.appendChild(document.createTextNode(results[i].details[j][1] + "%"));
      tr.appendChild(td);
      for (let k = 2; k < 7; ++k) {
        td = document.createElement("td");
        td.appendChild(document.createTextNode(results[i].details[j][k]));
        let span = document.createElement("span");
        span.className =
          j == sortType[0] && k - 2 == sortType[1] ? "sorting" : "sort";
        span.appendChild(document.createTextNode("▼"));
        span.sortType = [j, k - 2];
        span.onclick = sortResult;
        td.appendChild(span);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    body.appendChild(table);
    div.appendChild(body);
  }
}

function sortResult() {
  sortType = this.sortType;
  results.sort(resultSort);
  display();
}

function analysis(expect, result) {
  let total = 0;
  let rest = expect.slice(0);
  for (let i = 0; i < expect.length; ++i) {
    rest[i] = items[expect[i]][0];
  }
  let expectid = rest.slice(0);
  for (let i = 0; i < result[0].length; ++i) {
    if (rest.indexOf(result[0][i].id) != -1) {
      rest.splice(rest.indexOf(result[0][i].id), 1);
      total += result[0][i].percentage;
    }
  }
  if (rest.length > 0) {
    this.acceptable = false;
    return;
  }
  this.acceptable = true;
  this.result = result;
  this.succ = total;
  this.fail = result[2];
  this.expected = [
    rnd((result[3][0][0] * 100) / total),
    rnd((result[3][0][1] * 100) / total),
    rnd((result[3][0][2] * 100) / total),
    rnd((result[3][0][3] * 100) / total),
    rnd((100 - this.fail) / total),
  ];
  this.details = [];
  for (let i = 0; i < result[0].length; ++i) {
    if (expectid.indexOf(result[0][i].id) != -1) {
      this.details[expectid.indexOf(result[0][i].id)] = [
        result[0][i].id,
        result[0][i].percentage,
        rnd((result[3][0][0] * 100) / result[0][i].percentage),
        rnd((result[3][0][1] * 100) / result[0][i].percentage),
        rnd((result[3][0][2] * 100) / result[0][i].percentage),
        rnd((result[3][0][3] * 100) / result[0][i].percentage),
        rnd((100 - this.fail) / result[0][i].percentage),
      ];
    }
  }
}

function rnd(n) {
  return Math.round(n * 100) / 100;
}

let sortType = [-1, 4];
function resultSort(r1, r2) {
  let v1, v2;
  if (sortType[0] == -1) {
    v1 = r1.expected.slice(0);
    v2 = r2.expected.slice(0);
  } else {
    v1 = r1.details[sortType[0]].slice(2);
    v2 = r2.details[sortType[0]].slice(2);
  }
  return v1[sortType[1]] - v2[sortType[1]];
}
