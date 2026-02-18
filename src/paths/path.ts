/***** Note: All local and dynamic paths of (files, assets, icons) are defined here *****/

// Importing image assets
import xourceLogo from "@/assets/logo.svg";
import xourceIcon from "@/assets/Icon.svg";

// Importing the `StaticImageData` type from Next.js
import { StaticImageData } from "next/image";

// Defining the structure of asset paths
interface AssetPaths {
  XourceLogo: StaticImageData;
  XourceIcon: StaticImageData;
}

// Defining the structure of icons
interface Icons {
  [key: string]: string; // Dynamic keys for icon paths
}

// Asset paths object
const assetPaths: AssetPaths = {
  XourceLogo: xourceLogo,
  XourceIcon: xourceIcon,
};

// Icons object (currently empty, ready for future expansion)
const icons: Icons = {
  // Add icon paths when needed
};

export {
  assetPaths,
  icons
};
