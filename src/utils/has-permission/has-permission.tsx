export const hasPermission = (actions: string[], requiredAction: string): boolean => {
    return actions.includes(requiredAction);
  };
  