import { JWT_SECRET_KEY } from '@/app/config/envs';
import { sign, JwtPayload, SignOptions, verify } from 'jsonwebtoken';

export interface InvitationTokenPayload extends JwtPayload {
  user_id: string; 
  email?: string;
  sub?: 'employee_invite';
  exp?: number
}

export function generateInvitationToken(userID: string, email: string): string {
    
    const payload: InvitationTokenPayload = {
        user_id: userID, 
        email: email,
        sub: 'employee_invite', 
    };

    // Signing options
    const options: SignOptions = {
        expiresIn: '24h', 
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

// can you write a function to validate the invitation token
export function validateInvitationToken(token: string): InvitationTokenPayload {
    try {
        const payload = verify(token, JWT_SECRET_KEY);
        return payload as InvitationTokenPayload;
    } catch (error) {
        throw new Error("Invalid or expired invitation token");
    }
}


