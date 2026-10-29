'use client';
import { create } from 'zustand';
import { DutySheet, DutyRow, DutyColumn, INITIAL_DUTY_SHEETS } from '@/lib/duty-data';
import { downloadDutyExcel, downloadDutyCsv, parseUploadedExcel } from '@/lib/duty-excel';

const STORAGE_KEY = 'himalayan_fleet_duty_sheets_v2';

interface DutyState {
  sheets: DutySheet[];
  activeSheetName: string;
  searchQuery: string;
  isInitialized: boolean;
  selectedRowId: string | null;

  // Actions
  initialize: () => void;
  setActiveSheet: (name: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedRowId: (id: string | null) => void;

  // Row Operations
  updateCell: (sheetName: string, rowId: string, colKey: string, value: string) => void;
  updateRow: (sheetName: string, rowId: string, updatedData: Record<string, string>) => void;
  addRow: (sheetName: string, rowData: Record<string, string>, insertAtIndex?: number) => void;
  deleteRow: (sheetName: string, rowId: string) => void;
  duplicateRow: (sheetName: string, rowId: string) => void;
  reorderRow: (sheetName: string, fromIndex: number, toIndex: number) => void;

  // Sheet Operations
  addSheet: (sheetName: string, title?: string, description?: string) => void;
  deleteSheet: (sheetName: string) => void;
  resetToOriginal: () => void;

  // Import / Export
  exportExcel: (sheetName?: string) => void;
  exportCsv: (sheetName: string) => void;
  importFile: (file: File) => Promise<{ success: boolean; count: number; error?: string }>;
}

export const useDutyStore = create<DutyState>((set, get) => ({
  sheets: INITIAL_DUTY_SHEETS,
  activeSheetName: 'July August',
  searchQuery: '',
  isInitialized: false,
  selectedRowId: null,

  initialize: () => {
    if (typeof window === 'undefined') return;
    try {
      // Clear legacy cache if present
      localStorage.removeItem('himalayan_fleet_duty_sheets_v1');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ sheets: parsed, isInitialized: true });
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored duty sheets, using initial defaults:', err);
    }
    set({ sheets: INITIAL_DUTY_SHEETS, isInitialized: true });
  },

  setActiveSheet: (name) => {
    set({ activeSheetName: name, selectedRowId: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedRowId: (id) => {
    set({ selectedRowId: id });
  },

  updateCell: (sheetName, rowId, colKey, value) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const updatedRows = sheet.rows.map((row) => {
        if (row.id !== rowId) return row;
        return { ...row, [colKey]: value };
      });
      return { ...sheet, rows: updatedRows };
    });

    set({ sheets: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  updateRow: (sheetName, rowId, updatedData) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const updatedRows = sheet.rows.map((row) => {
        if (row.id !== rowId) return row;
        return { ...row, ...updatedData };
      });
      return { ...sheet, rows: updatedRows };
    });

    set({ sheets: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  addRow: (sheetName, rowData, insertAtIndex) => {
    const { sheets } = get();
    const newId = `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRow: DutyRow = { id: newId, ...rowData };

    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const rowsCopy = [...sheet.rows];
      if (typeof insertAtIndex === 'number' && insertAtIndex >= 0 && insertAtIndex <= rowsCopy.length) {
        rowsCopy.splice(insertAtIndex, 0, newRow);
      } else {
        rowsCopy.push(newRow);
      }
      return { ...sheet, rows: rowsCopy };
    });

    set({ sheets: updated, selectedRowId: newId });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  deleteRow: (sheetName, rowId) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      return {
        ...sheet,
        rows: sheet.rows.filter((r) => r.id !== rowId),
      };
    });

    set({ sheets: updated, selectedRowId: null });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  duplicateRow: (sheetName, rowId) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const idx = sheet.rows.findIndex((r) => r.id === rowId);
      if (idx === -1) return sheet;
      const target = sheet.rows[idx];
      const dup: DutyRow = {
        ...target,
        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      const newRows = [...sheet.rows];
      newRows.splice(idx + 1, 0, dup);
      return { ...sheet, rows: newRows };
    });

    set({ sheets: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  reorderRow: (sheetName, fromIndex, toIndex) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const rowsCopy = [...sheet.rows];
      const [moved] = rowsCopy.splice(fromIndex, 1);
      rowsCopy.splice(toIndex, 0, moved);
      return { ...sheet, rows: rowsCopy };
    });

    set({ sheets: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  addSheet: (sheetName, title, description) => {
    const { sheets } = get();
    const cleanName = sheetName.trim();
    if (!cleanName || sheets.some((s) => s.name.toLowerCase() === cleanName.toLowerCase())) {
      return;
    }

    // Default template columns based on main July August register
    const defaultCols: DutyColumn[] = [
      { key: 'col_0', name: 'Date', originalHeader: 'Date', type: 'date' },
      { key: 'col_1', name: 'Agent', originalHeader: 'Agent', type: 'text' },
      { key: 'col_2', name: 'Guest', originalHeader: 'Guest', type: 'text' },
      { key: 'col_3', name: 'Cell no', originalHeader: 'Cell no', type: 'text' },
      { key: 'col_4', name: 'Pax', originalHeader: 'Pax', type: 'number' },
      { key: 'col_5', name: 'Itinerary', originalHeader: 'Itinerary', type: 'text' },
      { key: 'col_6', name: 'Vehicle', originalHeader: 'Vehicle', type: 'text' },
      { key: 'col_7', name: 'Amount', originalHeader: 'Amount', type: 'number' },
      { key: 'col_8', name: 'Adv Status', originalHeader: 'Adv Status', type: 'text' },
      { key: 'col_9', name: 'Remarks', originalHeader: 'Remarks', type: 'text' },
      { key: 'col_10', name: 'Vehicle (Vendor)', originalHeader: 'Vehicle', type: 'text' },
      { key: 'col_11', name: 'Fuel', originalHeader: 'Fuel', type: 'number' },
      { key: 'col_12', name: 'Driver', originalHeader: 'Driver', type: 'text' },
      { key: 'col_13', name: 'Vendor', originalHeader: 'Vendor', type: 'text' },
      { key: 'col_14', name: 'Amount.', originalHeader: 'Amount.', type: 'number' },
      { key: 'col_15', name: 'REMARKS', originalHeader: 'REMARKS', type: 'text' },
    ];

    const newSheet: DutySheet = {
      name: cleanName,
      title: title || `${cleanName} Duty Register`,
      description: description || `Duty and tour operational records for ${cleanName}`,
      columns: defaultCols,
      rows: [],
    };

    const updated = [...sheets, newSheet];
    set({ sheets: updated, activeSheetName: cleanName });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  deleteSheet: (sheetName) => {
    const { sheets, activeSheetName } = get();
    if (sheets.length <= 1) return; // Keep at least one sheet
    const updated = sheets.filter((s) => s.name !== sheetName);
    const nextActive = activeSheetName === sheetName ? updated[0].name : activeSheetName;

    set({ sheets: updated, activeSheetName: nextActive });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  resetToOriginal: () => {
    set({ sheets: INITIAL_DUTY_SHEETS, activeSheetName: 'July August', selectedRowId: null });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  },

  exportExcel: (sheetName) => {
    const { sheets } = get();
    downloadDutyExcel(sheets, sheetName);
  },

  exportCsv: (sheetName) => {
    const { sheets } = get();
    const sheet = sheets.find((s) => s.name === sheetName);
    if (sheet) {
      downloadDutyCsv(sheet);
    }
  },

  importFile: async (file) => {
    try {
      const imported = await parseUploadedExcel(file);
      if (!imported || imported.length === 0) {
        return { success: false, count: 0, error: 'No valid sheets found in Excel file' };
      }

      const { sheets } = get();
      // Merge or update sheets
      const sheetMap = new Map(sheets.map((s) => [s.name.toLowerCase(), s]));
      for (const imp of imported) {
        sheetMap.set(imp.name.toLowerCase(), imp);
      }

      const merged = Array.from(sheetMap.values());
      set({ sheets: merged, activeSheetName: imported[0].name });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {
          console.error('Storage error:', e);
        }
      }

      return { success: true, count: imported.length };
    } catch (err: any) {
      console.error('Failed to import Excel file:', err);
      return { success: false, count: 0, error: err.message || 'Error parsing file' };
    }
  },
}));
