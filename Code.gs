function onFormSubmit(e) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Form Responses 1");
  var historySheet = ss.getSheetByName("Remarks History");

  var submittedRow = e.range.getRow();
  var lastCol = mainSheet.getLastColumn();

  var newRow = mainSheet.getRange(submittedRow, 1, 1, lastCol).getValues()[0];

  var challanNo = newRow[1];           // Column B
  var newBooklet = newRow[4];          // Column E
  var newRemarks = newRow[6];          // Column G
  var newReceiving = newRow[8];        // Column I

  var today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd-MM-yyyy"
  );

  var data = mainSheet.getDataRange().getValues();

  // Check if challan already exists
  for (var i = 1; i < data.length - 1; i++) {

    if (data[i][1] == challanNo) {

      var originalRow = i + 1;

      var oldBooklet = data[i][4];
      var oldRemarks = data[i][6];

      // Always update Date column (Column C)
      mainSheet.getRange(originalRow, 3).setValue(today);

      // 🔹 Update Challan Booklet if changed
      if (newBooklet && newBooklet !== oldBooklet) {
        mainSheet.getRange(originalRow, 5).setValue(newBooklet);
      }

      // 🔹 Update Receiving Upload if provided
      if (newReceiving && newReceiving !== "") {
        mainSheet.getRange(originalRow, 9).setValue(newReceiving);
      }

      // 🔹 Update Remarks if changed
      if (newRemarks && newRemarks !== oldRemarks) {

        mainSheet.getRange(originalRow, 7).setValue(newRemarks);

        // Log into Remarks History
        historySheet.appendRow([
          today,
          challanNo,
          today,
          newRemarks
        ]);
      }

      // Delete duplicate submission row
      mainSheet.deleteRow(submittedRow);

      return;
    }
  }

  // If no existing challan found → New challan
  mainSheet.getRange(submittedRow, 3).setValue(today);

}
