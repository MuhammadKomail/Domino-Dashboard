"use client";

import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PixelAnalyticsDashboard from "@/components/dashboard/PixelAnalyticsDashboard";

type ApiDevice = { id: number; device_serial: string };

type ApiSite = {
  location_id: number;
  site_name: string;
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

type BranchOption = {
  key: string;
  label: string;
  locationId: number;
};

type BranchSelectValue = "all" | "khayaban";

export default function PizzaAnalyticsPage() {
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchError, setBranchError] = useState<string>("");
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>("");
  const [branchSelect, setBranchSelect] = useState<BranchSelectValue>("khayaban");
  const [dateTimeFrom, setDateTimeFrom] = useState<string>("");
  const [dateTimeTo, setDateTimeTo] = useState<string>("");

  const normalize = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const isKhayabanItttehad = (label: string) => {
    const n = normalize(label);
    return n.includes("khayaban") && (n.includes("ittehad") || n.includes("itehad"));
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingBranches(true);
        setBranchError("");
        const res = await fetch("/admin/api/companies/all/sites-with-devices", { cache: "no-store" });
        const json: SitesWithDevicesResponse = await res.json().catch(() => ({} as any));
        if (ignore) return;
        if (!res.ok || !Array.isArray(json?.data)) {
          setBranches([]);
          setBranchError(json?.error || json?.message || "Failed to load branches");
          return;
        }

        const next: BranchOption[] = [];
        for (const comp of json.data) {
          const sites = Array.isArray(comp?.sites) ? comp.sites : [];
          for (const s of sites) {
            const locationId = Number(s.location_id);
            if (!Number.isFinite(locationId)) continue;
            const siteName = String(s.site_name || "").trim();
            const compName = String(comp.company_name || "").trim();
            const label = compName ? `${siteName} (${compName})` : siteName;
            next.push({
              key: String(locationId),
              label: label || String(locationId),
              locationId,
            });
          }
        }

        next.sort((a, b) => a.label.localeCompare(b.label));

        const filtered = next.filter((b) => isKhayabanItttehad(b.label));
        // Resolve a locationId for the Khayaban e Ittehad branch (fallback to first site).
        const resolved = (filtered[0] ?? next[0]) ?? null;
        setBranches(resolved ? [resolved] : []);
        setSelectedBranchKey(resolved?.key ?? "");
      } catch (e: any) {
        if (!ignore) {
          setBranches([]);
          setBranchError(e?.message || "Failed to load branches");
        }
      } finally {
        if (!ignore) setLoadingBranches(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedBranch = useMemo(() => {
    if (!selectedBranchKey) return null;
    return branches.find((b) => b.key === selectedBranchKey) || null;
  }, [branches, selectedBranchKey]);

  const eventsJsonPath = useMemo(() => {
    if (branchSelect === "all") return "/demo/pizza-events.json";
    if (!selectedBranch) return "/demo/pizza-events.json";
    return `/demo/pizza-events-${selectedBranch.locationId}.json`;
  }, [branchSelect, selectedBranch]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: { xs: 1, sm: 0 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          border: "1px solid #EAECF0",
          background: "linear-gradient(135deg, rgba(233,33,55,0.08) 0%, rgba(25,118,210,0.08) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Pizza Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mt: 0.25, fontWeight: 600 }}>
              Branch filter applies to all charts and tables
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#334155", fontWeight: 800 }}>
                Branch
              </Typography>
              <select
                value={branchSelect}
                onChange={(e) => setBranchSelect(e.target.value as BranchSelectValue)}
                disabled={loadingBranches}
                className="px-2 py-1 border rounded text-xs text-gray-700 min-w-[260px] disabled:opacity-60 bg-white"
              >
                <option value="all">All Branches</option>
                <option value="khayaban">Khayaban e Ittehad</option>
              </select>
              {!!branchError && (
                <Typography variant="caption" sx={{ color: "#B91C1C" }}>
                  {branchError}
                </Typography>
              )}
              {/* {!branchError && (branchSelect === "all" || selectedBranch) && (
                <Typography variant="caption" sx={{ color: "#475569" }}>
                  Data file: {eventsJsonPath}
                </Typography>
              )} */}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#334155", fontWeight: 800 }}>
                From
              </Typography>
              <input
                type="datetime-local"
                value={dateTimeFrom}
                onChange={(e) => setDateTimeFrom(e.target.value)}
                className="px-2 py-1 border rounded text-xs text-gray-700 min-w-[200px] bg-white"
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#334155", fontWeight: 800 }}>
                To
              </Typography>
              <input
                type="datetime-local"
                value={dateTimeTo}
                onChange={(e) => setDateTimeTo(e.target.value)}
                className="px-2 py-1 border rounded text-xs text-gray-700 min-w-[200px] bg-white"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <PixelAnalyticsDashboard
        eventsJsonPath={eventsJsonPath}
        showTimeRangeControl={false}
        dateTimeFrom={dateTimeFrom || undefined}
        dateTimeTo={dateTimeTo || undefined}
      />
    </Box>
  );
}
