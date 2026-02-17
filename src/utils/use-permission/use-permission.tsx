// utils/usePermissions.ts
import { useAppSelector } from "@/redux/store";
import { hasPermission } from "@/utils/has-permission/has-permission";

export const usePermissions = () => {
  const { roleAndActions } = useAppSelector((state) => state.authStates);

  // Extract actions and roles
  const actions = roleAndActions?.flatMap((role) =>
    role.actions.map((action) => action.actionName)
  ) || [];
  const roles = roleAndActions?.map((role) => role.name) || [];

  // Check if the user has a specific permission
  const checkPermission = (requiredAction: string): boolean => {
    // Grant access if the user has the 'superAdmin' role
    if (roles.includes("SuperAdmin")) {
      return true;
    }

    // Otherwise, check specific permissions
    return hasPermission(actions, requiredAction);
  };

  // Check permission for a specific middle route
  const checkMiddleRoutePermission = (requiredRoute: string): boolean => {
    // Filter actions to match the middle route
    const routePermissions = actions.filter((action) =>
      action.includes(requiredRoute)
    );

    return routePermissions.length > 0 || roles.includes("SuperAdmin");
  };

  return {
    actions,
    roles,
    checkPermission,
    checkMiddleRoutePermission, // Export new function
  };
};
