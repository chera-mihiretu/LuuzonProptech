export interface UserModel {
    userId: string;
    userEmail: string
    agencyName?: string;
    managerName?: string;
    password?: string;
    role: string;
    agencyEmail?:  string;
    address?: string;
    sirenSiret?: string;
    createdAt: Date;
}