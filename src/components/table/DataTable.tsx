"use client";

import React, { useMemo, useState } from "react";

export type Column<Row> = {
  key: keyof Row | string;
  header: React.ReactNode;
  className?: string;
  cellClassName?: string;
  render?: (row: Row, rowIndex: number) => React.ReactNode;
};

export type DataTableProps<Row> = {
  columns: Column<Row>[];
  rows: Row[];
  // Pagination (uncontrolled by default)
  page?: number;
  pageSize?: number;
  total?: number; // if using controlled pagination
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  compact?: boolean;
};

function range(from: number, to: number) {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

export default function DataTable<Row extends Record<string, any>>({
  columns,
  rows,
  page: pageProp,
  pageSize: pageSizeProp,
  total: totalProp,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
  compact,
}: DataTableProps<Row>) {
  const [pageState, setPageState] = useState(1);
  const [sizeState, setSizeState] = useState(pageSizeOptions[0] ?? 10);

  const page = pageProp ?? pageState;
  const pageSize = pageSizeProp ?? sizeState;

  const totalItems = totalProp ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);

  const pagedRows = useMemo(() => {
    if (totalProp) return rows; // assume parent passes sliced rows
    return rows.slice(startIdx, endIdx);
  }, [rows, startIdx, endIdx, totalProp]);

  const setPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (onPageChange) onPageChange(next);
    else setPageState(next);
  };

  const setPageSize = (size: number) => {
    if (onPageSizeChange) onPageSizeChange(size);
    else setSizeState(size);
    // reset to first page when size changes
    setPage(1);
  };

  const showPages = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return range(1, totalPages);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
    return range(start, end);
  }, [page, totalPages]);

  return (
    <div className={`w-full ${className ?? ""}`}>
      {/* Table for sm and up */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-[#E92137] to-[#1976d2] text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`text-left font-semibold px-4 py-3 whitespace-nowrap ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagedRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 ${compact ? "py-2" : "py-3.5"} text-gray-700 whitespace-nowrap ${col.cellClassName ?? ""}`}
                  >
                    {col.render ? col.render(row, startIdx + rIdx) : String(row[col.key as keyof Row] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card list for mobile */}
      <div className="sm:hidden space-y-3">
        {pagedRows.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500 border rounded-xl">No data</div>
        )}
        {pagedRows.map((row, rIdx) => (
          <div key={rIdx} className="border rounded-xl p-3 bg-white shadow-sm">
            <div className="grid grid-cols-1 gap-2">
              {columns.map((col) => (
                <div key={String(col.key)} className="flex items-start justify-between gap-3">
                  <div className="text-xs text-gray-500">{col.header}</div>
                  <div className={`text-sm text-gray-900 ${col.cellClassName ?? ""}`}>
                    {col.render ? col.render(row, startIdx + rIdx) : String(row[col.key as keyof Row] ?? "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
        <div className="text-xs text-gray-600 order-2 sm:order-1">
          {totalItems > 0 ? `${startIdx + 1}-${endIdx} of ${totalItems} items` : "0 items"}
        </div>
        <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1">
            <button
              className="px-2.5 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {showPages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1.5 rounded-md border ${
                    p === page ? "bg-[#FDE8EB] border-[#E92137] text-[#C81D30]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="px-2.5 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <select
              className="border rounded-md px-2 py-1.5 bg-white"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>Items per page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
