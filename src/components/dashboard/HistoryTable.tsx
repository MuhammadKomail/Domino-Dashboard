import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import DataTable, { Column } from '@/components/table/DataTable';
import { usePathname, useRouter } from 'next/navigation';

type HistoryRow = {
  ts: string;
  gallons: number;
  cycle: number;
  timeouts: number;
  totalGallons: number;
  totalCycles: number;
  totalTimeouts: number;
  battery: number;
};

const fallbackRows: HistoryRow[] = Array.from({ length: 18 }).map((_, i) => ({
  ts: `2025-06-1${i} 08:06:40`,
  gallons: 2800 + (i % 7) * 15,
  cycle: 4000,
  timeouts: i % 9 === 0 ? 1 : 0,
  totalGallons: 114654 + i * 120,
  totalCycles: 327583 + i * 7,
  totalTimeouts: 575 + Math.floor(i / 6),
  battery: 12.8 + (i % 6) * 0.2,
}));

const columns: Column<HistoryRow>[] = [
  { key: 'ts', header: 'Timestamp' },
  { key: 'gallons', header: 'Gallons' },
  { key: 'cycle', header: 'Cycle' },
  { key: 'timeouts', header: 'Timeouts' },
  { key: 'totalGallons', header: 'Total Gallons' },
  { key: 'totalCycles', header: 'Total Cycles' },
  { key: 'totalTimeouts', header: 'Total Timeouts' },
  { key: 'battery', header: 'Battery Voltage', render: (r) => r.battery.toFixed(1) },
];

const HistoryTable: React.FC<{ deviceSerial?: string }> = ({ deviceSerial }) => {
  const [range, setRange] = React.useState<'24h' | '7d' | '30d'>('7d');
  const router = useRouter();
  const pathname = usePathname();
  const [rows, setRows] = React.useState<HistoryRow[] | null>(null);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(() => {
    let ignore = false;
    if (!deviceSerial) { setRows(fallbackRows); setTotal(fallbackRows.length); return; }
    (async () => {
      try {
        const token = (() => { try { const m = document.cookie.match(/(?:^|; )AuthToken=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch { return null; } })();
        const url = `/admin/api/devices/${encodeURIComponent(deviceSerial)}/history?range=${range}&page=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
        const json = await res.json().catch(() => ({} as any));
        if (ignore) return;
        if (res.ok && Array.isArray(json?.rows)) {
          setRows(json.rows as HistoryRow[]);
          setTotal(Number(json.total) || (json.rows as any[]).length);
        } else {
          setRows([]); setTotal(0);
        }
      } catch { if (!ignore) { setRows([]); setTotal(0); } }
    })();
    return () => { ignore = true; };
  }, [deviceSerial, range, page, pageSize]);

  const exportCsv = () => {
    const header = ['Timestamp','Gallons','Cycle','Timeouts','Total Gallons','Total Cycles','Total Timeouts','Battery Voltage'];
    const lines = rows.map(r => [r.ts, r.gallons, r.cycle, r.timeouts, r.totalGallons, r.totalCycles, r.totalTimeouts, r.battery.toFixed(1)].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-base font-semibold">History</div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e)=>{ setRange(e.target.value as any); setPage(1); }}
            className="px-3 py-1.5 bg-white border rounded-md text-sm text-gray-700"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 1 Month</option>
          </select>
          {/* Expand fullscreen */}
          <button
            type="button"
            onClick={()=>{
              const url = `${pathname}?view=history`;
              router.push(url);
            }}
            className="p-2 rounded-md border hover:bg-gray-50"
            title="Fullscreen"
            aria-label="Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" strokeWidth="1.5"/></svg>
          </button>
          {/* Save/Export */}
          <button
            type="button"
            onClick={exportCsv}
            className="p-2 rounded-md border hover:bg-gray-50"
            title="Save CSV"
            aria-label="Save CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </div>
      {rows === null ? (
        <div className="fixed inset-0 z-40 bg-white/60 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-[#E92137] animate-spin" />
        </div>
      ) : (
      <DataTable<HistoryRow>
        columns={columns}
        rows={rows || []}
        pageSizeOptions={[10, 20, 50]}
        total={total}
        page={page}
        onPageChange={(p)=>setPage(p)}
        pageSize={pageSize}
        onPageSizeChange={(s)=>{ setPageSize(s); setPage(1); }}
      />
      )}
    </div>
  );
};

export default HistoryTable;
