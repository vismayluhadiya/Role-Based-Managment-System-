import { Role } from "./role";
import { roleData} from "./roleData"

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roleData: roleData;
    role: Role
    token?: string;
    // hasHomeAcess: boolean;
    // hasTripsAcess: boolean;
    // hasPastTripsAcess: boolean;
    // hasCreateTripsAccess: boolean;
    // hasAlertAcess: boolean;
    // hasAlertManagementAcess: boolean;
    // hasSensorsAccess: boolean;
    // hasAddSensorsAccess: boolean;
    // hasRoutesAcess: boolean;
    // hasSAddRoutesAccess: boolean;
    // hasUsersAccess: boolean;
    // hasAddUserAccess: boolean;
    // hasDashboardAccess: boolean;
    // hasReportAccess: boolean;
    // hasRoleSettingsAccess: boolean;

}