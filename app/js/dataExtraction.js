function extractInitialData() {
  let initialData = [];
  $("#myTable tbody tr").each(function () {
    let row = [];
    $(this)
      .find("td")
      .each(function () {
        row.push($(this).html());
      });
    initialData.push(row);
  });
  return initialData;
}
