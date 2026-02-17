"use client";

import React from "react";
import Box from "@mui/material/Box";
import GoogleMapView from "@/components/maps/GoogleMapView";

const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <Box sx={{ width: '100%', height: 'calc(100vh - 140px)' }}>
        <GoogleMapView
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyA71Kqzpa_3vfeFJdaKleqLmnDhKc4a6EI"}
          center={{ lat: 34.0522, lng: -118.2437 }}
          zoom={11}
          markers={[
            { id: 'LRI2249', label: 'LRI2249', position: { lat: 34.072, lng: -118.28 }, color: 'red' },
            { id: 'LRI2348', label: 'LRI2348', position: { lat: 34.09, lng: -118.22 }, color: 'green' },
          ]}
        />
      </Box>
    </>
  );
};

export default AdminDashboardPage;
