document.addEventListener("DOMContentLoaded", function () {
  const table = new DataTable("#myTable", dataTableSettings);
  console.log("DataTable initialized:", table);
  document.querySelector(".customers").style.display = "block";
});

