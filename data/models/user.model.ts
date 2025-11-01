export interface UserModel {
    _id?: string, 
    userId: string;
    userEmail: string
    userName: string
    agencyName?: string;
    managerName?: string;
    password?: string;
    role: string;
    agencyEmail?:  string;
    address?: string;
    sirenSiret?: string;
    createdAt: Date;
}