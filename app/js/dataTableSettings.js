
$.extend($.fn.DataTable.ext.pager, {
  numbers_length: 6, 
});

const initialData = extractInitialData();

const dataTableSettings = {
  serverSide: true,
  ajax: function (data, callback, settings) {
    const totalRecords = 320; // Общее количество данных
    const dataPerPage = 8;
    const start = data.start;
    const searchValue = data.search.value.toLowerCase();

    // Имитация загрузки данных только для первой страницы
    if (start === 0) {
      let dataToDisplay = initialData;

      // Фильтрация данных в соответствии с поиском
      if (searchValue) {
        dataToDisplay = initialData.filter((row) =>
          row.some((cell) => cell.toLowerCase().includes(searchValue))
        );
      }

      callback({
        draw: data.draw,
        recordsTotal: totalRecords,
        recordsFiltered: searchValue ? dataToDisplay.length : totalRecords,
        data: dataToDisplay.slice(start, start + dataPerPage),
      });

      // Обновляем пагинацию
      const currentPage = Math.floor(settings._iDisplayStart / settings._iDisplayLength);
      const pagination = customPaging(currentPage);
      updatePagination(pagination, settings); // Обновляем пагинацию
    } else {
      // Имитация подгрузки данных для остальных страниц
      let fakeData = [];
      for (let i = 0; i < dataPerPage; i++) {
        fakeData.push([
          `Customer ${start + i + 1}`,
          `Company ${start + i + 1}`,
          `Phone ${start + i + 1}`,
          `Email ${start + i + 1}`,
          `Country ${start + i + 1}`,
          "Status",
        ]);
      }

      setTimeout(() => {
        callback({
          draw: data.draw,
          recordsTotal: totalRecords,
          recordsFiltered: totalRecords,
          data: fakeData,
        });

        // Обновляем пагинацию
        const currentPage = Math.floor(settings._iDisplayStart / settings._iDisplayLength);
        const pagination = customPaging(currentPage);
        updatePagination(pagination, settings); // Обновляем пагинацию
      }, 200);
    }
  },
  pageLength: 8,
  lengthChange: false,
  pagingType: "simple_numbers",
  language: {
    searchPlaceholder: "Search",
    paginate: {
      previous: "<",
      next: ">",
    },
  },
  createdRow: function (row, data, dataIndex) {
    $(row).find("td").eq(5).html(data[5]); 
  },
  drawCallback: function (settings) {
    const info = this.api().page.info();
    const totalEntries = formatNumber(256000);
    document.querySelector(".dt-info").textContent = `Showing data ${info.start + 1} to ${
      info.end
    } of ${totalEntries} entries`;

   
    const currentPage = Math.floor(settings._iDisplayStart / settings._iDisplayLength);
    const pagination = customPaging(currentPage);
    updatePagination(pagination, settings); 
  },
  columnDefs: [
    { width: "70px", targets: 5 }, // Устанавливаем ширину для колонки "Status"
  ],
};

window.dataTableSettings = dataTableSettings;


