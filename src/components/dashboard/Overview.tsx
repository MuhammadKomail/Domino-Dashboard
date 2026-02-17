import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import GallonsBarChart, { GallonsPoint } from './GallonsBarChart';
import FocusMainPressureBarChart, { PressurePoint } from './FocusMainPressureBarChart';
import LiquidLevelBarChart, { LiquidLevelPoint } from './LiquidLevelBarChart';
import TemperatureBarChart, { TemperaturePoint } from './TemperatureBarChart';
 
type Props = { companyId: number };

const Overview: React.FC<Props> = ({ companyId }) => {
  const [gallons, setGallons] = React.useState<GallonsPoint[] | null>(null);
  const [levels, setLevels] = React.useState<LiquidLevelPoint[] | null>(null);
  const [temps, setTemps] = React.useState<TemperaturePoint[] | null>(null);
  const [pressures, setPressures] = React.useState<PressurePoint[] | null>(null);
  // Unified range filter across all charts
  const [range, setRange] = React.useState<'1d' | '7d' | '1m' | '1y'>('1y');
  const days = range === '1d' ? 1 : range === '7d' ? 7 : range === '1m' ? 30 : 365;

  React.useEffect(() => {
    let ignore = false;
    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    (async () => {
      try {
        const token = (() => {
          try {
            const m = document.cookie.match(/(?:^|; )AuthToken=([^;]+)/);
            return m ? decodeURIComponent(m[1]) : null;
          } catch { return null; }
        })();
        const url = `/admin/api/companies/${companyId}/overview?days=${days}&levelField=low_adc&pressureField=high_adc&temperatureField=cur_adc`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
        const json = await res.json().catch(() => ({} as any));
        if (ignore) return;
        if (res.ok && json) {
          const g: GallonsPoint[] = Array.isArray(json.gallons_pumped)
            ? (() => {
                const totals = new Map<string, number>();
                for (const r of json.gallons_pumped) {
                  const key = String(r?.device_serial ?? '');
                  if (!key) continue;
                  const v = Number(r?.value) || 0;
                  totals.set(key, (totals.get(key) ?? 0) + v);
                }
                return Array.from(totals.entries()).map(([name, gallons]) => ({ name, gallons }));
              })()
            : [];
          const l: LiquidLevelPoint[] = Array.isArray(json.liquid_level)
            ? json.liquid_level.map((r: any) => ({ name: r.device_serial, level: Number(r.value) || 0 }))
            : [];
          const t: TemperaturePoint[] = Array.isArray(json.temperature_realtime)
            ? json.temperature_realtime.map((r: any) => ({ name: r.device_serial, temp: Number(r.value) || 0 }))
            : [];
          const p: PressurePoint[] = Array.isArray(json.focus_main_pressure)
            ? json.focus_main_pressure.map((r: any) => ({ name: r.device_serial, pressure: Number(r.value) || 0 }))
            : [];
          setGallons(g);
          setLevels(l);
          setTemps(t);
          setPressures(p);
        } else {
          setGallons([]);
          setLevels([]);
          setTemps([]);
          setPressures([]);
        }
      } catch {
        if (!ignore) {
          setGallons([]);
          setLevels([]);
          setTemps([]);
          setPressures([]);
        }
      }
    })();
    return () => { ignore = true; };
  }, [companyId, days]);

  const loading = gallons === null || levels === null || temps === null || pressures === null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-40 bg-white/60 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-[#E92137] animate-spin" />
      </div>
    );
  }

  const controls = (
    <select
      value={range}
      onChange={(e) => setRange(e.target.value as any)}
      className="px-2 py-1 border rounded text-xs text-gray-700 w-full sm:w-auto"
    >
      <option value="1d">Last 1 Day</option>
      <option value="7d">Last 7 Days</option>
      <option value="1m">Last 1 Month</option>
      <option value="1y">Last 1 Year</option>
    </select>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: { xs: 1, sm: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          width: '100%',
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: { xs: 260, sm: 'none' } }}>{controls}</Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <GallonsBarChart data={gallons || undefined} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <LiquidLevelBarChart data={levels || undefined} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TemperatureBarChart data={temps || undefined} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FocusMainPressureBarChart data={pressures || undefined} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
