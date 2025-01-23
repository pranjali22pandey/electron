import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AgGrid from '@/components/AgGrid.vue';
import * as XLSX from 'xlsx';

describe('AgGrid Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AgGrid, { attachTo: document.body });

    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => null);
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('handles file upload and populates grid data', async () => {
    global.FileReader = class {
      readAsArrayBuffer() {
        this.onload({ target: { result: new Uint8Array([0]) } });
      }
    };

    vi.spyOn(XLSX, 'read').mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          A1: { v: 'Name' },
          A2: { v: 'John Doe' },
          B1: { v: 'Age' },
          B2: { v: 30 },
        },
      },
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    Object.defineProperty(input.element, 'files', {
      value: [file],
    });

    await input.trigger('change');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.rowData).toEqual([{ Name: 'John Doe', Age: 30 }]);
    expect(wrapper.vm.dataImported).toBe(true);
  });

  it('exports Excel file with correct data', async () => {
    const writeFileSpy = vi.spyOn(XLSX, 'writeFile').mockImplementation(() => {});

    wrapper.vm.rowData = [{ Name: 'John Doe', Age: 30, Country: 'USA' }];
    wrapper.vm.colDefs = [{ field: 'Name' }, { field: 'Age' }, { field: 'Country' }];

    await wrapper.vm.exportExcel();

    expect(writeFileSpy).toHaveBeenCalledWith(expect.anything(), 'exported_data.xlsx');
  });

  it('toggles the Add Form visibility', async () => {
    expect(wrapper.vm.isAddFormVisible).toBe(false);
    await wrapper.vm.toggleAddForm();
    expect(wrapper.vm.isAddFormVisible).toBe(true);
    await wrapper.vm.toggleAddForm();
    expect(wrapper.vm.isAddFormVisible).toBe(false);
  });

  it('deletes selected rows', async () => {
    wrapper.vm.rowData = [
      { Name: 'John Doe', Age: 30, Country: 'USA' },
      { Name: 'Jane Smith', Age: 25, Country: 'Canada' },
    ];
    wrapper.vm.dataImported = true;

    // Mock gridApi to select Jane Smith for removal
    const mockGridApi = {
      getSelectedRows: vi.fn().mockReturnValue([wrapper.vm.rowData[1]]),
      applyTransaction: vi.fn(),
    };
    wrapper.vm.gridApi = mockGridApi;

    await wrapper.vm.deleteSelectedRows();

    // Verifying if the rowData is updated correctly
    expect(wrapper.vm.rowData).toEqual([{ Name: 'John Doe', Age: 30, Country: 'USA' }]);
    // Verifying if the applyTransaction method is called with the correct argument
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({ remove: [{ Name: 'Jane Smith', Age: 25, Country: 'Canada' }] });
  });

  it('adds a new row to the grid', async () => {
    const mockGridApi = {
      applyTransaction: vi.fn(),
    };
    wrapper.vm.gridApi = mockGridApi;

    const newRow = { Name: 'New User', Age: 28, Country: 'Germany' };
    await wrapper.vm.addRow(newRow);

    expect(wrapper.vm.rowData).toContainEqual(newRow);
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({ add: [newRow] });
  });

  it('saves data to local storage', () => {
    const spySetItem = vi.spyOn(localStorage, 'setItem');

    wrapper.vm.saveDataToLocalStorage();

    expect(spySetItem).toHaveBeenCalledWith('rowData', JSON.stringify(wrapper.vm.rowData));
    expect(spySetItem).toHaveBeenCalledWith('colDefs', JSON.stringify(wrapper.vm.colDefs));
  });

  it('loads data from local storage', () => {
    const mockRowData = [{ Name: 'Stored User', Age: 40, Country: 'France' }];
    const mockColDefs = [{ field: 'Name' }, { field: 'Age' }, { field: 'Country' }];

    vi.spyOn(localStorage, 'getItem').mockImplementation(key => {
      if (key === 'rowData') return JSON.stringify(mockRowData);
      if (key === 'colDefs') return JSON.stringify(mockColDefs);
    });

    wrapper.vm.loadDataFromLocalStorage();

    expect(wrapper.vm.rowData).toEqual(mockRowData);
    expect(wrapper.vm.colDefs).toEqual(mockColDefs);
  });

  it('handles grid ready event', () => {
    const params = { api: 'mockApi' };
    wrapper.vm.onGridReady(params);

    expect(wrapper.vm.gridApi).toBe('mockApi');
  });

  // Test for cases when gridApi is not available
  it('logs a warning when gridApi is not available in deleteSelectedRows', async () => {
    wrapper.vm.gridApi = null; // Ensure gridApi is null
    console.warn = vi.fn();

    await wrapper.vm.deleteSelectedRows();

    expect(console.warn).toHaveBeenCalledWith('Grid API is not available');
  });

  it('logs a warning when gridApi is not available in addRow', async () => {
    wrapper.vm.gridApi = null; // Ensure gridApi is null
    console.warn = vi.fn();

    const newRow = { Name: 'New User', Age: 28, Country: 'Germany' };
    await wrapper.vm.addRow(newRow);

    expect(console.warn).toHaveBeenCalledWith('Grid API is not available');
  });

  it('logs a warning when no rows are selected for deletion', async () => {
    const mockGridApi = {
      getSelectedRows: vi.fn().mockReturnValue([]), // No rows selected
      applyTransaction: vi.fn(),
    };
    wrapper.vm.gridApi = mockGridApi;
    console.warn = vi.fn();

    await wrapper.vm.deleteSelectedRows();

    expect(console.warn).toHaveBeenCalledWith('No rows selected for deletion.');
  });
});
