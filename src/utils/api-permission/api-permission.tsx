export const getApiPermissions = (checkPermission: (action: string) => boolean) => {
    return {
      canFetchUsers: checkPermission("/auth/iusermanagementfeature/listusers"),
      canFetchRoles: checkPermission("/auth/irolemanagementfeature/listroles"),
      canFetchUserCount: checkPermission("/auth/iusermanagementfeature/gettotalusers"),
      canFetchActions: checkPermission("/auth/iactionmanagementfeature/getallaction"),
      canFetchOtpHistoryOfUser: checkPermission("/auth/iauthfeature/getotphistorylogs"),
      canFetchNotificationOfUser: checkPermission("/auth/inotificationfeature/listnotificationbyuserid"),
      canFetchRolesWithAction: checkPermission("/auth/irolemanagementfeature/listroleswithactions"),
      canAddRoles: checkPermission("/auth/iusermanagementfeature/adduser"),
      canAddUsers: checkPermission(""),
      canUpdateRoles: checkPermission(""),
      canUpdateUsers: checkPermission("")
    };
  };
  