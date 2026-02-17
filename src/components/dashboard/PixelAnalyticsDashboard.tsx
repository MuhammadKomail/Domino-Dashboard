"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ChartCard from "./ChartCard";
import DataTable, { Column } from "@/components/table/DataTable";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PizzaSize = "Small" | "Medium" | "Large" | "XL";

type MinutePoint = {
  minute: string;
  total: number;
  Small: number;
  Medium: number;
  Large: number;
  XL: number;
};

type DetectionEvent = {
  id: string;
  time: string;
  size: PizzaSize;
  confidence: number;
  source: string;
};

const DEFAULT_DEMO_VIDEO_PATH = "/demo/cutting-table.mp4";

const getBasePath = (): string => {
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_BASE_PATH) {
    return String(process.env.NEXT_PUBLIC_BASE_PATH || "");
  }
  if (typeof window !== "undefined") {
    const anyWindow = window as any;
    const basePath = anyWindow?.__NEXT_DATA__?.basePath;
    if (typeof basePath === "string") return basePath;

    const p = window.location?.pathname;
    if (typeof p === "string") {
      const m = p.match(/^\/(admin)(\/|$)/i);
      if (m && m[1]) return `/${m[1]}`;
    }
  }
  return "";
};

const joinPath = (a: string, b: string): string => {
  const left = a.endsWith("/") ? a.slice(0, -1) : a;
  const right = b.startsWith("/") ? b : `/${b}`;
  if (!left) return right;
  return `${left}${right}`;
};

