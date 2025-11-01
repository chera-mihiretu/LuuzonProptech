import { JWT_SECRET_KEY } from '@/app/config/envs';
import { sign, JwtPayload, SignOptions } from 'jsonwebtoken';

export interface InvitationTokenPayload extends JwtPayload {
  agency_id: string; 
  email: string;     
  sub?: 'employee_invite'; 
}

export function generateInvitationToken(agencyId: string, inviteeEmail: string): string {
    
    const payload: InvitationTokenPayload = {
        agency_id: agencyId, 
        email: inviteeEmail,
        sub: 'employee_invite' 
    };

    // Signing options
    const options: SignOptions = {
        expiresIn: '48h', 
        algorithm: 'HS256' 
    };

    try {
        const token = sign(payload, JWT_SECRET_KEY, options);
        return token;
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Failed to generate secure invitation token.");
    }

    
}