import {
    MdHome,
    MdAdminPanelSettings,
    MdInventory,
    MdOutlinePeople,
    MdApi,
    MdAttractions,
    MdLayers,
    MdBadge,
} from "react-icons/md";

const unAuthenticatedRoutes = [
    "/login",
    "/forgot-password",
    "/verify-code",
    "/new-password",
];

const authenticatedRoutes = [
    "/dashboard",
    "/inventory-access-management",
    "/users",
    "/roles",
    "/inventory",
    "/actions",
    "/management",
    "/notifications",
    "/products",
    "/customers",
    "/technician",
    "/subcontractor",
    "/partner",
    "/communication",
    "/ticket-details",
    "/tickets",
    "/technician-profile",
    "/profile",
    "/user-management",
];

const appRoutes = [
    {
        id: 1,
        label: 'Dashboard',
        path: authenticatedRoutes[0], // should be /dashboard
        icon: MdHome,
    },
    {
        id: 2,
        label: 'Inventory Access Management',
        path: authenticatedRoutes[1], // /inventory-access-management
        icon: MdAdminPanelSettings,
    },
    {
        id: 3,
        label: 'Inventory',
        path: authenticatedRoutes[4], // /inventory
        icon: MdInventory,
    },
    {
        id: 4,
        label: 'Profile',
        path: authenticatedRoutes[11], // /profile
        icon: MdOutlinePeople,
    },
    {
        id: 5,
        label: 'User Management',
        path: authenticatedRoutes[12], // /user-management
        icon: MdOutlinePeople,
    },
];

const navbarRoutes = [
    {
        id: 0,
        label: 'Inventory Access Management',
        path: authenticatedRoutes[1], // /inventory-access-management
        icon: MdAdminPanelSettings,
    },
    {
        id: 1,
        label: 'Users',
        path: authenticatedRoutes[2], // /users
        icon: MdOutlinePeople,
    },
    {
        id: 2,
        label: 'Roles',
        path: authenticatedRoutes[3], // /roles
        icon: MdApi,
    },
    {
        id: 3,
        label: 'Actions',
        path: authenticatedRoutes[5], // /actions
        icon: MdAttractions,
    },
    {
        id: 4,
        label: 'Resources',
        path: "/", // maybe update later
        icon: MdLayers,
    },
    {
        id: 5,
        label: 'Permissions',
        path: "/", // maybe update later
        icon: MdBadge,
    },
];

export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    appRoutes,
    navbarRoutes,
};
