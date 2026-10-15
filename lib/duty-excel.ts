import * as XLSX from 'xlsx';
import { DutySheet, DutyRow, DutyColumn } from '@/lib/duty-data';

/**
 * Generates an Excel workbook from DutySheets matching the exact column names of New Duty.xlsx
 */
export function generateDutyWorkbook(sheets: DutySheet[], targetSheetName?: string): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const sheetsToExport = targetSheetName && targetSheetName !== 'all'
    ? sheets.filter(s => s.name === targetSheetName)
    : sheets;

  for (const sheet of sheetsToExport) {
    // Row 0: Headers (exact original header names from New Duty.xlsx)
    const headerRow = sheet.columns.map(c => c.originalHeader);

    // Data rows
    const dataRows = sheet.rows.map(row => {
      return sheet.columns.map(col => row[col.key] || '');
    });

    const aoa = [headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Calculate nice column widths
    const colWidths = sheet.columns.map((col, idx) => {
      let maxLen = (col.originalHeader || '').length;
      for (const r of sheet.rows) {
        const val = r[col.key];
        if (val && String(val).length > maxLen) {
          maxLen = Math.min(String(val).length, 60);
        }
      }
      return { wch: Math.max(maxLen + 3, 12) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  }

  return wb;
}

/**
 * Triggers a browser download of the Excel file
 */
export function downloadDutyExcel(sheets: DutySheet[], targetSheetName?: string, fileName?: string) {
  const wb = generateDutyWorkbook(sheets, targetSheetName);
  const name = fileName || (targetSheetName && targetSheetName !== 'all' ? `${targetSheetName}.xlsx` : 'New Duty.xlsx');
  
  // Use XLSX.write to ArrayBuffer for reliable client-side downloading
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads active sheet as CSV
 */
export function downloadDutyCsv(sheet: DutySheet, fileName?: string) {
  const headerRow = sheet.columns.map(c => c.originalHeader);
  const dataRows = sheet.rows.map(row => sheet.columns.map(col => {
    const val = row[col.key] || '';
    return `"${String(val).replace(/"/g, '""')}"`;
  }));

  const csvContent = [headerRow.map(h => `"${h.replace(/"/g, '""')}"`).join(','), ...dataRows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `${sheet.name}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses an uploaded .xlsx file into DutySheets
 */
export async function parseUploadedExcel(file: File): Promise<DutySheet[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', raw: false });

  const importedSheets: DutySheet[] = [];

  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    if (!ws) continue;

    const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
    if (!raw || raw.length === 0) continue;

    // Find header row (row with most non-empty string cells)
    let headerRowIdx = 0;
    let maxCols = 0;
    for (let r = 0; r < Math.min(5, raw.length); r++) {
      const nonEmpties = (raw[r] || []).filter(c => c !== '').length;
      if (nonEmpties > maxCols) {
        maxCols = nonEmpties;
        headerRowIdx = r;
      }
    }

    const rawHeaders = raw[headerRowIdx] || [];
    const columns: DutyColumn[] = [];
    const colIndices: number[] = [];

    rawHeaders.forEach((h: any, idx: number) => {
      const headerStr = String(h || '').trim();
      if (headerStr) {
        columns.push({
          key: `col_${columns.length}`,
          name: headerStr,
          originalHeader: headerStr,
          type: headerStr.toLowerCase().includes('date') ? 'date' :
                (headerStr.toLowerCase().includes('amount') || headerStr.toLowerCase().includes('cost') || headerStr.toLowerCase().includes('fuel') || headerStr.toLowerCase().includes('driver') || headerStr.toLowerCase().includes('pax')) ? 'number' : 'text'
        });
        colIndices.push(idx);
      }
    });

    if (columns.length === 0) continue;

    const rows: DutyRow[] = [];
    for (let r = headerRowIdx + 1; r < raw.length; r++) {
      const row = raw[r] || [];
      const rowObj: DutyRow = { id: `imp-${name}-${r}-${Date.now()}` };
      let hasVal = false;
      columns.forEach((col, cIdx) => {
        const rawIdx = colIndices[cIdx];
        const val = row[rawIdx] !== undefined ? String(row[rawIdx]).trim() : '';
        rowObj[col.key] = val;
        if (val !== '') hasVal = true;
      });
      if (hasVal) {
        rows.push(rowObj);
      }
    }

    importedSheets.push({
      name,
      title: `${name} Duty Register`,
      description: `Imported duty sheet from ${file.name}`,
      columns,
      rows
    });
  }

  return importedSheets;
}
