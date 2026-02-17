'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel
} from '@mui/material';
import DataTable, { Column } from '@/components/table/DataTable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

type Role = {
  id: string;
  name: string;
  description?: string | null;
  allowed_tables: string[];
  allowed_routes: string[];
  created_at?: string | null;
  updated_at?: string | null;
};

// Hardcoded options
const presetTables = ['auth_users', 'company', 'device', 'locations', 'pump_data', 'pump_settings', 'roles', 'user_sessions'];
const presetRoutes = ['dashboard','users:list','users:create','users:edit','roles:manage','companies','locations','devices','pump_settings','pump_data','reports','change_password',];

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Role>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Add dialog state
  const [openAdd, setOpenAdd] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTables, setNewTables] = useState<string[]>(presetTables);
  const [newRoutes, setNewRoutes] = useState<string[]>(['dashboard', 'user-management']);
  const [newIdTouched, setNewIdTouched] = useState(false);

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  // Delete confirm
  const [openDelete, setOpenDelete] = useState<null | string>(null);

  const filteredSorted = useMemo(() => {
    const q = search.toLowerCase();
    let list = roles.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    );
    list = list.sort((a, b) => {
      const av = (a[sortKey] || '') as any; const bv = (b[sortKey] || '') as any;
      const res = String(av).localeCompare(String(bv));
      return sortAsc ? res : -res;
    });
    return list;
  }, [roles, search, sortKey, sortAsc]);

  const columns: Column<Role>[] = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description', render: (r) => (
      <span className="truncate inline-block max-w-[320px] align-middle">{r.description || ''}</span>
    ) },
    { key: 'allowed_routes', header: 'Allowed Routes', render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.allowed_routes?.map((rt) => (
          <span key={rt} className="inline-flex items-center rounded-md bg-[#FDE8EB] px-2 py-0.5 text-xs text-[#C81D30] border border-[#F5B8C0]">{rt}</span>
        ))}
      </div>
    ) },
    { key: 'actions', header: 'Actions', className: 'text-right', cellClassName: 'text-right', render: (r) => (
      <div className="inline-flex items-center gap-3">
        <button className="text-[#C81D30]" title="Edit" aria-label="Edit" onClick={() => openEditDialog(r)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" strokeWidth="1.5" />
          </svg>
        </button>
        <button className="text-red-600" title="Delete" aria-label="Delete" onClick={() => setOpenDelete(r.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
            <path d="M6 7h12M9 7V5h6v2m-7 4v8m4-8v8m4-8v8M7 7l1 12m8-12-1 12" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    ) },
  ]), []);

  // Minimal unauthorized handler (no external deps)
  const handleUnauthorized = () => {
    try {
      document.cookie = 'AuthToken=; Max-Age=0; path=/';
      document.cookie = 'RefreshToken=; Max-Age=0; path=/';
      document.cookie = 'user_object=; Max-Age=0; path=/';
      document.cookie = 'UserAuthenticated=; Max-Age=0; path=/';
    } catch { }
    try { localStorage.clear(); } catch { }
    try { sessionStorage.clear(); } catch { }
    window.location.replace('/admin/login');
  };

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/admin/api/roles', { cache: 'no-store' });
      const data = await res.json();
      if (res.status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized') {
        return handleUnauthorized();
      }
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch roles');
      setRoles(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleAdd = async () => {
    setBusy(true); setError(null); setSuccess(null);
    try {
      const finalId = newId.trim() || toSnakeId(newName);
      const body = {
        id: finalId,
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        allowed_tables: presetTables,
        allowed_routes: newRoutes,
      };
      const res = await fetch('/admin/api/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized') {
        return handleUnauthorized();
      }
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to add role');
      setSuccess('Role created');
      setOpenAdd(false);
      setNewId(''); setNewName(''); setNewDescription(''); setNewTables(presetTables); setNewRoutes(['dashboard', 'user-management']); setNewIdTouched(false);
      await fetchRoles();
    } catch (e: any) {
      setError(e?.message || 'Failed to add role');
    } finally { setBusy(false); }
  };

  const handleDelete = async (roleId: string) => {
    setBusy(true); setError(null); setSuccess(null);
    try {
      const res = await fetch(`/admin/api/roles/${encodeURIComponent(roleId)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized') {
        return handleUnauthorized();
      }
      if (!res.ok || data?.success === false) throw new Error(data?.error || data?.message || 'Failed to delete role');
      setSuccess('Role deleted');
      setOpenDelete(null);
      await fetchRoles();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete role');
    } finally { setBusy(false); }
  };

  const openEditDialog = (r: Role) => {
    // Allowed tables should always be all tables; keep routes editable
    setEditRole({ ...r, allowed_tables: presetTables });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!editRole) return;
    setBusy(true); setError(null); setSuccess(null);
    try {
      const body = {
        name: editRole.name,
        description: editRole.description,
        allowed_tables: presetTables,
        allowed_routes: editRole.allowed_routes,
      };
      const res = await fetch(`/admin/api/roles/${encodeURIComponent(editRole.id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized') {
        return handleUnauthorized();
      }
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update role');
      setSuccess('Role updated');
      setOpenEdit(false);
      await fetchRoles();

      try {
        const meRes = await fetch('/admin/api/auth/me', { cache: 'no-store' });
        const meData = await meRes.json().catch(() => ({}));
        if (meRes.status === 401 || meData?.reason === 'invalid_token' || meData?.error === 'unauthorized') {
          return handleUnauthorized();
        }
        if (meRes.ok && meData) {
          try { if (meData?.user) localStorage.setItem('user', JSON.stringify(meData.user)); } catch { }
          try {
            const role = meData?.user?.role;
            if (typeof role === 'string') localStorage.setItem('role', role);
            if (Array.isArray(meData?.allowed_tables)) localStorage.setItem('allowed_tables', JSON.stringify(meData.allowed_tables));
            if (Array.isArray(meData?.allowed_routes)) localStorage.setItem('allowed_routes', JSON.stringify(meData.allowed_routes));
          } catch { }
          try { sessionStorage.setItem('did_fetch_auth_me', '1'); } catch { }
          try { window.dispatchEvent(new Event('permissions_updated')); } catch { }
        }
      } catch { }
    } catch (e: any) {
      setError(e?.message || 'Failed to update role');
    } finally { setBusy(false); }
  };

  const toggleValue = (list: string[], value: string) => {
    return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
  };

  const toSnakeId = (value: string) => {
    const v = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return v;
  };

  useEffect(() => {
    if (!openAdd) return;
    if (newIdTouched) return;
    const next = toSnakeId(newName);
    setNewId(next);
  }, [newName, newIdTouched, openAdd]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div className="flex flex-wrap items-center gap-3 mb-3 w-full">
        <div className="relative basis-full md:flex-1 md:min-w-[1000px]">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2.5 bg-white border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E92137]"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setOpenAdd(true)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm whitespace-nowrap"
          >
            Add Role
            <span className="ml-1">+</span>
          </button>
        </div>
      </div>

      <Paper sx={{ p: 2, m: 0 }}>
        {loading ? (
          <Box sx={{ py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">Loading roles...</Typography>
          </Box>
        ) : (
          <DataTable<Role>
            columns={columns}
            rows={filteredSorted}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
        {error && <Box sx={{ mt: 2 }}><Alert severity="error" onClose={() => setError(null)}>{error}</Alert></Box>}
      </Paper>

      {/* Add Role Dialog */}
      <Dialog open={openAdd} onClose={() => !busy && setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField label="Name" value={newName} onChange={e => { setNewName(e.target.value); }} placeholder="Manager" fullWidth size="small" />
            <TextField label="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Manager role" fullWidth size="small" />
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Allowed Routes</FormLabel>
              <FormGroup sx={{ maxHeight: 180, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 1, px: 1, py: 0.5 }}>
                {presetRoutes.map((rt) => (
                  <FormControlLabel
                    key={rt}
                    control={<Checkbox size="small" checked={newRoutes.includes(rt)} onChange={() => setNewRoutes((prev) => toggleValue(prev, rt))} />}
                    label={rt}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} disabled={busy}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={busy || !newName.trim()}>{busy ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={openEdit} onClose={() => !busy && setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editRole && (
            <Stack spacing={2}>
              <TextField label="Name" value={editRole.name} onChange={e => setEditRole({ ...editRole, name: e.target.value })} fullWidth size="small" />
              <TextField label="Description" value={editRole.description || ''} onChange={e => setEditRole({ ...editRole, description: e.target.value })} fullWidth size="small" />
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Allowed Routes</FormLabel>
                <FormGroup sx={{ maxHeight: 180, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 1, px: 1, py: 0.5 }}>
                  {presetRoutes.map((rt) => (
                    <FormControlLabel
                      key={rt}
                      control={
                        <Checkbox
                          size="small"
                          checked={(editRole.allowed_routes || []).includes(rt)}
                          onChange={() => setEditRole({ ...editRole, allowed_routes: toggleValue(editRole.allowed_routes || [], rt) })}
                        />
                      }
                      label={rt}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={busy}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={busy || !editRole?.name?.trim()}>{busy ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!openDelete} onClose={() => !busy && setOpenDelete(null)}>
        <DialogTitle>Delete Role?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(null)} disabled={busy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => openDelete && handleDelete(openDelete)} disabled={busy}>{busy ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!success} autoHideDuration={2500} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(null)} severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RolesPage;
