'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useDutyStore } from '@/lib/store/use-duty-store';
import { DutyColumn, DutyRow, parseDutyDate } from '@/lib/duty-data';
import { Button, cn } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  DollarSign,
  TrendingUp,
  Car,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowDownToLine,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export default function DutyRegisterPage() {
  const {
    sheets,
    activeSheetName,
    searchQuery,
    isInitialized,
    initialize,
    setActiveSheet,
    setSearchQuery,
    updateCell,
    updateRow,
    addRow,
    deleteRow,
    duplicateRow,
    addSheet,
    deleteSheet,
    resetToOriginal,
    exportExcel,
    exportCsv,
    importFile,
  } = useDutyStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state
  const [editingCell, setEditingCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [isEditRowOpen, setIsEditRowOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Form row state
  const [activeRowData, setActiveRowData] = useState<Record<string, string>>({});
  const [targetRowId, setTargetRowId] = useState<string | null>(null);
  const [newSheetName, setNewSheetName] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Initialize store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeSheet = useMemo(() => {
    return sheets.find((s) => s.name === activeSheetName) || sheets[0];
  }, [sheets, activeSheetName]);

  // Dynamic date column key for active sheet
  const activeDateColKey = useMemo(() => {
    if (!activeSheet) return 'col_0';
    const found = activeSheet.columns.find((c) =>
      c.type === 'date' ||
      c.name.toLowerCase().includes('date') ||
      c.originalHeader.toLowerCase().includes('date')
    );
    return found ? found.key : 'col_0';
  }, [activeSheet]);

  // Sorting state - defaults to Date column in descending order
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Reset pagination & default sort to descending when active sheet changes
  useEffect(() => {
    setCurrentPage(1);
    setEditingCell(null);
    setSortKey(null);
    setSortDirection('desc');
  }, [activeSheetName]);

  const handleSort = (colKey: string) => {
    const currentKey = sortKey || activeDateColKey;
    if (currentKey === colKey) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(colKey);
      setSortDirection('desc');
    }
  };

  // Filtered and sorted rows based on search & column sorting
  const filteredRows = useMemo(() => {
    if (!activeSheet || !activeSheet.rows) return [];
    let rows = activeSheet.rows;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter((row) => {
        return Object.entries(row).some(([key, val]) => {
          if (key === 'id') return false;
          return String(val || '').toLowerCase().includes(q);
        });
      });
    }

    const currentKey = sortKey || activeDateColKey;
    const isDateCol =
      activeSheet.columns.find((c) => c.key === currentKey)?.type === 'date' ||
      activeSheet.columns.find((c) => c.key === currentKey)?.name.toLowerCase().includes('date') ||
      activeSheet.columns.find((c) => c.key === currentKey)?.originalHeader.toLowerCase().includes('date');

    const indexed = rows.map((row, idx) => ({
      row,
      origIdx: idx,
      dateTs: isDateCol ? parseDutyDate(row[currentKey]) : null,
      val: (row[currentKey] || '').trim(),
    }));

    indexed.sort((a, b) => {
      if (isDateCol) {
        if (a.dateTs !== null && b.dateTs !== null) {
          if (a.dateTs !== b.dateTs) {
            return sortDirection === 'desc' ? b.dateTs - a.dateTs : a.dateTs - b.dateTs;
          }
          return a.origIdx - b.origIdx;
        }
        if (a.dateTs !== null) return -1;
        if (b.dateTs !== null) return 1;
        return a.origIdx - b.origIdx;
      }

      // Numeric comparison
      const numA = parseFloat(a.val.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(b.val.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numA) && !isNaN(numB) && a.val !== '' && b.val !== '') {
        if (numA !== numB) {
          return sortDirection === 'desc' ? numB - numA : numA - numB;
        }
        return a.origIdx - b.origIdx;
      }

      // Text comparison
      if (a.val && b.val) {
        const cmp = a.val.localeCompare(b.val, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) {
          return sortDirection === 'desc' ? -cmp : cmp;
        }
        return a.origIdx - b.origIdx;
      }
      if (a.val) return -1;
      if (b.val) return 1;
      return a.origIdx - b.origIdx;
    });

    return indexed.map((item) => item.row);
  }, [activeSheet, searchQuery, sortKey, sortDirection, activeDateColKey]);

  // Pagination slices
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    if (pageSize === 0) return filteredRows; // All
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Compute Sheet KPIs
  const metrics = useMemo(() => {
    if (!activeSheet || !activeSheet.rows) {
      return { totalRows: 0, totalAmount: 0, totalAdvance: 0, totalFuel: 0, totalDriver: 0 };
    }

    let totalAmount = 0;
    let totalAdvance = 0;
    let totalFuel = 0;
    let totalDriver = 0;

    for (const r of activeSheet.rows) {
      // Find amount columns
      for (const col of activeSheet.columns) {
        const h = col.originalHeader.toLowerCase();
        const rawVal = r[col.key];
        if (!rawVal) continue;
        const num = parseFloat(String(rawVal).replace(/[^0-9.-]/g, '')) || 0;

        if (h === 'amount' || h === 'costing' || h === 'costing /r' || h === 'payment' || h === 'due amount') {
          totalAmount += num;
        } else if (h.includes('adv') || h === 'advance.') {
          totalAdvance += num;
        } else if (h === 'fuel') {
          totalFuel += num;
        } else if (h === 'driver') {
          totalDriver += num;
        }
      }
    }

    return {
      totalRows: activeSheet.rows.length,
      totalAmount,
      totalAdvance,
      totalFuel,
      totalDriver,
    };
  }, [activeSheet]);

  // Inline Cell Edit Handlers
  const handleStartCellEdit = (rowId: string, colKey: string, currentVal: string) => {
    setEditingCell({ rowId, colKey });
    setCellValue(currentVal || '');
  };

  const handleSaveCellEdit = () => {
    if (!editingCell || !activeSheet) return;
    updateCell(activeSheet.name, editingCell.rowId, editingCell.colKey, cellValue);
    setEditingCell(null);
    showNotice('Cell updated & saved');
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveCellEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const showNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Row Modal Handlers
  const handleOpenAddRow = () => {
    const initial: Record<string, string> = {};
    if (activeSheet) {
      activeSheet.columns.forEach((col) => {
        initial[col.key] = '';
      });
    }
    setActiveRowData(initial);
    setIsAddRowOpen(true);
  };

  const handleSaveAddRow = () => {
    if (!activeSheet) return;
    addRow(activeSheet.name, activeRowData);
    setIsAddRowOpen(false);
    showNotice('New duty record added successfully');
  };

  const handleOpenEditRow = (row: DutyRow) => {
    const data: Record<string, string> = {};
    if (activeSheet) {
      activeSheet.columns.forEach((col) => {
        data[col.key] = row[col.key] || '';
      });
    }
    setTargetRowId(row.id);
    setActiveRowData(data);
    setIsEditRowOpen(true);
  };

  const handleSaveEditRow = () => {
    if (!activeSheet || !targetRowId) return;
    updateRow(activeSheet.name, targetRowId, activeRowData);
    setIsEditRowOpen(false);
    showNotice('Duty record updated');
  };

  const handleDeleteRow = (rowId: string) => {
    if (!activeSheet) return;
    if (confirm('Are you sure you want to delete this duty record?')) {
      deleteRow(activeSheet.name, rowId);
      showNotice('Record deleted');
    }
  };

  const handleDuplicateRow = (rowId: string) => {
    if (!activeSheet) return;
    duplicateRow(activeSheet.name, rowId);
    showNotice('Record duplicated');
  };

  // Sheet creation
  const handleCreateSheet = () => {
    const name = newSheetName.trim();
    if (!name) return;
    addSheet(name);
    setNewSheetName('');
    setIsAddSheetOpen(false);
    showNotice(`Sheet "${name}" created`);
  };

  // Excel File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importFile(file);
    if (res.success) {
      showNotice(`Imported ${res.count} sheets from ${file.name}`);
    } else {
      alert(`Import error: ${res.error || 'Failed to parse'}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Check if row is a section header (like "October", "November" where only 1 cell has value)
  const isSectionDividerRow = (row: DutyRow) => {
    if (!activeSheet) return false;
    const values = activeSheet.columns.map((c) => (row[c.key] || '').trim()).filter(Boolean);
    return values.length === 1 && values[0].length < 35 && !values[0].includes('http');
  };

  if (!isInitialized) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 animate-spin text-green-700" />
          <span className="text-sm font-medium text-muted-foreground">Loading Duty Register...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {saveSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-green-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-green-950 dark:hover:text-green-300 transition-colors group mb-0.5"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-900 text-white shadow-sm shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Duty Register & Spreadsheets
                <Badge variant="outline" className="border-green-700 bg-green-50 text-green-800 text-[11px] font-semibold">
                  New Duty.xlsx
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage, manually input, edit, and download duty sheets with 100% exact columns from the Excel file
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-green-950 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              title="Return to Home Dashboard"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 gap-1.5 border-gray-300 text-xs font-medium hover:bg-gray-100 dark:border-gray-700"
            title="Import updated Excel file (.xlsx)"
          >
            <Upload className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
            <span>Import Excel</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportMenuOpen(true)}
            className="h-9 gap-1.5 border-green-800 bg-green-50/50 text-xs font-semibold text-green-900 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-300"
          >
            <Download className="h-3.5 w-3.5 text-green-800 dark:text-green-300" />
            <span>Download Excel</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAddRow}
            className="h-9 gap-1.5 bg-yellow-600 text-xs font-semibold text-white shadow-sm hover:bg-yellow-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Duty Record</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-red-600"
            title="Reset to Original Excel File"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Records</span>
            <Layers className="h-4 w-4 text-green-700" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {metrics.totalRows}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            In {activeSheet?.name}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Amount / Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
            ₹{metrics.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Costing & charges
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Advance Received</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
            ₹{metrics.totalAdvance.toLocaleString('en-IN')}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Paid deposits
          </div>
        </div>

        {metrics.totalFuel > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Fuel Cost</span>
              <Car className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
              ₹{metrics.totalFuel.toLocaleString('en-IN')}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Logged fuel expenses
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Columns Count</span>
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-purple-700 dark:text-purple-400">
            {activeSheet?.columns.length || 0}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Exact Excel header keys
          </div>
        </div>
      </div>

      {/* Sheet Tabs Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-950 dark:text-green-100">
            <span>Workbook Sheets</span>
            <span className="text-muted-foreground font-normal">({sheets.length} sheets)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddSheetOpen(true)}
              className="h-7 gap-1 text-[11px] border-dashed text-green-900 hover:border-green-800 hover:bg-green-50"
            >
              <Plus className="h-3 w-3" />
              <span>New Sheet / Month</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {sheets.map((sheet) => {
            const isActive = sheet.name === activeSheetName;
            return (
              <button
                key={sheet.name}
                onClick={() => setActiveSheet(sheet.name)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 shrink-0 border',
                  isActive
                    ? 'border-green-900 bg-green-900 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'
                )}
              >
                <FileSpreadsheet className={cn('h-3.5 w-3.5', isActive ? 'text-yellow-400' : 'text-gray-400')} />
                <span>{sheet.name}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {sheet.rows.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-soft dark:border-gray-800 dark:bg-gray-900">
        {/* Table Controls Header */}
        <div className="flex flex-col gap-3 p-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search in ${activeSheet?.name} (by guest, agent, vehicle, phone)...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs rounded-lg bg-gray-50/50 dark:bg-gray-950 border-gray-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-gray-900"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs dark:border-gray-800 dark:bg-gray-900"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>All ({filteredRows.length})</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCsv(activeSheet.name)}
              className="h-8 text-xs gap-1 border-gray-200"
            >
              <ArrowDownToLine className="h-3 w-3" />
              <span>CSV</span>
            </Button>
          </div>
        </div>

        {/* Informative Sub-header */}
        <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-900/60 border-b flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{activeSheet?.title}</span>
            <span>•</span>
            <span>{activeSheet?.description}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">💡 Tip: Double-click or click any cell to edit directly!</span>
          </div>
        </div>

        {/* The Spreadsheet Table */}
        <div className="relative overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-20 bg-green-950 text-white shadow-sm">
              <tr>
                <th className="sticky left-0 z-30 bg-green-950 px-3 py-3 w-12 text-center text-[11px] font-bold tracking-wider uppercase border-r border-green-800">
                  #
                </th>
                {activeSheet?.columns.map((col, idx) => {
                  const currentSortKey = sortKey || activeDateColKey;
                  const isCurrentSort = currentSortKey === col.key;

                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "px-3 py-3 font-semibold text-[11px] tracking-wide whitespace-nowrap border-r border-green-900 last:border-r-0 cursor-pointer select-none transition-colors hover:bg-green-900/80 group",
                        isCurrentSort && "bg-green-900/90"
                      )}
                      title={`Click to sort by ${col.name} (${isCurrentSort && sortDirection === 'desc' ? 'ascending' : 'descending'})`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex flex-col">
                          <span className="text-white flex items-center gap-1">
                            {col.originalHeader}
                          </span>
                          {col.name !== col.originalHeader && (
                            <span className="text-[9px] text-green-300 font-normal">({col.name})</span>
                          )}
                        </div>
                        <div className="flex items-center text-green-300 shrink-0">
                          {isCurrentSort ? (
                            sortDirection === 'desc' ? (
                              <ArrowDown className="h-3.5 w-3.5 text-yellow-400 font-bold" />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5 text-yellow-400 font-bold" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
                <th className="sticky right-0 z-30 bg-green-950 px-3 py-3 text-center text-[11px] font-bold uppercase border-l border-green-800 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={(activeSheet?.columns.length || 0) + 2}
                    className="p-12 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-gray-300" />
                      <p className="font-medium text-gray-600 dark:text-gray-400">
                        No duty records found in this sheet.
                      </p>
                      <Button
                        size="sm"
                        onClick={handleOpenAddRow}
                        className="mt-2 h-8 text-xs bg-green-900 text-white hover:bg-green-800"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add First Record
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rIdx) => {
                  const absoluteIndex = (currentPage - 1) * pageSize + rIdx + 1;
                  const isDivider = isSectionDividerRow(row);

                  if (isDivider) {
                    const firstVal = Object.entries(row).find(
                      ([k, v]) => k !== 'id' && String(v).trim() !== ''
                    )?.[1];
                    return (
                      <tr key={row.id} className="bg-green-100/60 dark:bg-green-950/40">
                        <td className="sticky left-0 bg-green-100/90 dark:bg-green-950/90 px-3 py-2 text-center font-bold text-green-900 text-[10px] border-r">
                          {absoluteIndex}
                        </td>
                        <td
                          colSpan={(activeSheet?.columns.length || 0) + 1}
                          className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-green-950 dark:text-green-200"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-green-800" />
                            <span>{firstVal}</span>
                            <Badge variant="outline" className="text-[10px] bg-white text-green-900 border-green-300">
                              Section Header
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={row.id}
                      className="group transition-colors hover:bg-green-50/40 dark:hover:bg-green-950/20"
                    >
                      {/* Row Index */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-green-50/90 dark:bg-gray-900 dark:group-hover:bg-green-950/90 px-3 py-2 text-center text-[11px] text-muted-foreground border-r border-gray-100 dark:border-gray-800 font-mono">
                        {absoluteIndex}
                      </td>

                      {/* Cells */}
                      {activeSheet?.columns.map((col) => {
                        const val = row[col.key] || '';
                        const isEditing =
                          editingCell?.rowId === row.id && editingCell?.colKey === col.key;

                        return (
                          <td
                            key={col.key}
                            onDoubleClick={() => handleStartCellEdit(row.id, col.key, val)}
                            className="px-3 py-2 border-r border-gray-100 dark:border-gray-800 whitespace-nowrap text-[12px] max-w-xs truncate cursor-pointer hover:bg-yellow-50/80 dark:hover:bg-yellow-950/30 transition-colors"
                            title="Click or double-click to edit cell"
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  autoFocus
                                  value={cellValue}
                                  onChange={(e) => setCellValue(e.target.value)}
                                  onKeyDown={handleCellKeyDown}
                                  onBlur={handleSaveCellEdit}
                                  className="h-7 text-xs px-1.5 py-0 rounded border-green-700 bg-white shadow-sm ring-1 ring-green-600"
                                />
                                <button
                                  onClick={handleSaveCellEdit}
                                  className="p-1 rounded bg-green-700 text-white hover:bg-green-800"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between group/cell">
                                <span
                                  className={cn(
                                    val ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-700 italic text-[11px]'
                                  )}
                                >
                                  {val || '—'}
                                </span>
                                <Pencil
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartCellEdit(row.id, col.key, val);
                                  }}
                                  className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover/cell:opacity-100 hover:text-green-800 transition-opacity ml-1.5"
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Action buttons */}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-green-50/90 dark:bg-gray-900 dark:group-hover:bg-green-950/90 px-2 py-1.5 text-center border-l border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditRow(row)}
                            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-green-800 dark:hover:bg-gray-800"
                            title="Edit full row"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateRow(row.id)}
                            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-800 dark:hover:bg-gray-800"
                            title="Duplicate record"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                            title="Delete record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="flex flex-col gap-3 p-4 border-t sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div>
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pageSize === 0 ? filteredRows.length : Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredRows.length}</span> entries
            {searchQuery && ' (filtered)'}
          </div>

          {pageSize > 0 && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 text-xs border-gray-200"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
              <div className="px-2 text-xs font-semibold">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-2 text-xs border-gray-200"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Add Duty Record */}
      <Dialog open={isAddRowOpen} onOpenChange={setIsAddRowOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-green-950">
              <Plus className="h-5 w-5 text-yellow-600" />
              <span>Add Duty Record to {activeSheet?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2">
            {activeSheet?.columns.map((col) => (
              <div key={col.key} className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">
                  {col.originalHeader}
                  {col.name !== col.originalHeader && (
                    <span className="text-[10px] text-muted-foreground ml-1">({col.name})</span>
                  )}
                </Label>
                <Input
                  value={activeRowData[col.key] || ''}
                  onChange={(e) =>
                    setActiveRowData((prev) => ({ ...prev, [col.key]: e.target.value }))
                  }
                  placeholder={`Enter ${col.originalHeader}...`}
                  className="h-9 text-xs"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddRowOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAddRow}
              className="bg-green-900 text-white hover:bg-green-800"
            >
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Edit Full Row */}
      <Dialog open={isEditRowOpen} onOpenChange={setIsEditRowOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-green-950">
              <Pencil className="h-5 w-5 text-green-700" />
              <span>Edit Duty Record ({activeSheet?.name})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2">
            {activeSheet?.columns.map((col) => (
              <div key={col.key} className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">
                  {col.originalHeader}
                  {col.name !== col.originalHeader && (
                    <span className="text-[10px] text-muted-foreground ml-1">({col.name})</span>
                  )}
                </Label>
                <Input
                  value={activeRowData[col.key] || ''}
                  onChange={(e) =>
                    setActiveRowData((prev) => ({ ...prev, [col.key]: e.target.value }))
                  }
                  className="h-9 text-xs"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditRowOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEditRow}
              className="bg-green-900 text-white hover:bg-green-800"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add New Sheet */}
      <Dialog open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-green-950">
              Create New Duty Sheet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Sheet Name (e.g. Month / Vendor)</Label>
              <Input
                placeholder="e.g. November December, January 2027..."
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Will inherit standard duty register column structure.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateSheet}
              disabled={!newSheetName.trim()}
              className="bg-green-900 text-white hover:bg-green-800"
            >
              Create Sheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Download Excel Options */}
      <Dialog open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-green-950">
              <Download className="h-4 w-4 text-green-800" />
              <span>Download Excel File</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <p className="text-xs text-muted-foreground">
              Choose your export option. The exported file will maintain all original column names and formatting.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  exportExcel();
                  setIsExportMenuOpen(false);
                  showNotice('Downloading complete New Duty.xlsx (all sheets)...');
                }}
                className="flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-green-50/70 border-green-800/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-900 text-white shrink-0">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-green-950">
                    Complete Workbook (All {sheets.length} Sheets)
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Exports New Duty.xlsx containing all sheets with all your edits and inputs.
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  exportExcel(activeSheet.name);
                  setIsExportMenuOpen(false);
                  showNotice(`Downloading ${activeSheet.name}.xlsx...`);
                }}
                className="flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-yellow-50/70 border-yellow-800/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-600 text-white shrink-0">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    Current Active Sheet Only ({activeSheet.name})
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Exports only the {activeSheet.name} sheet ({activeSheet.rows.length} records) as an Excel file.
                  </div>
                </div>
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsExportMenuOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Reset Confirmation */}
      <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Reset to Original Excel File?</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">
            This will discard your manual changes and revert all sheets back to the original content of New Duty.xlsx.
            This action cannot be undone.
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                resetToOriginal();
                setIsResetConfirmOpen(false);
                showNotice('Reset back to original Excel data');
              }}
            >
              Reset Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
