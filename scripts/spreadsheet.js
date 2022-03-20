var textCache;
var activebutton = null;
var colData = [];
var jsonData;

//****************** GRAPH STUFF *****************/
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3
  .select("#data")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function getTableData() {
  // get the data
  d3.json(jsonData, function (data) {
    // X axis: scale and draw:
    var x = d3
      .scaleLinear()
      .domain([0, 1000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3
      .histogram()
      .value(function (d) {
        return d.price;
      }) // I need to give the vector of value
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ]); // d3.hist has to be called before the Y axis obviously
    svg.append("g").call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#69b3a2");
  });
}

//selects all rows where it's index is equals to the index of the column clicked.
function selectColumn(colIndex) {
  var i = 0;
  deselectAll();
  $("#spreadsheet")
    .find("tr")
    .each((row, col) => {
      $(col)
        .find("td")
        .eq(colIndex - 1)
        .addClass("active");

      colData[i] = $(col)
        .find("td")
        .eq(colIndex - 1);

      console.log(colData[i]);
      i++;
    });

  jsonData = JSON.parse(colData);
  getTableData();
}

// waits for the document to be fully loaded.
$(document).ready(function () {
  // accepts click of all th in the first row but not in the first column.
  $("#spreadsheet tr:first th:not(:first-child)").click(function () {
    selectColumn($(this).index());
  });

  // accepts click of all th in all rows except for the first and returns the index of the parent row.
  $("#spreadsheet tr:not(:first-child) th").click(function () {
    selectRow($(this).parent().index());
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
      console.log("you pressed enter");
      $(this).parent().removeClass("active");
      $(this).parent().text($(this).val());
    }
    // } else {
    //   console.log("you pressed something else");
    //   $(this).parent().removeClass("active");
    //   $(this).parent().text(textCache);
    // }
  });
});

$("td").on("blur", "input", function () {
  $(this).parent().removeClass("active");
  $(this).parent().text(textCache);
  activebutton = null;
});

// $(this).parent().text(textCache);

// $("input").keydown(function (e) {
//   if ((e.keyCode || e.which) == 13) {
//     console.log("Enter key pressed");
//     $(this).parent().removeClass("active");
//     $(this).text(textCache);
//   }
// });
// $("td").keydown(function (e) {
//   if ((e.keyCode || e.which) == 13) {
//     console.log("Enter key pressed");
//     $(this).removeClass("active");
//     $(this).text(textCache);
//   }
// });
