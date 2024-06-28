
function customPaging(currentPage) {
  const pageSize = 8; 
  const pagesPerGroup = 40; 
  const totalPages = Math.ceil(256000 / pageSize); 
  const currentGroup = Math.floor(currentPage / pagesPerGroup); 
  const startPage = currentGroup * pagesPerGroup; 
  const endPage = Math.min(startPage + pagesPerGroup, totalPages); 

  return {
    startPage: startPage,
    endPage: endPage,
    totalPages: totalPages,
    currentGroup: currentGroup,
  };
}

function updatePagination(pagination, settings) {
  let paginationContainer = $(".dt-paging");

  paginationContainer.find("button").on("click", function (e) {
    e.preventDefault();
    if (!$(this).hasClass("disabled") && !$(this).hasClass("current")) {
      const pageIndex = $(this).data("page");
      table.page(pageIndex).draw("page");
    }
  });
}


