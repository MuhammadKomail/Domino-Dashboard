"use client";

import React from "react";
import { useTranslation } from 'react-i18next';
import Box from "@mui/material/Box";
import GoogleMapView from "@/components/maps/GoogleMapView";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();


  return (
    <>
        <GoogleMapView
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          center={{ lat: 34.0522, lng: -118.2437 }}
          zoom={11}
          markers={[]}
          fullScreen
        />
    </>
  );
};

export default Dashboard;
