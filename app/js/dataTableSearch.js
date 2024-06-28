document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("dt-search-0");
  const table = $("#myTable").DataTable();

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    table.search(searchValue).draw();
  });
});
