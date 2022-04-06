var textCache;
var activebutton = null;
var colData = [];
var jsonData;
var averages = [];

//****************** GRAPH STUFF *****************/
function getGrade(mark) {
  if (mark < 50.0) {
    return "F";
  } else if (mark < 60.0) {
    return "D";
  } else if (mark < 70.0) {
    return "C";
  } else if (mark < 80.0) {
    return "B";
  } else {
    return "A";
  }
}

function getTableData(data) {
  const width = 800;
  const height = 500;
  const margin = 50;
  const chartWidth = width - 2 * margin; // 700
  const chartHeight = height - 2 * margin; // 400

  const colorScale = d3
    .scaleLinear()
    .domain([734, 1859])
    .range(["yellow", "green"]);

  const xScale = d3
    .scaleBand()
    .domain(Object.entries(data).map(([k, v]) => k))
    .range([0, chartWidth])
    .padding(0.5);

  const yScale = d3.scaleLinear().domain([0, 0.5]).range([chartHeight, 0]);

  let svg = d3
    .select(".main-content-wrapper")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Grade");

  let graph = svg
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

  graph
    .append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale));

  graph.append("g").call(d3.axisLeft(yScale));

  let rectangles = graph
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (data) => xScale());

  var g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");
  d3.json(data, function (data) {
    console.log(data);
  });
}

// finds all td's with active class and removes the class.
function deselectAll() {
  $("#spreadsheet").find("td").removeClass("active");
}

//selects all columns where it's index is equals to the index of the row clicked.
function selectRow(rowIndex) {
  deselectAll();
  $("#spreadsheet")
    .find("tr")
    .eq(rowIndex)
    .each((row, col) => {
      $(col).find("td").addClass("active");
    });
}

//selects all rows where it's index is equals to the index of the column clicked.
function selectColumn(colIndex) {
  var i = 0;
  var value;
  var averagesJson = null;
  averages = [
    { letter: "A", count: 0 },
    { letter: "B", count: 0 },
    { letter: "C", count: 0 },
    { letter: "D", count: 0 },
    { letter: "F", count: 0 },
  ];
  colData = [];
  jsonData = null;
  deselectAll();
  $("#spreadsheet")
    .find("tr")
    .each((row, col) => {
      $(col)
        .find("td")
        .eq(colIndex - 1)
        .addClass("active");

      value = $(col)
        .find("td")
        .eq(colIndex - 1)
        .text();

      if (!value) {
        i--;
      } else {
        colData.push({
          grade: value,
          letter: getGrade(value),
        });

        // for (const [key, value] of dict) {
        //   console.log(key + ": " + value);
        // }
        averages[getGrade(value)] = averages[getGrade(value)] + 1;
      }
      i++;
    });

  jsonData = Object.assign({}, colData);
  averagesJson = Object.assign({}, averages);
  console.log(averagesJson);
  console.log(jsonData);
  // getTableData(jsonData);
}

// waits for the document to be fully loaded.
$(document).ready(function () {
  var spreadsheet = document.getElementById("spreadsheet");
  var students;
  let row;

  var settings = {
    url: "http://localhost:3000/",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    students = response;

    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      var headerCell = document.createElement("th");
      row = spreadsheet.insertRow(-1);
      headerCell.innerHTML = student.SID;
      row.appendChild(headerCell);
      var grd1Col = row.insertCell(-1);
      var grd2Col = row.insertCell(-1);
      var grd3Col = row.insertCell(-1);
      var midtermCol = row.insertCell(-1);
      grd1Col.innerText = student.Asmt1;
      grd2Col.innerText = student.Asmt2;
      grd3Col.innerText = student.Asmt1;
      midtermCol.innerText = student.Midterm;
    }

    // accepts click of all th in the first row but not in the first column.
    $("#spreadsheet tr:first th:not(:first-child)").click(function () {
      selectColumn($(this).index());
    });

    // accepts click of all th in all rows except for the first and returns the index of the parent row.
    $("#spreadsheet tr:not(:first-child) th").click(function () {
      selectRow($(this).parent().index());
    });
  });
});

$("td").click(function (e) {
  if (!activebutton) {
    deselectAll();
    textCache = $(this).text();
    $(this)
      .text("")
      .append($("<input />", { value: textCache }));
    $("input").focus();
    $(this).addClass("active");
    activebutton = $(this);
  }
  $("input").keypress(function (e) {
    if (e.which == "13" && activebutton) {
      activebutton = null;
      $(this).parent().removeClass("active");
      $(this).parent().text($(this).val());
    }
  });
});

$("td").on("blur", "input", function () {
  $(this).parent().removeClass("active");
  $(this).parent().text(textCache);
  activebutton = null;
});
