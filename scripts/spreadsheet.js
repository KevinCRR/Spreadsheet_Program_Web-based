function deselectAll() {
  $("#spreadsheet").find("td").removeClass("active");
}

function selectRow(rowIndex) {
  deselectAll();
  $("#spreadsheet")
    .find("tr")
    .eq(rowIndex)
    .each((row, col) => {
      $(col).find("td").addClass("active");
    });
}

function selectColumn(colIndex) {
  deselectAll();
  $("#spreadsheet")
    .find("tr")
    .each((row, col) => {
      $(col)
        .find("td")
        .eq(colIndex - 1)
        .addClass("active");
    });
}

$(document).ready(function () {
  $("#spreadsheet tr:first th:not(:first-child)").click(function () {
    selectColumn($(this).index());
  });

  $("#spreadsheet tr:not(:first-child) th").click(function () {
    selectRow($(this).parent().index());
  });
});
