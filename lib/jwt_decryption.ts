import { JWT_SECRET_KEY } from '@/app/config/envs';
import { sign, JwtPayload, SignOptions } from 'jsonwebtoken';

export interface InvitationTokenPayload extends JwtPayload {
  user_id: string; 
  sub?: 'employee_invite';
  exp?: number
}

export function generateInvitationToken(userID: string): string {
    
    const payload: InvitationTokenPayload = {
        user_id: userID, 
        sub: 'employee_invite', 
        exp: Date.now() + (48 * 60 * 60 * 1000) // 48 hours
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