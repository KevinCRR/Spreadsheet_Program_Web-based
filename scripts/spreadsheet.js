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
