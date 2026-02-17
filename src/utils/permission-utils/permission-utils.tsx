import { routeMappings } from "../route-mapping/route-mapping";

export const hasAccessToRoute = (actions: string[], route: string): boolean => {
    const requiredActions = routeMappings[route] || [];
    return requiredActions.some((action) => actions.includes(action));
  };
  