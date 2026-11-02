'use client';
import { create } from 'zustand';
import { DutySheet, DutyRow, DutyColumn, INITIAL_DUTY_SHEETS } from '@/lib/duty-data';
import { downloadDutyExcel, downloadDutyCsv, parseUploadedExcel } from '@/lib/duty-excel';

const STORAGE_KEY = 'himalayan_fleet_duty_sheets_v3';

// Sheets that have been permanently deleted per user specification
const DELETED_SHEET_NAMES = new Set([
  'durga travels',
  'mangellan',
  'club side',
  'karan gurung',
  'beera',
  'mahendra',
  'o.n.d',
  'dues',
]);

/**
 * Automatically converts a confirmed quotation into individual Day Duty rows
 * formatted identically to the Tour Duty Register standard.
 */
export function convertQuotationToDutyRows(q: any, receipts?: any[]): DutyRow[] {
  if (!q) return [];
  const qReceipts = (receipts || []).filter((r: any) =>
    r.quotationNo === q.quotationNo || (r.bookingId && r.bookingId === q.id)
  );
  const totalReceived = qReceipts.reduce((sum: number, r: any) =>
    sum + (Number(r.amount) || Number(r.receivedAmount) || 0), 0
  );

  // Parse start date
  const startRaw = q.startDate || q.travelDate || q.date || '';
  const startDate = startRaw ? new Date(startRaw) : new Date();
  const validStart = !isNaN(startDate.getTime());

  // Format date helper: M/D/YY (e.g. 10/17/26)
  const formatDateMdy = (d: Date): string => {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const yy = String(d.getFullYear()).slice(-2);
    return `${m}/${day}/${yy}`;
  };

  const agent = (q.companyName || q.businessHouse || '').toUpperCase();
  const guest = (q.clientName || q.customerName || '').toUpperCase();
  const cellNo = q.clientPhone || q.mobile || '';
  const pax = q.passengers ? String(q.passengers) : (q.persons ? String(q.persons) : '');

  let vehicleStr = '';
  if (q.vehicles && q.vehicles.length > 0) {
    vehicleStr = q.vehicles
      .map((v: any) => `${v.vehicle || v.vehicleName || 'VEHICLE'} X ${String(v.qty || v.quantity || 1).padStart(2, '0')}`)
      .join(', ');
  } else if (q.vehicle) {
    vehicleStr = q.vehicle;
  }
  vehicleStr = vehicleStr.toUpperCase();

  const totalAmountStr = q.totalAmount ? String(q.totalAmount) : (q.baseAmount ? String(q.baseAmount) : '');
  const advStr = totalReceived > 0 ? String(totalReceived) : (q.advanceAmount ? String(q.advanceAmount) : '');
  const remarks = q.remarks || q.notes || 'HV';

  const rows: DutyRow[] = [];

  if (q.itinerary && Array.isArray(q.itinerary) && q.itinerary.length > 0) {
    q.itinerary.forEach((item: any, idx: number) => {
      const dayDate = new Date(startDate);
      if (validStart && idx > 0) {
        dayDate.setDate(dayDate.getDate() + idx);
      }
      const dateStr = validStart ? formatDateMdy(dayDate) : '';
      const heading = (item.heading || item.title || item.desc || '').replace(/[\[\]]/g, '').trim().toUpperCase();

      if (idx === 0) {
        // Day 1 holds client & costing summary
        rows.push({
          id: `duty-quote-${q.id}-${idx}`,
          col_0: dateStr,
          col_1: agent,
          col_2: guest,
          col_3: cellNo,
          col_4: pax,
          col_5: heading || (q.destination ? `TRANSFER TO ${q.destination.toUpperCase()}` : 'TOUR START'),
          col_6: vehicleStr,
          col_7: totalAmountStr,
          col_8: advStr,
          col_9: remarks,
          col_10: '',
          col_11: '',
          col_12: '',
          col_13: '',
          col_14: '',
          col_15: '',
        });
      } else {
        // Subsequent days hold daily duty
        rows.push({
          id: `duty-quote-${q.id}-${idx}`,
          col_0: dateStr,
          col_1: '',
          col_2: '',
          col_3: '',
          col_4: '',
          col_5: heading || 'SIGHTSEEING / TRANSFER',
          col_6: vehicleStr,
          col_7: '',
          col_8: '',
          col_9: remarks,
          col_10: '',
          col_11: '',
          col_12: '',
          col_13: '',
          col_14: '',
          col_15: '',
        });
      }
    });
  } else {
    // If no itinerary array, calculate duration between startDate and endDate
    let numDays = 1;
    if (q.days && Number(q.days) > 1) {
      numDays = Number(q.days);
    } else if (q.endDate && validStart) {
      const end = new Date(q.endDate);
      if (!isNaN(end.getTime())) {
        const diffDays = Math.round((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 1) numDays = diffDays;
      }
    }

    for (let idx = 0; idx < numDays; idx++) {
      const dayDate = new Date(startDate);
      if (validStart && idx > 0) {
        dayDate.setDate(dayDate.getDate() + idx);
      }
      const dateStr = validStart ? formatDateMdy(dayDate) : '';

      if (idx === 0) {
        rows.push({
          id: `duty-quote-${q.id}-${idx}`,
          col_0: dateStr,
          col_1: agent,
          col_2: guest,
          col_3: cellNo,
          col_4: pax,
          col_5: q.destination ? `${(q.pickupLocation || 'IXB / NJP').toUpperCase()} TO ${q.destination.toUpperCase()} TRANSFER` : 'TOUR TRANSFER',
          col_6: vehicleStr,
          col_7: totalAmountStr,
          col_8: advStr,
          col_9: remarks,
          col_10: '',
          col_11: '',
          col_12: '',
          col_13: '',
          col_14: '',
          col_15: '',
        });
      } else {
        rows.push({
          id: `duty-quote-${q.id}-${idx}`,
          col_0: dateStr,
          col_1: '',
          col_2: '',
          col_3: '',
          col_4: '',
          col_5: idx === numDays - 1 ? 'TRANSFER AIRPORT / RLY STATION - TOUR END' : 'LOCAL SIGHTSEEING',
          col_6: vehicleStr,
          col_7: '',
          col_8: '',
          col_9: remarks,
          col_10: '',
          col_11: '',
          col_12: '',
          col_13: '',
          col_14: '',
          col_15: '',
        });
      }
    }
  }

  return rows;
}

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

  // Column Operations
  addColumn: (sheetName: string, columnName: string, columnType?: 'text' | 'number' | 'date') => void;
  deleteColumn: (sheetName: string, colKey: string) => void;

  // Sheet Operations
  addSheet: (sheetName: string, title?: string, description?: string) => void;
  deleteSheet: (sheetName: string) => void;
  resetToOriginal: () => void;

  // Import / Export
  exportExcel: (sheetName?: string) => void;
  exportCsv: (sheetName: string) => void;
  importFile: (file: File) => Promise<{ success: boolean; count: number; error?: string }>;

  // Dynamic Confirmed Quotation Integration
  syncConfirmedQuotation: (quotation: any, receipts?: any[]) => void;
  syncConfirmedQuotations: (quotations: any[], receipts?: any[]) => void;
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
      localStorage.removeItem('himalayan_fleet_duty_sheets_v2');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((s: DutySheet) => !DELETED_SHEET_NAMES.has((s.name || '').trim().toLowerCase()));
          if (filtered.length > 0) {
            set({ sheets: filtered, isInitialized: true, activeSheetName: filtered[0].name });
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored duty sheets, using initial defaults:', err);
    }
    const cleanInitial = INITIAL_DUTY_SHEETS.filter((s) => !DELETED_SHEET_NAMES.has((s.name || '').trim().toLowerCase()));
    set({ sheets: cleanInitial, isInitialized: true, activeSheetName: cleanInitial[0]?.name || 'July August' });
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
        // Insert at the top so newly entered data immediately appears as row #1
        rowsCopy.unshift(newRow);
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

  addColumn: (sheetName, columnName, columnType = 'text') => {
    const cleanName = columnName.trim();
    if (!cleanName) return;
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      const colKey = `col_custom_${Date.now()}`;
      const newCol: DutyColumn = {
        key: colKey,
        name: cleanName,
        originalHeader: cleanName,
        type: columnType,
      };
      return {
        ...sheet,
        columns: [...sheet.columns, newCol],
      };
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

  deleteColumn: (sheetName, colKey) => {
    const { sheets } = get();
    const updated = sheets.map((sheet) => {
      if (sheet.name !== sheetName) return sheet;
      return {
        ...sheet,
        columns: sheet.columns.filter((c) => c.key !== colKey),
      };
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

  syncConfirmedQuotation: (quotation: any, receipts?: any[]) => {
    if (!quotation || (quotation.status || '').toLowerCase() !== 'confirmed') return;
    const { sheets, activeSheetName } = get();
    const targetSheet = sheets.find((s) => s.name === activeSheetName) || sheets[0];
    if (!targetSheet) return;

    const newRows = convertQuotationToDutyRows(quotation, receipts);
    if (newRows.length === 0) return;

    // Filter out any previous rows for this quotation
    const quoteRowPrefix = `duty-quote-${quotation.id}-`;
    const cleanExisting = targetSheet.rows.filter((r) => !r.id.startsWith(quoteRowPrefix));

    // Prepend new confirmed quotation rows
    const updatedRows = [...newRows, ...cleanExisting];

    const updated = sheets.map((s) => {
      if (s.name !== targetSheet.name) return s;
      return { ...s, rows: updatedRows };
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

  syncConfirmedQuotations: (quotations: any[], receipts?: any[]) => {
    if (!quotations || !Array.isArray(quotations)) return;
    const confirmed = quotations.filter((q) => (q.status || '').toLowerCase() === 'confirmed');
    if (confirmed.length === 0) return;

    const { sheets, activeSheetName } = get();
    const targetSheet = sheets.find((s) => s.name === activeSheetName) || sheets[0];
    if (!targetSheet) return;

    let rowsCopy = [...targetSheet.rows];
    let hasChanges = false;

    confirmed.forEach((q) => {
      const quoteRowPrefix = `duty-quote-${q.id}-`;
      const alreadyHas = rowsCopy.some((r) => r.id.startsWith(quoteRowPrefix));
      const newRows = convertQuotationToDutyRows(q, receipts);
      if (!alreadyHas && newRows.length > 0) {
        rowsCopy = [...newRows, ...rowsCopy];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      const updated = sheets.map((s) => {
        if (s.name !== targetSheet.name) return s;
        return { ...s, rows: rowsCopy };
      });

      set({ sheets: updated });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Storage error:', e);
        }
      }
    }
  },
}));
