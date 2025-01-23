<template>
  <div class="ag-grid-container">
    <div class="button-container">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        accept=".xlsx, .xls"
        @change="handleFileUpload"
      />
      <ifx-button
        type="button"
        :disabled="false"
        variant="primary"
        size="m"
        target="_blank"
        theme="default"
        full-width="false"
        @click="triggerFileInput"
      >
        Import Excel
      </ifx-button>
      <ifx-button
        type="button"
        :disabled="!dataImported"
        variant="secondary"
        size="m"
        target="_blank"
        theme="default"
        full-width="false"
        @click="exportExcel"
      >
        Export Excel
      </ifx-button>
      <ifx-button
        type="button"
        :disabled="!dataImported"
        variant="tertiary"
        size="m"
        target="_blank"
        theme="default"
        full-width="false"
        @click="deleteSelectedRows"
      >
        Delete
      </ifx-button>
    </div>

    <div class="ag-grid-wrapper">
      <ag-grid-vue
        id="myGrid"
        :row-data="rowData"
        :column-defs="colDefs"
        :default-col-def="defaultColDef"
        :column-types="columnTypes"
        class="ag-theme-alpine"
        :row-selection="'multiple'"
        style="width: 100%; height: calc(100vh - 150px);"
        :pagination="true"
        :pagination-page-size="paginationPageSize"
        :pagination-page-size-selector="paginationPageSizeSelector"
        @grid-ready="onGridReady"
      />
    </div>
  </div>
</template>


<script>
import { ref, shallowRef, onMounted, watch } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import * as XLSX from 'xlsx';


export default {
  name: 'AgGrid',
  components: {
    AgGridVue,
  },
  setup() {
    const gridApi = shallowRef(null);
    const rowData = ref([]);
    const colDefs = ref([]);
    const columnTypes = {
      number: { filter: 'agNumberColumnFilter' },
      text: { filter: 'agTextColumnFilter' },
    };
    const defaultColDef = ref({
      filter: 'agTextColumnFilter',
      floatingFilter: false,
      sortable: true,
      resizable: false,
      editable: true,
      flex: 1,
    });
    const paginationPageSize = ref(25);
    const paginationPageSizeSelector = ref([25, 50, 75]);
    const dataImported = ref(false);

    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const populateGrid = (workbook) => {
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const newRowData = [];
      const headers = [];
      let rowIndex = 1;

      for (let colIndex = 0; worksheet[`${String.fromCharCode(65 + colIndex)}${rowIndex}`]; colIndex++) {
        const header = String(worksheet[`${String.fromCharCode(65 + colIndex)}${rowIndex}`]?.v || `Column${colIndex + 1}`);
        headers.push(header);
      }

      colDefs.value = headers.map((header) => ({
        field: header,
        type: typeof worksheet[`${String.fromCharCode(65 + rowIndex + 1)}2`]?.v === 'number' ? 'number' : 'text',
      }));

      rowIndex++;
      while (worksheet[`A${rowIndex}`]) {
        const row = {};
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
          const columnKey = String.fromCharCode(65 + colIndex) + rowIndex;
          row[headers[colIndex]] = worksheet[columnKey]?.v || null;
        }
        newRowData.push(row);
        rowIndex++;
      }

      rowData.value = newRowData;
      dataImported.value = true;
      saveDataToLocalStorage();
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          populateGrid(workbook);
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const triggerFileInput = () => {
      const fileInput = document.querySelector('input[type="file"]');
      fileInput.click();
    };

    const exportExcel = () => {
      const workbook = XLSX.utils.book_new();
      const worksheetData = [colDefs.value.map((col) => col.field)];
      rowData.value.forEach((row) => {
        const rowValues = [];
        colDefs.value.forEach((col) => {
          rowValues.push(row[col.field]);
        });
        worksheetData.push(rowValues);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'exported_data.xlsx');
    };

    const saveDataToLocalStorage = () => {
      localStorage.setItem('rowData', JSON.stringify(rowData.value));
      localStorage.setItem('colDefs', JSON.stringify(colDefs.value));
    };

    const loadDataFromLocalStorage = () => {
      const storedRowData = localStorage.getItem('rowData');
      const storedColDefs = localStorage.getItem('colDefs');
      if (storedRowData) {
        rowData.value = JSON.parse(storedRowData);
      }
      if (storedColDefs) {
        colDefs.value = JSON.parse(storedColDefs);
      }
      dataImported.value = !!storedRowData && !!storedColDefs;
    };

    const deleteSelectedRows = () => {
      if (!gridApi.value) {
        console.warn('Grid API is not available');
        return;
      }
      const selectedRows = gridApi.value.getSelectedRows();
      if (selectedRows.length > 0) {
        rowData.value = rowData.value.filter((row) => !selectedRows.includes(row));
        saveDataToLocalStorage();
        gridApi.value.applyTransaction({ remove: selectedRows });
      } else {
        console.warn('No rows selected for deletion.');
      }
    };


    onMounted(() => {
      loadDataFromLocalStorage();

      if (!rowData.value.length) {
        colDefs.value = [
          { field: 'Name', type: 'text' },
          { field: 'Age', type: 'number' },
          { field: 'Country', type: 'text' },
        ];
        rowData.value = [
          { Name: 'John Doe', Age: 30, Country: 'USA' },
          { Name: 'Jane Smith', Age: 25, Country: 'Canada' },
          { Name: 'Sam Johnson', Age: 35, Country: 'UK' },
        ];
      }
    });

    watch([rowData, colDefs], saveDataToLocalStorage, { deep: true });

    return {
      rowData,
      colDefs,
      defaultColDef,
      columnTypes,
      paginationPageSize,
      paginationPageSizeSelector,
      dataImported,
      onGridReady,
      handleFileUpload,
      triggerFileInput,
      exportExcel,
      deleteSelectedRows,
      saveDataToLocalStorage,
      loadDataFromLocalStorage,
      gridApi,
    };
  },
};
</script>

<style lang="scss">

.header {
  font: tokens.$ifxHeadingHeading04;
}
.ag-grid-container {
  <%_ if(promptResults.isSideBarRequired=="Vertical Menu") { _%>
 margin-top: 2rem;
 <%_ } else { _%>
 margin-top: 1px;
    <%_ } _%>
 height: calc(100vh - 89px);
}
.button-container {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;  
  gap: 10px; 
}
.ag-grid-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.ag-theme-alpine {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ag-theme-alpine .ag-root-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ag-theme-alpine .ag-body-container {
  flex: 1;
  overflow-y: auto;
}

.ag-theme-alpine .ag-paging-panel {
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1;
  width: 100%;
  border-top: 1px solid #ccc;
}
</style>





