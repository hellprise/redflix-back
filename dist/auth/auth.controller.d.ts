import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
export declare class AuthController {
    private readonly AuthService;
    constructor(AuthService: AuthService);
    login(dto: AuthDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            isAdmin: boolean;
        };
    }>;
    getNewTokens(dto: RefreshTokenDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            isAdmin: boolean;
        };
    }>;
    register(dto: AuthDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            isAdmin: boolean;
        };
    }>;
}
