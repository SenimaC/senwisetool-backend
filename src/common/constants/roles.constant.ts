// constants/roles.constant.ts
export const AllRoles = {
  LEAD_DEVELOPER: 'LEAD_DEVELOPER',
  DEVELOPER: 'DEVELOPER',
  OWNER: 'OWNER',
  PDG: 'PDG',
  DG: 'DG',
  ADG: 'ADG',
  ASSISTANT: 'ASSISTANT',
} as const;

export type RoleType = (typeof AllRoles)[keyof typeof AllRoles];

// Rôles qu’un utilisateur peut attribuer selon son propre rôle
export const AssignableRolesMap: Record<RoleType, RoleType[]> = {
  OWNER: [AllRoles.PDG],
  LEAD_DEVELOPER: [
    AllRoles.DEVELOPER,
    AllRoles.PDG,
    AllRoles.DG,
    AllRoles.ADG,
    AllRoles.ASSISTANT,
  ],
  PDG: [],
  DG: [AllRoles.ADG, AllRoles.ASSISTANT],
  ADG: [AllRoles.ASSISTANT],
  DEVELOPER: [AllRoles.OWNER],
  ASSISTANT: [],
};
