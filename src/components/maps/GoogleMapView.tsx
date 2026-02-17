"use client";

import React from "react";
import Box from "@mui/material/Box";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

// Base map container dimensions
const baseContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: 12,
  overflow: "hidden",
};

const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Los Angeles fallback

const defaultZoom = 11;

export type MapMarker = {
  id: string;
  position: { lat: number; lng: number };
  label?: string;
  color?: "red" | "orange" | "green";
  info?: React.ReactNode;
};

interface GoogleMapViewProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  height?: number | string;
  fullScreen?: boolean;
  offsetTop?: number;
  offsetLeft?: number;
  anchorSelector?: string; // CSS selector for the sidebar element to compute left offset dynamically
  headerSelector?: string; // CSS selector for the header element to compute top offset dynamically
  zIndex?: number; // stacking order for fullScreen overlay
}

const pinColors: Record<NonNullable<MapMarker["color"]>, string> = {
  red: "#ef4444",
  orange: "#f59e0b",
  green: "#22c55e",
};

export default function GoogleMapView({
  apiKey,
  center = defaultCenter,
  zoom = defaultZoom,
  markers = [],
  height = 320,
  fullScreen = false,
  offsetTop = 0,
  offsetLeft = 0,
  anchorSelector,
  headerSelector,
  zIndex = 0,
}: GoogleMapViewProps) {
  const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    // Use a key-specific id so if the API key changes, the script reloads correctly
    id: key ? `google-map-script-${key.slice(-6)}` : "google-map-script",
    googleMapsApiKey: key,
  });

  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const lastCenterRef = React.useRef(center);
  const [computedLeft, setComputedLeft] = React.useState<number>(offsetLeft);
  const [computedTop, setComputedTop] = React.useState<number>(offsetTop);

  React.useEffect(() => {
    // Minimal diagnostics in console to help when map doesn't render
    // Redact the key for safety
    const redacted = key ? `${key.slice(0, 6)}...${key.slice(-4)}` : '(none)';
    // eslint-disable-next-line no-console
    console.log('[GoogleMapView] key:', redacted, 'isLoaded:', isLoaded, 'loadError:', loadError?.message);
  }, [key, isLoaded, loadError]);

  // Keep track of center updates
  React.useEffect(() => {
    lastCenterRef.current = center;
    if (mapRef.current) {
      try {
        mapRef.current.setCenter(center as any);
      } catch {}
    }
  }, [center]);

  // When offsets change (sidebar/header toggled) or map loads, force map to recalc size
  React.useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const g = (typeof window !== 'undefined' && (window as any).google) ? (window as any).google : null;

    const fire = () => {
      try {
        if (g && g.maps && g.maps.event && typeof g.maps.event.trigger === 'function') {
          g.maps.event.trigger(mapRef.current!, 'resize');
        }
        mapRef.current!.setCenter(lastCenterRef.current as any);
      } catch {}
    };

    const raf = requestAnimationFrame(fire);
    const t = setTimeout(fire, 220);
    const pulse = setInterval(fire, 50);
    const stop = setTimeout(() => clearInterval(pulse), 700);

    // Also respond to window resizes
    const onResize = () => fire();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(stop);
      clearInterval(pulse);
      window.removeEventListener('resize', onResize);
    };
  }, [isLoaded, computedLeft, computedTop]);

  // Dynamically compute offsets from DOM if selectors provided
  React.useEffect(() => {
    if (!fullScreen) return;
    const pickSidebar = (): HTMLElement | null => {
      if (anchorSelector) return document.querySelector(anchorSelector) as HTMLElement | null;
      return (
        (document.querySelector('[data-sidebar]') as HTMLElement | null) ||
        (document.querySelector('.MuiDrawer-paper') as HTMLElement | null) ||
        (document.querySelector('#app-sidebar') as HTMLElement | null)
      );
    };
    const pickHeader = (): HTMLElement | null => {
      if (headerSelector) return document.querySelector(headerSelector) as HTMLElement | null;
      return (
        (document.querySelector('header.fixed') as HTMLElement | null) ||
        (document.querySelector('header[style*="position: fixed"]') as HTMLElement | null) ||
        (document.querySelector('#app-header') as HTMLElement | null)
      );
    };
    const sidebar = pickSidebar();
    const header = pickHeader();

    // Seed with current sizes
    const seed = () => {
      if (sidebar) setComputedLeft(sidebar.getBoundingClientRect().width);
      else setComputedLeft(offsetLeft);
      if (header) setComputedTop(header.getBoundingClientRect().height);
      else setComputedTop(offsetTop);
    };
    seed();

    let roSidebar: any = null;
    let roHeader: any = null;
    try {
      const RO: any = (window as any).ResizeObserver || (window as any).webkitResizeObserver || null;
      if (RO && sidebar) {
        roSidebar = new RO(() => {
          setComputedLeft(sidebar.getBoundingClientRect().width);
        });
        roSidebar.observe(sidebar);
      }
      if (RO && header) {
        roHeader = new RO(() => {
          setComputedTop(header.getBoundingClientRect().height);
        });
        roHeader.observe(header);
      }
    } catch {}

    const onWinResize = () => seed();
    window.addEventListener('resize', onWinResize);

    return () => {
      window.removeEventListener('resize', onWinResize);
      try {
        if (roSidebar && sidebar) roSidebar.unobserve(sidebar);
        if (roHeader && header) roHeader.unobserve(header);
      } catch {}
    };
  }, [fullScreen, anchorSelector, headerSelector, offsetLeft, offsetTop]);

  // Use computed offsets (seeded from provided offsets), so auto-detected sizes apply even without explicit selectors
  const left = computedLeft;
  const top = computedTop;

  const wrapperSx = fullScreen
    ? {
        position: "fixed",
        top: top,
        left: left,
        right: 0,
        bottom: 0,
        width: `calc(100vw - ${left}px)`,
        height: `calc(100vh - ${top}px)`,
        zIndex: zIndex,
        backgroundColor: "transparent",
        borderRadius: 0,
        transition: 'none',
      }
    : { width: "100%", height: height, minHeight: 300, backgroundColor: "#eef2f7", borderRadius: 2 } as const;

  // Choose container style: remove corner radius in full-screen to avoid showing page background
  const containerStyle: React.CSSProperties = fullScreen
    ? { ...baseContainerStyle, borderRadius: 0 }
    : baseContainerStyle;

  return (
    <Box sx={wrapperSx}>
      {!key ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "100%", color: "#ef4444", fontWeight: 600 }}>
          Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env and restart dev server.
        </Box>
      ) : loadError ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "100%", color: "#ef4444", fontWeight: 600 }}>
          Failed to load Google Maps. {loadError.message || 'Check API key and network.'}
        </Box>
      ) : isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={(map) => { mapRef.current = map; }} onUnmount={() => { mapRef.current = null; }} options={{
          mapTypeId: "satellite",
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
        }}>
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={m.position}
              label={{ text: m.label || m.id, color: "#ffffff", fontSize: "12px", fontWeight: "700" }}
              icon={{
                // access google safely at runtime
                path: (typeof window !== "undefined" && (window as any).google)
                  ? (window as any).google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
                  : 0,
                scale: 6,
                fillColor: m.color ? pinColors[m.color] : "#3b82f6",
                fillOpacity: 1,
                strokeWeight: 0,
              }}
              onClick={() => setActiveMarker(m.id)}
            />
          ))}

          {markers.map((m) => (
            activeMarker === m.id ? (
              <InfoWindow key={`info-${m.id}`} position={m.position} onCloseClick={() => setActiveMarker(null)}>
                <div style={{ minWidth: 200 }}>
                  {m.info || (
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.label || m.id}</div>
                      <div style={{ fontSize: 12, color: "#4b5563" }}>No details</div>
                    </div>
                  )}
                </div>
              </InfoWindow>
            ) : null
          ))}
        </GoogleMap>
      ) : (
        <Box sx={{ display: "grid", placeItems: "center", height: "100%", color: "#475569", fontWeight: 600 }}>Loading map…</Box>
      )}
    </Box>
  );
}