const formatNumber = (n: number) => {
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const toMinLabel = (idx: number) => {
  const mm = String(idx).padStart(2, "0");
  return `00:${mm}`;
};

const toHms = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const sizeColor: Record<PizzaSize, string> = {
  Small: "#1976d2",
  Medium: "#E92137",
  Large: "#C81D30",
  XL: "#115293",
};

const formatMinuteTick = (m: string): string => {
  const parts = String(m).split(":");
  return parts[parts.length - 1] ?? m;
};

const PixelAnalyticsDashboard: React.FC = () => {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastAllowedTimeRef = useRef(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [chartSizeFilter, setChartSizeFilter] = useState<PizzaSize | "All">("All");
  const [eventConfidenceMin, setEventConfidenceMin] = useState(0.7);
  const [eventSizeFilter, setEventSizeFilter] = useState<PizzaSize | "All">("All");

  const basePath = useMemo(() => {
    const fromNext = getBasePath();
    if (fromNext) return fromNext;
    if (typeof pathname === "string") {
      const m = pathname.match(/^\/(admin)(\/|$)/i);
      if (m && m[1]) return `/${m[1]}`;
    }
    return "";
  }, [pathname]);

  const demoVideoUrl = useMemo(() => joinPath(basePath, DEFAULT_DEMO_VIDEO_PATH), [basePath]);

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith("blob:")) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (videoUrl) return;
    setVideoUrl(demoVideoUrl);
    setVideoName("cutting-table.mp4");
    setCompleted(false);
    setProgress(0);
    setProcessing(true);
    setVideoReady(false);
    setVideoError("");
    setAutoplayBlocked(false);
  }, [demoVideoUrl, videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const isDemo = videoUrl === demoVideoUrl;

    const tryPlay = (): void => {
      if (!isDemo) return;
      v.muted = true;
      v.volume = 0;
      const p = v.play();
      if (p && typeof (p as any).catch === "function") {
        (p as Promise<void>).catch((): void => {
          setAutoplayBlocked(true);
        });
      }
    };

    const onLoaded = () => {
      setVideoReady(true);
      setVideoError("");
    };

    const onError = () => {
      const err = v.error;
      const code = err?.code;
      const msg = code === 4
        ? "Video format not supported in this browser"
        : code === 3
          ? "Video decode error"
          : code === 2
            ? "Network error while loading video"
            : "Unable to load video";
      setVideoError(msg);
      setVideoReady(false);
    };

    if (isDemo) {
      v.addEventListener("loadedmetadata", tryPlay);
      v.addEventListener("canplay", tryPlay);
      v.addEventListener("play", (): void => setAutoplayBlocked(false));
    }
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("canplaythrough", onLoaded);
    v.addEventListener("error", onError);
    return () => {
      if (isDemo) {
        v.removeEventListener("loadedmetadata", tryPlay);
        v.removeEventListener("canplay", tryPlay);
      }
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("canplaythrough", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, [demoVideoUrl, videoError, videoUrl]);

  useEffect(() => {
    if (!processing) return;
    const start = Date.now();
    const id = window.setInterval((): void => {
      const pct = clamp(((Date.now() - start) / 9000) * 100, 0, 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(id);
        setProcessing(false);
        setCompleted(true);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, [processing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const isDemo = videoUrl === demoVideoUrl;

    const onTime = () => setElapsedSec(v.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      if (isDemo) {
        window.setTimeout((): void => {
          const vv = videoRef.current;
          if (!vv) return;
          if (vv.paused) vv.play().catch((): void => setAutoplayBlocked(true));
        }, 250);
      }
    };

    const onSeeking = () => {
      if (!isDemo) return;
      const target = Math.min(v.currentTime || 0, lastAllowedTimeRef.current);
      if (Number.isFinite(target)) v.currentTime = target;
    };

    const onTimeForLive = () => {
      if (!isDemo) return;
      const ct = v.currentTime || 0;
      if (ct > lastAllowedTimeRef.current) lastAllowedTimeRef.current = ct;
    };

    const onEnded = () => {
      if (!isDemo) return;
      v.currentTime = 0;
      v.play().catch((): void => setAutoplayBlocked(true));
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("timeupdate", onTimeForLive);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("timeupdate", onTimeForLive);
      v.removeEventListener("ended", onEnded);
    };
  }, [demoVideoUrl, videoUrl]);

  const minuteData: MinutePoint[] = useMemo(() => {
    const mins = 60;
    const out: MinutePoint[] = [];

    for (let i = 0; i < mins; i += 1) {
      const peak = 1 + 0.7 * Math.sin((i / (mins - 1)) * Math.PI);
      const noise = ((Math.random() - 0.5) * 2) * 0.12;
      const total = Math.max(0, Math.round(14 * (peak + noise)));
      const small = Math.round(total * 0.22);
      const xl = Math.round(total * 0.09);
      const large = Math.round(total * 0.31);
      const medium = Math.max(0, total - small - xl - large);
      out.push({
        minute: toMinLabel(i),
        total,
        Small: small,
        Medium: medium,
        Large: large,
        XL: xl,
      });
    }

    return out;
  }, [completed]);

  const totals = useMemo(() => {
    const base = { total: 0, Small: 0, Medium: 0, Large: 0, XL: 0 };
    for (const p of minuteData) {
      base.total += p.total;
      base.Small += p.Small;
      base.Medium += p.Medium;
      base.Large += p.Large;
      base.XL += p.XL;
    }
    return base;
  }, [minuteData]);

  const pizzasPerMin = useMemo(() => {
    const mins = Math.max(1, minuteData.length);
    return Math.round((totals.total / mins) * 10) / 10;
  }, [minuteData.length, totals.total]);

  const peak10Min = useMemo(() => {
    let best = 0;
    let bestStart = 0;
    for (let i = 0; i <= minuteData.length - 10; i += 1) {
      let sum = 0;
      for (let j = 0; j < 10; j += 1) sum += minuteData[i + j]?.total ?? 0;
      if (sum > best) {
        best = sum;
        bestStart = i;
      }
    }
    return { count: best, start: toMinLabel(bestStart), end: toMinLabel(bestStart + 9) };
  }, [minuteData]);

  const events: DetectionEvent[] = useMemo(() => {
    if (!completed) return [];
    const out: DetectionEvent[] = [];
    const sizes: PizzaSize[] = ["Small", "Medium", "Large", "XL"];
    const weights = [0.22, 0.38, 0.31, 0.09];
    const totalEvents = 220;

    for (let i = 0; i < totalEvents; i += 1) {
      const t = Math.floor((i / totalEvents) * 3600);
      const r = Math.random();
      let pick: PizzaSize = "Medium";
      let acc = 0;
      for (let k = 0; k < sizes.length; k += 1) {
        acc += weights[k] ?? 0;
        if (r <= acc) {
          pick = sizes[k] ?? "Medium";
          break;
        }
      }

      const confidence = clamp(0.72 + Math.random() * 0.27, 0, 1);
      out.push({
        id: `EVT-${String(i + 1).padStart(4, "0")}`,
        time: toHms(t),
        size: pick,
        confidence: Math.round(confidence * 1000) / 1000,
        source: "Cutting Table 1",
      });
    }
    return out;
  }, [completed]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => e.confidence >= eventConfidenceMin)
      .filter((e) => (eventSizeFilter === "All" ? true : e.size === eventSizeFilter));
  }, [eventConfidenceMin, eventSizeFilter, events]);

  const chartMinuteData = useMemo(() => {
    if (chartSizeFilter === "All") return minuteData;
    return minuteData.map((p) => ({ ...p, total: (p as any)[chartSizeFilter] ?? 0 }));
  }, [chartSizeFilter, minuteData]);

  const eventColumns: Column<DetectionEvent>[] = useMemo(
    () => [
      { key: "time", header: "Time" },
      {
        key: "size",
        header: "Size",
        render: (r) => (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", border: `1px solid ${sizeColor[r.size]}`, color: sizeColor[r.size] }}
          >
            {r.size}
          </span>
        ),
      },
      { key: "confidence", header: "Confidence", render: (r) => `${Math.round(r.confidence * 100)}%` },
      { key: "source", header: "Source" },
      { key: "id", header: "Event ID", className: "text-gray-200" },
    ],
    []
  );

  const downloadCsv = () => {
    const rows = filteredEvents;
    const header = ["time", "size", "confidence", "source", "id"];
    const lines = [header.join(",")].concat(
      rows.map((r) => [r.time, r.size, String(r.confidence), r.source, r.id].map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pizza-detections-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const chartControls = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <select
        value={chartSizeFilter}
        onChange={(e) => setChartSizeFilter(e.target.value as any)}
        className="px-2 py-1 border rounded text-xs text-gray-700"
      >
        <option value="All">All sizes</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="XL">XL</option>
      </select>
    </Box>
  );

  const eventControls = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <select
        value={eventSizeFilter}
        onChange={(e) => setEventSizeFilter(e.target.value as any)}
        className="px-2 py-1 border rounded text-xs text-gray-700"
      >
        <option value="All">All sizes</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="XL">XL</option>
      </select>
      <select
        value={String(eventConfidenceMin)}
        onChange={(e) => setEventConfidenceMin(Number(e.target.value))}
        className="px-2 py-1 border rounded text-xs text-gray-700"
      >
        <option value="0.5">Confidence 50%+</option>
        <option value="0.6">Confidence 60%+</option>
        <option value="0.7">Confidence 70%+</option>
        <option value="0.8">Confidence 80%+</option>
        <option value="0.9">Confidence 90%+</option>
      </select>
      <button
        type="button"
        onClick={downloadCsv}
        disabled={!completed || filteredEvents.length === 0}
        className="px-3 py-1 rounded text-xs text-white disabled:opacity-60 bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293]"
      >
        Export CSV
      </button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: { xs: 1, sm: 0 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, border: "1px solid #EAECF0", overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  Pizza Size Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
                  {/* Cutting Table 1 | Video demo (1 hour) | Size-wise counting */}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.75, borderRadius: 999, backgroundColor: "rgba(233,33,55,0.08)", border: "1px solid rgba(233,33,55,0.25)" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#EF4444", boxShadow: "0 0 0 4px rgba(239,68,68,0.18)" }} />
                  <Typography variant="caption" sx={{ color: "#C81D30", fontWeight: 800 }}>
                    LIVE
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569" }}>
                    Cutting Table Cam
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: isPlaying ? "#22C55E" : "#94A3B8",
                      boxShadow: isPlaying ? "0 0 0 4px rgba(34,197,94,0.15)" : "none",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#475569" }}>
                    {isPlaying ? "LIVE" : "Paused"} • {toHms(elapsedSec)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.35fr 1fr" }, gap: 2 }}>
              <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid #EAECF0", backgroundColor: "#0B1220", height: { xs: 260, sm: 360, lg: 420 } }}>
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    controls={videoUrl !== demoVideoUrl}
                    playsInline
                    autoPlay={videoUrl === demoVideoUrl}
                    muted={videoUrl === demoVideoUrl}
                    loop
                    preload="metadata"
                    controlsList={videoUrl === demoVideoUrl ? "nodownload noplaybackrate noremoteplayback" : undefined}
                    disablePictureInPicture={videoUrl === demoVideoUrl}
                    style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <Box sx={{ p: 4, color: "rgba(255,255,255,0.85)", minHeight: 320, display: "flex", flexDirection: "column", gap: 1, alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Upload your cutting table video
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                      The portal will simulate processing and show size-wise counting analytics.
                    </Typography>
                  </Box>
                )}

                {(processing || completed) && (
                  <Box sx={{ position: "absolute", inset: 12, pointerEvents: "none", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.75, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: 999, backgroundColor: processing ? "#F59E0B" : "#22C55E" }} />
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                        {processing ? `Processing ${Math.round(progress)}%` : "Analytics Ready"}
                      </Typography>
                    </Box>
                    {videoName && videoUrl !== demoVideoUrl && (
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                        {videoName}
                      </Typography>
                    )}
                  </Box>
                )}

                {videoUrl === demoVideoUrl && (
                  <Box sx={{ position: "absolute", left: 12, bottom: 12, display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.75, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)", pointerEvents: "none" }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#EF4444", boxShadow: "0 0 0 4px rgba(239,68,68,0.18)" }} />
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                      LIVE STREAM
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Cutting Table Cam
                    </Typography>
                  </Box>
                )}

                {videoUrl === demoVideoUrl && autoplayBlocked && (
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const v = videoRef.current;
                        if (!v) return;
                        v.muted = true;
                        v.volume = 0;
                        v.play().then(() => setAutoplayBlocked(false)).catch(() => setAutoplayBlocked(true));
                      }}
                      className="px-4 py-2 rounded-md text-sm text-white bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293]"
                    >
                      Start Live Stream
                    </button>
                  </Box>
                )}

                {videoUrl === demoVideoUrl && !videoError && !videoReady && !autoplayBlocked && (
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <Box sx={{ px: 2, py: 1, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                        Loading live stream…
                      </Typography>
                    </Box>
                  </Box>
                )}

                {!!videoError && (
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ maxWidth: 420, mx: 2, p: 2, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>
                        {videoError}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)", display: "block", mt: 0.5 }}>
                        Check that the file exists at public/demo/cutting-table.mp4 and refresh.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1.25 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #EAECF0", overflow: "hidden" }}>
                  <Box sx={{ height: 4, borderRadius: 999, background: "linear-gradient(90deg, #E92137 0%, #1976d2 100%)" }} />
                  <Typography variant="caption" color="text.secondary">
                    Total Pizzas (1 hour)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {completed ? formatNumber(totals.total) : "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.75, color: "#64748B" }}>
                    Avg throughput: {completed ? `${pizzasPerMin} / min` : "—"}
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #EAECF0" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Size-wise Count
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {(["Small", "Medium", "Large", "XL"] as PizzaSize[]).map((s) => (
                      <Box key={s} sx={{ p: 1.25, borderRadius: 1.5, border: "1px solid #EAECF0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: 999, backgroundColor: sizeColor[s] }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {s}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {completed ? formatNumber((totals as any)[s] ?? 0) : "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #EAECF0" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                    Peak 10-min Window
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {completed ? formatNumber(peak10Min.count) : "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {completed ? `${peak10Min.start} → ${peak10Min.end}` : "—"}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={7}>
          <ChartCard
            title="Throughput Timeline"
            subtitle={chartSizeFilter === "All" ? "Per-minute total pizzas" : `Per-minute ${chartSizeFilter} pizzas`}
            rightControls={chartControls}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartMinuteData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                <XAxis
                  dataKey="minute"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                  tickFormatter={formatMinuteTick}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={42} />
                <Tooltip
                  formatter={(v: any) => [formatNumber(Number(v) || 0), "Pizzas"]}
                  labelFormatter={(l: any) => `Minute ${String(l)}`}
                />
                <defs>
                  <linearGradient id="pizzaTrend" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E92137" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1976d2" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="pizzaLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E92137" />
                    <stop offset="100%" stopColor="#1976d2" />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="total" stroke="none" fill="url(#pizzaTrend)" />
                <Line type="monotone" dataKey="total" stroke="url(#pizzaLine)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <ChartCard title="Size Distribution" subtitle="Total pizzas per size" rightControls={chartControls}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={([
                  { size: "Small", count: totals.Small },
                  { size: "Medium", count: totals.Medium },
                  { size: "Large", count: totals.Large },
                  { size: "XL", count: totals.XL },
                ] as any[])}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                <XAxis dataKey="size" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={42} />
                <Tooltip formatter={(v: any) => [formatNumber(Number(v) || 0), "Pizzas"]} />
                <defs>
                  <linearGradient id="tableBars" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E92137" />
                    <stop offset="100%" stopColor="#1976d2" />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#tableBars)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ChartCard title="Size Over Time" subtitle="Stacked per-minute counts" rightControls={chartControls}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={minuteData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                <XAxis
                  dataKey="minute"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                  tickFormatter={formatMinuteTick}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={42} />
                <Tooltip formatter={(v: any) => [formatNumber(Number(v) || 0), "Pizzas"]} />
                <Area type="monotone" dataKey="Small" stackId="1" stroke={sizeColor.Small} fill={sizeColor.Small} fillOpacity={0.25} />
                <Area type="monotone" dataKey="Medium" stackId="1" stroke={sizeColor.Medium} fill={sizeColor.Medium} fillOpacity={0.22} />
                <Area type="monotone" dataKey="Large" stackId="1" stroke={sizeColor.Large} fill={sizeColor.Large} fillOpacity={0.2} />
                <Area type="monotone" dataKey="XL" stackId="1" stroke={sizeColor.XL} fill={sizeColor.XL} fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, border: "1px solid #EAECF0" }}>
            <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 1.25, flexWrap: "wrap", mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Detection Events
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Full detail (demo) | filter by size & confidence
                </Typography>
              </Box>
              {eventControls}
            </Box>

            {!completed ? (
              <Box sx={{ borderRadius: 2, border: "1px dashed #CBD5E1", p: 3, textAlign: "center", color: "#64748B" }}>
                Upload a video to generate detection events.
              </Box>
            ) : (
              <DataTable<DetectionEvent> columns={eventColumns} rows={filteredEvents} pageSizeOptions={[10, 20, 50]} compact />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PixelAnalyticsDashboard;
