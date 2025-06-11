import { AllPermissions } from './permissions.constant';
import { AllRoles } from './roles.constant';

export const RolePermissionsMap: Record<string, string[]> = {
  [AllRoles.LEAD_DEVELOPER]: Object.values(AllPermissions),

  [AllRoles.DEVELOPER]: Object.values(AllPermissions).filter(
    (p) => !([AllPermissions.CREATE_DEVELOPER] as string[]).includes(p),
  ),

  [AllRoles.OWNER]: Object.values(AllPermissions).filter(
    (p) =>
      !(
        [
          AllPermissions.CREATE_OWNER,
          AllPermissions.CREATE_DEVELOPER,
          AllPermissions.ROLE_MANAGER,
        ] as string[]
      ).includes(p),
  ),

  [AllRoles.PDG]: [
    AllPermissions.VIEW_COMPANY,
    AllPermissions.VIEW_SELF_COMPANY,
    AllPermissions.UPDATE_SELF_COMPANY,
  ],

  [AllRoles.DG]: [
    AllPermissions.CREATE_COMPANY,
    AllPermissions.VIEW_SELF_COMPANY,
    AllPermissions.UPDATE_SELF_COMPANY,
  ],

  [AllRoles.ADG]: [AllPermissions.VIEW_SELF_COMPANY],

  [AllRoles.ASSISTANT]: [AllPermissions.VIEW_SELF_COMPANY],
};
