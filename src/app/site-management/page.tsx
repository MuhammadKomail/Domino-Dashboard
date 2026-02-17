"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable, { Column } from "@/components/table/DataTable";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Company = {
  id: number;
  name: string;
};

type CompaniesResponse = {
  data?: Company[];
  meta?: { page: number; pageSize: number; total: number };
  error?: string;
  message?: string;
};

type ApiDevice = {
  id: number;
  device_serial: string;
  product: string;
  location_id: number;
  company_id: number;
  description?: string;
  well_id?: number;
};

type ApiSite = {
  location_id: number;
  site_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  total_pumps: number;
  devices: ApiDevice[];
};

type ApiCompanySites = {
  company_id: number;
  company_name: string;
  sites: ApiSite[];
};

type SitesWithDevicesResponse = {
  data?: ApiCompanySites[];
  error?: string;
  message?: string;
};

type SiteRow = {
  companyId: number;
  companyName: string;
  locationId: number;
  siteName: string;
  totalPumps: number;
  devices: ApiDevice[];
};

type DeviceInput = {
  device_serial: string;
  product: string;
  description: string;
  well_id: number;
};

type SiteDetail = {
  companyId: number;
  companyName: string;
  locationId: number;
  siteName: string;
  totalPumps: number;
  devices: ApiDevice[];
};

type DeviceEdit = {
  id?: number;
  device_serial: string;
  product: string;
  description: string;
  well_id: string;
  markedDelete?: boolean;
};

