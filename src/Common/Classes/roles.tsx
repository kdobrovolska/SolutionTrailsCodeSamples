import { AllRoles } from '../enums';

export class Roles {
    public static hasAdminPermission = (roles: { [key: string]: string | undefined }): string | undefined => (
        roles[AllRoles.ADMIN] || roles[AllRoles.SUPERADMIN]
    );

    public static hasEditorPermission = (roles: { [key: string]: string | undefined }): string | undefined => (
        roles[AllRoles.EDITOR]
    );

    public static hasEditorOrAdminPermission = (roles: { [key: string]: string | undefined }): string | undefined => (
        Roles.hasAdminPermission(roles) || Roles.hasEditorPermission(roles)
    );

    public static isInactive = (roles: { [key: string]: string | undefined }): string | undefined => (
        roles[AllRoles.INACTIVE]
    );

    public static getRole = (roles: { [key: string]: string | undefined }): string => {
        let role = AllRoles.USER;
        if (roles[AllRoles.INACTIVE]) {
            role = AllRoles.INACTIVE;
        } else  if (roles[AllRoles.SUPERADMIN]) {
            role = AllRoles.SUPERADMIN;
        } else if (roles[AllRoles.ADMIN]) {
            role = AllRoles.ADMIN;
        } else if (roles[AllRoles.EDITOR]) {
            role = AllRoles.EDITOR;
        } 
        return role;
    }
};