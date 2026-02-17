import React from 'react';
import DataTable, { Column } from '@/components/table/DataTable';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type SettingRow = {
  id: string;
  ts: string;
  highAdc: number;
  threshold: number;
  currentAdc: number;
  lowAdc: number;
  airOnTime: number;
  airTimeout: number;
  delay: number;
};

const fallbackRows: SettingRow[] = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  ts: `2025-06-1${i} 08:06:40`,
  highAdc: 2800 + i,
  threshold: 4000,
  currentAdc: 2790 + i,
  lowAdc: 2790 + i,
  airOnTime: 7,
  airTimeout: i % 4 === 0 ? 1 : 0,
  delay: 5,
}));

const PumpSettingsTable: React.FC<{ deviceSerial?: string }> = ({ deviceSerial }) => {
  const [range, setRange] = React.useState<'24h' | '7d' | '30d'>('7d');
  const router = useRouter();
  const pathname = usePathname();
  const [rows, setRows] = React.useState<SettingRow[] | null>(null);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [saving, setSaving] = React.useState(false);
  const [bulkEdit, setBulkEdit] = React.useState<{
    field: 'threshold' | 'airOnTime' | 'airTimeout' | 'delay';
    label: string;
    value: string;
  } | null>(null);

  const normalizeRows = React.useCallback((raw: any[]): SettingRow[] => {
    return raw.map((r: any, idx: number) => {
      const id = String(r?.id ?? r?.setting_id ?? r?.settingId ?? r?.settings_id ?? r?.ts ?? r?.timestamp ?? idx);
      const ts = String(r?.ts ?? r?.timestamp ?? r?.created_at ?? '');
      const highAdc = Number(r?.highAdc ?? r?.high_adc ?? r?.high_adc_reading ?? r?.high_adc_value ?? 0) || 0;
      const threshold = Number(r?.threshold ?? r?.adc_threshold ?? r?.adcThreshold ?? 0) || 0;
      const currentAdc = Number(r?.currentAdc ?? r?.current_adc ?? r?.current_adc_reading ?? 0) || 0;
      const lowAdc = Number(r?.lowAdc ?? r?.low_adc ?? r?.low_adc_reading ?? r?.low_adc_value ?? 0) || 0;
      const airOnTime = Number(r?.airOnTime ?? r?.air_on_time ?? r?.air_on ?? 0) || 0;
      const airTimeout = Number(r?.airTimeout ?? r?.air_timeout ?? r?.air_flow_timeout ?? 0) || 0;
      const delay = Number(r?.delay ?? r?.start_delay ?? 0) || 0;
      return { id, ts, highAdc, threshold, currentAdc, lowAdc, airOnTime, airTimeout, delay };
    });
  }, []);

  const startBulkEdit = (field: 'threshold' | 'airOnTime' | 'airTimeout' | 'delay', label: string) => {
    const first = (rows && rows.length > 0) ? rows[0] : null;
    const initial = first ? String(first[field] ?? '') : '';
    setBulkEdit({ field, label, value: initial });
  };

  const saveBulkEdit = async () => {
    if (!bulkEdit || !deviceSerial) return;
    const nextVal = Number(bulkEdit.value);
    if (!Number.isFinite(nextVal)) {
      toast.error('Invalid number');
      return;
    }

    const targetRowId = (() => {
      const first = (rows && rows.length > 0) ? rows[0] : null;
      return first?.id || '0';
    })();

    setSaving(true);
    try {
      const token = (() => { try { const m = document.cookie.match(/(?:^|; )AuthToken=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch { return null; } })();
      const url = `/admin/api/devices/${encodeURIComponent(deviceSerial)}/settings/${encodeURIComponent(targetRowId)}`;

      const body: any = { applyToAll: true };
      body[bulkEdit.field] = nextVal;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || json?.message || 'Failed to update settings');
      }

      setRows((prev) => {
        if (!prev) return prev;
        return prev.map(r => ({ ...r, [bulkEdit.field]: nextVal }));
      });

      toast.success('Settings updated');
      setBulkEdit(null);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const headerWithEdit = React.useCallback((label: string, field: 'threshold' | 'airOnTime' | 'airTimeout' | 'delay') => {
    return (
      <div className="inline-flex items-center gap-2">
        <span>{label}</span>
        <button
          type="button"
          className="text-white/90 hover:text-white disabled:opacity-50"
          onClick={() => startBulkEdit(field, label)}
          disabled={saving || !deviceSerial}
          aria-label={`Edit ${label}`}
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    );
  }, [deviceSerial, saving, startBulkEdit]);

  const columns: Column<SettingRow>[] = React.useMemo(() => [
    { key: 'ts', header: 'Timestamp' },
    { key: 'highAdc', header: 'High ADC Reading' },
    { key: 'threshold', header: headerWithEdit('ADC Threshold Setting', 'threshold') },
    { key: 'currentAdc', header: 'Current ADC' },
    { key: 'lowAdc', header: 'Low ADC Reading' },
    { key: 'airOnTime', header: headerWithEdit('Air On Time', 'airOnTime') },
    { key: 'airTimeout', header: headerWithEdit('Air Flow Timeout', 'airTimeout') },
    { key: 'delay', header: headerWithEdit('Delay', 'delay') },
  ], [headerWithEdit]);

  React.useEffect(() => {
    let ignore = false;
    if (!deviceSerial) { setRows(fallbackRows); setTotal(fallbackRows.length); return; }
    (async () => {
      try {
        const token = (() => { try { const m = document.cookie.match(/(?:^|; )AuthToken=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch { return null; } })();
        const url = `/admin/api/devices/${encodeURIComponent(deviceSerial)}/settings?range=${range}&page=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
        const json = await res.json().catch(() => ({} as any));
        if (ignore) return;
        if (res.ok && Array.isArray(json?.rows)) {
          const normalized = normalizeRows(json.rows as any[]);
          setRows(normalized);
          setTotal(Number(json.total) || normalized.length);
        } else { setRows([]); setTotal(0); }
      } catch { if (!ignore) { setRows([]); setTotal(0); } }
    })();
    return () => { ignore = true; };
  }, [deviceSerial, range, page, pageSize, normalizeRows]);

  const exportCsv = () => {
    const header = ['Timestamp','High ADC Reading','ADC Threshold Setting','Current ADC','Low ADC Reading','Air On Time','Air Flow Timeout','Delay'];
    const lines = (rows || fallbackRows).map(r => [r.ts, r.highAdc, r.threshold, r.currentAdc, r.lowAdc, r.airOnTime, r.airTimeout, r.delay].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pump_settings_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-base font-semibold">Jeneer Floats Pump Settings</div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e)=>setRange(e.target.value as any)}
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
              const url = `${pathname}?view=settings`;
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
        <div className="w-full h-40 grid place-items-center">
          <CircularProgress color="success" size={28} />
        </div>
      ) : (
        <DataTable<SettingRow>
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

      <Dialog open={!!bulkEdit} onClose={() => !saving && setBulkEdit(null)} fullWidth maxWidth="xs">
        <DialogTitle>Update {bulkEdit?.label}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label={bulkEdit?.label}
            type="number"
            value={bulkEdit?.value ?? ''}
            onChange={(e) => setBulkEdit((p) => (p ? { ...p, value: e.target.value } : p))}
            fullWidth
            size="small"
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkEdit(null)} disabled={saving}>Cancel</Button>
          <Button variant="contained" color="success" onClick={saveBulkEdit} disabled={saving || !bulkEdit?.value?.trim()}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PumpSettingsTable;