export default function SiteManagementPage() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);

  const [rows, setRows] = useState<SiteRow[]>([]);
  const [siteDetails, setSiteDetails] = useState<Record<number, SiteDetail>>({});
  const [apiLoadingCount, setApiLoadingCount] = useState(0);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyBusy, setCompanyBusy] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyNameI, setCompanyNameI] = useState("");
  const [companyAddressI, setCompanyAddressI] = useState("");
  const [companyCityI, setCompanyCityI] = useState("");
  const [companyStateI, setCompanyStateI] = useState("");
  const [companyZipI, setCompanyZipI] = useState("");

  const [siteCompanyIdI, setSiteCompanyIdI] = useState("");
  const [locationI, setLocationI] = useState("");
  const [deviceSerialI, setDeviceSerialI] = useState("");
  const [productI, setProductI] = useState("");
  const [descriptionI, setDescriptionI] = useState("");
  const [wellIdI, setWellIdI] = useState("");
  const [devices, setDevices] = useState<DeviceInput[]>([]);
  const [showPumpForm, setShowPumpForm] = useState(false);

  const [siteBusy, setSiteBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editLocationId, setEditLocationId] = useState<number | null>(null);
  const [editCompanyId, setEditCompanyId] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editDevices, setEditDevices] = useState<DeviceEdit[]>([]);
  const [editNewDeviceSerial, setEditNewDeviceSerial] = useState("");
  const [editNewProduct, setEditNewProduct] = useState("");
  const [editNewDescription, setEditNewDescription] = useState("");
  const [editNewWellId, setEditNewWellId] = useState("");
  const [deleteOpenId, setDeleteOpenId] = useState<number | null>(null);

  const beginLoading = () => setApiLoadingCount((c) => c + 1);
  const endLoading = () => setApiLoadingCount((c) => Math.max(0, c - 1));

  const resetAddSiteForm = () => {
    setSiteCompanyIdI('');
    setLocationI('');
    setDeviceSerialI('');
    setProductI('');
    setDescriptionI('');
    setWellIdI('');
    setDevices([]);
    setShowPumpForm(false);
  };

  const openEditModal = (row: SiteRow) => {
    const detail = siteDetails[row.locationId];
    const src = detail || {
      companyId: row.companyId,
      companyName: row.companyName,
      locationId: row.locationId,
      siteName: row.siteName,
      totalPumps: row.totalPumps,
      devices: row.devices,
    };

    setEditLocationId(src.locationId);
    setEditCompanyId(String(src.companyId));
    setEditLocation(String(src.siteName ?? ""));
    setEditDevices(
      (Array.isArray(src.devices) ? src.devices : []).map((d) => ({
        id: Number(d.id),
        device_serial: String(d.device_serial ?? ""),
        product: String(d.product ?? ""),
        description: String((d as any)?.description ?? ""),
        well_id: String((d as any)?.well_id ?? ""),
        markedDelete: false,
      }))
    );

    setEditNewDeviceSerial("");
    setEditNewProduct("");
    setEditNewDescription("");
    setEditNewWellId("");
    setEditOpen(true);
  };

  const handleUpdateSite = async () => {
    if (!editLocationId) return;
    setEditBusy(true);
    beginLoading();
    try {
      const deleteDeviceIds = editDevices
        .filter((d) => d.markedDelete && d.id)
        .map((d) => Number(d.id));

      const devicesPayload = editDevices
        .filter((d) => !d.markedDelete)
        .map((d) => {
          const payload: any = {
            device_serial: String(d.device_serial ?? "").trim(),
            product: String(d.product ?? "").trim(),
            description: String(d.description ?? "").trim(),
            well_id: Number(String(d.well_id ?? "").trim()),
          };
          if (d.id) payload.id = Number(d.id);
          return payload;
        })
        .filter((d) => d.device_serial && d.product && d.description && Number.isFinite(d.well_id));

      const body: any = {};
      if (editCompanyId) body.comp_id = Number(editCompanyId);
      if (editLocation.trim()) body.location = editLocation.trim();
      if (devicesPayload.length > 0) body.devices = devicesPayload;
      if (deleteDeviceIds.length > 0) body.deleteDeviceIds = deleteDeviceIds;

      const res = await fetch(`/admin/api/locations/${editLocationId}/update-with-devices`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to update site");

      toast.success(data?.message || "Site updated");
      setEditOpen(false);
      await fetchSites();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update site");
    } finally {
      setEditBusy(false);
      endLoading();
    }
  };

  const handleDeleteSite = async (locationId: number) => {
    beginLoading();
    try {
      const res = await fetch(`/admin/api/locations/${locationId}`, {
        method: "DELETE",
      });
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to delete site");

      toast.success(data?.message || "Site deleted");
      await fetchSites();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete site");
    } finally {
      endLoading();
    }
  };

  const handleCreateSite = async () => {
    setSiteBusy(true);
    beginLoading();
    try {
      const payload = {
        comp_id: Number(siteCompanyIdI),
        location: locationI.trim(),
        devices,
      };

      const res = await fetch('/admin/api/locations/create-with-devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create site');

      toast.success('Site created');
      setAddOpen(false);
      resetAddSiteForm();
      await fetchSites();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create site');
    } finally {
      setSiteBusy(false);
      endLoading();
    }
  };

  const fetchSites = async () => {
    beginLoading();
    try {
      const res = await fetch('/admin/api/companies/all/sites-with-devices', { cache: 'no-store' });
      const data: SitesWithDevicesResponse = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch sites');
      const companiesList = Array.isArray(data?.data) ? data.data : [];
      const nextRows: SiteRow[] = [];
      const nextDetails: Record<number, SiteDetail> = {};
      for (const c of companiesList) {
        const sites = Array.isArray(c?.sites) ? c.sites : [];
        for (const s of sites) {
          const siteDevices = Array.isArray(s?.devices) ? s.devices : [];
          nextDetails[Number(s.location_id)] = {
            companyId: Number(c.company_id),
            companyName: String(c.company_name ?? ''),
            locationId: Number(s.location_id),
            siteName: String(s.site_name ?? ''),
            totalPumps: Number(s.total_pumps ?? 0),
            devices: siteDevices,
          };
          nextRows.push({
            companyId: Number(c.company_id),
            companyName: String(c.company_name ?? ''),
            locationId: Number(s.location_id),
            siteName: String(s.site_name ?? ''),
            totalPumps: Number(s.total_pumps ?? 0),
            devices: siteDevices,
          });
        }
      }
      setRows(nextRows);
      setSiteDetails(nextDetails);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to fetch sites');
      setRows([]);
      setSiteDetails({});
    } finally {
      endLoading();
    }
  };

  const fetchCompanies = async () => {
    beginLoading();
    try {
      const res = await fetch('/admin/api/companies?page=1&pageSize=200&sort=name&order=asc', { cache: 'no-store' });
      const data: CompaniesResponse = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch companies');
      const raw = Array.isArray(data?.data) ? (data.data as any[]) : [];
      const normalized: Company[] = raw
        .map((c) => {
          const id = Number((c as any)?.id ?? (c as any)?.company_id);
          const name = String((c as any)?.name ?? (c as any)?.company_name ?? '').trim();
          if (!Number.isFinite(id) || !name) return null;
          return { id, name };
        })
        .filter(Boolean) as Company[];
      setCompanies(normalized);
    } catch {
      setCompanies([]);
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchSites();
  }, []);

  const resetCompanyForm = () => {
    setCompanyNameI('');
    setCompanyAddressI('');
    setCompanyCityI('');
    setCompanyStateI('');
    setCompanyZipI('');
  };

  const handleCreateCompany = async () => {
    setCompanyBusy(true);
    beginLoading();
    try {
      const payload = {
        name: companyNameI.trim(),
        address: companyAddressI.trim(),
        city: companyCityI.trim(),
        state: companyStateI.trim(),
        zip: companyZipI.trim(),
      };

      const res = await fetch('/admin/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create company');

      toast.success('Company created');
      setCompanyOpen(false);
      resetCompanyForm();
      await fetchCompanies();
      await fetchSites();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create company');
    } finally {
      setCompanyBusy(false);
      endLoading();
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((r) => {
      const matchesQ = !q ||
        r.siteName.toLowerCase().includes(q) ||
        r.companyName.toLowerCase().includes(q) ||
        String(r.locationId).includes(q);
      const matchesCompany = !company || r.companyName === company;
      return matchesQ && matchesCompany;
    });
  }, [rows, query, company]);

  const columns = useMemo<Column<SiteRow>[]>(
    () => [
      { key: "companyName", header: "Company" },
      { key: "siteName", header: "Site Name" },
      { key: "totalPumps", header: "Total Pumps" },
      { key: "locationId", header: "Location ID" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cellClassName: "text-right",
        render: (row) => (
          <div className="inline-flex items-center gap-3">
            <button
              className="text-[#C81D30]"
              title="Edit"
              aria-label="Edit"
              onClick={() => openEditModal(row)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              className="text-red-600"
              title="Delete"
              aria-label="Delete"
              onClick={() => setDeleteOpenId(row.locationId)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <path d="M6 7h12M9 7V5h6v2m-7 4v8m4-8v8m4-8v8M7 7l1 12m8-12-1 12" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteDetails]
  );

  return (
    <div className="w-full">
      
      {/* Toolbar: single responsive row */}
      <div className="flex flex-wrap items-center gap-3 mb-3 w-full">
        <div className="relative basis-full md:flex-1 md:min-w-[1000px]">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2.5 bg-white border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E92137]"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <select
            className="px-3 py-2 bg-white border rounded-md text-sm text-gray-700"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="">By Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              resetCompanyForm();
              setCompanyOpen(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#E92137] text-[#C81D30] bg-white hover:bg-[#FDE8EB] text-sm whitespace-nowrap"
          >
            Add Company
            <span className="ml-1">+</span>
          </button>
          <button
            onClick={() => {
              resetAddSiteForm();
              setAddOpen(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm whitespace-nowrap"
          >
            Add Site
            <span className="ml-1">+</span>
          </button>
        </div>
      </div>

      <DataTable<SiteRow>
        columns={columns}
        rows={filtered}
        pageSizeOptions={[10, 20, 50]}
      />

      <Dialog open={addOpen} onOpenChange={(o) => !siteBusy && setAddOpen(o)}>
        <DialogContent className="max-w-2xl relative">
          <DialogHeader>
            <DialogTitle>Add Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Company</label>
              <select
                value={siteCompanyIdI}
                onChange={(e) => setSiteCompanyIdI(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Location</label>
              <input value={locationI} onChange={(e) => setLocationI(e.target.value)} placeholder="Pine Bluff 123" className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Add Devices</label>
              {!showPumpForm && (
                <button type="button" onClick={() => setShowPumpForm(true)} className="text-[#E92137] text-xs">
                  + Add New Device
                </button>
              )}

              {showPumpForm && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-2 items-center">
                  <input value={deviceSerialI} onChange={(e) => setDeviceSerialI(e.target.value)} placeholder="Device Serial" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={productI} onChange={(e) => setProductI(e.target.value)} placeholder="Product" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={descriptionI} onChange={(e) => setDescriptionI(e.target.value)} placeholder="Description" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={wellIdI} onChange={(e) => setWellIdI(e.target.value)} placeholder="Well ID" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      const nextWell = Number(wellIdI);
                      if (!deviceSerialI || !productI || !descriptionI || !Number.isFinite(nextWell)) return;
                      setDevices((prev) => [
                        ...prev,
                        {
                          device_serial: deviceSerialI,
                          product: productI,
                          description: descriptionI,
                          well_id: nextWell,
                        },
                      ]);
                      setDeviceSerialI("");
                      setProductI("");
                      setDescriptionI("");
                      setWellIdI("");
                      setShowPumpForm(false);
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm whitespace-nowrap"
                  >
                    Add Device
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeviceSerialI("");
                      setProductI("");
                      setDescriptionI("");
                      setWellIdI("");
                      setShowPumpForm(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {devices.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {devices.map((d, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-800 border">
                      {d.device_serial}
                      <button onClick={() => setDevices((prev) => prev.filter((_, i) => i !== idx))} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm disabled:opacity-60"
              onClick={handleCreateSite}
              disabled={siteBusy || !siteCompanyIdI || !locationI.trim()}
            >
              {siteBusy ? "Saving..." : "Add Site"}
            </button>
          </DialogFooter>
          {siteBusy && (
            <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-[#E92137] animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={companyOpen} onOpenChange={(o) => !companyBusy && setCompanyOpen(o)}>
        <DialogContent className="max-w-2xl relative">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <input value={companyNameI} onChange={(e) => setCompanyNameI(e.target.value)} placeholder="WC" className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Address</label>
              <input value={companyAddressI} onChange={(e) => setCompanyAddressI(e.target.value)} placeholder="Addr" className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">City</label>
                <input value={companyCityI} onChange={(e) => setCompanyCityI(e.target.value)} placeholder="X" className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">State</label>
                <input value={companyStateI} onChange={(e) => setCompanyStateI(e.target.value)} placeholder="Y" className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Zip</label>
                <input value={companyZipI} onChange={(e) => setCompanyZipI(e.target.value)} placeholder="000" className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm disabled:opacity-60"
              onClick={handleCreateCompany}
              disabled={companyBusy || !companyNameI.trim()}
            >
              {companyBusy ? "Saving..." : "Add Company"}
            </button>
          </DialogFooter>
          {companyBusy && (
            <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-[#E92137] animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(o) => !editBusy && setEditOpen(o)}>
        <DialogContent className="max-w-3xl relative">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Company</label>
              <select
                value={editCompanyId}
                onChange={(e) => setEditCompanyId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Location</label>
              <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Devices</label>
              {editDevices.length === 0 && (
                <div className="text-xs text-gray-500">No devices</div>
              )}

              {editDevices.length > 0 && (
                <div className="space-y-2">
                  {editDevices.map((d, idx) => (
                    <div key={d.id ?? idx} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_1fr_1fr] gap-2 items-center">
                      <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={!!d.markedDelete}
                          onChange={(e) =>
                            setEditDevices((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, markedDelete: e.target.checked } : x))
                            )
                          }
                        />
                        Delete
                      </label>
                      <input
                        value={d.device_serial}
                        disabled={!!d.markedDelete}
                        onChange={(e) =>
                          setEditDevices((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, device_serial: e.target.value } : x))
                          )
                        }
                        placeholder="Device Serial"
                        className="w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <input
                        value={d.product}
                        disabled={!!d.markedDelete}
                        onChange={(e) =>
                          setEditDevices((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, product: e.target.value } : x))
                          )
                        }
                        placeholder="Product"
                        className="w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <input
                        value={d.description}
                        disabled={!!d.markedDelete}
                        onChange={(e) =>
                          setEditDevices((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x))
                          )
                        }
                        placeholder="Description"
                        className="w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <input
                        value={d.well_id}
                        disabled={!!d.markedDelete}
                        onChange={(e) =>
                          setEditDevices((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, well_id: e.target.value } : x))
                          )
                        }
                        placeholder="Well ID"
                        className="w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">Add New Device</div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                  <input value={editNewDeviceSerial} onChange={(e) => setEditNewDeviceSerial(e.target.value)} placeholder="Device Serial" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={editNewProduct} onChange={(e) => setEditNewProduct(e.target.value)} placeholder="Product" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={editNewDescription} onChange={(e) => setEditNewDescription(e.target.value)} placeholder="Description" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <input value={editNewWellId} onChange={(e) => setEditNewWellId(e.target.value)} placeholder="Well ID" className="w-full border rounded-md px-3 py-2 text-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      const nextWell = Number(editNewWellId);
                      if (!editNewDeviceSerial || !editNewProduct || !editNewDescription || !Number.isFinite(nextWell)) return;
                      setEditDevices((prev) => [
                        ...prev,
                        {
                          device_serial: editNewDeviceSerial,
                          product: editNewProduct,
                          description: editNewDescription,
                          well_id: String(nextWell),
                          markedDelete: false,
                        },
                      ]);
                      setEditNewDeviceSerial("");
                      setEditNewProduct("");
                      setEditNewDescription("");
                      setEditNewWellId("");
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm disabled:opacity-60"
              onClick={handleUpdateSite}
              disabled={editBusy || !editCompanyId || !editLocation.trim()}
            >
              {editBusy ? "Saving..." : "Update Site"}
            </button>
          </DialogFooter>
          {editBusy && (
            <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-[#E92137] animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpenId !== null} onOpenChange={(o) => !apiLoadingCount && setDeleteOpenId(o ? deleteOpenId : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Site?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700">This action cannot be undone.</div>
          <DialogFooter>
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm"
              onClick={() => setDeleteOpenId(null)}
              disabled={apiLoadingCount > 0}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-60"
              onClick={async () => {
                if (deleteOpenId === null) return;
                const id = deleteOpenId;
                setDeleteOpenId(null);
                await handleDeleteSite(id);
              }}
              disabled={apiLoadingCount > 0}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
