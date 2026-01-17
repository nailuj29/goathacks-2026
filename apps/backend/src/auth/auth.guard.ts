import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from 'src/users/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;

    const parts = authHeader.split(' ');
    if (parts[0] != 'Bearer') return false;

    const jwt = parts[1];

    try {
      const user = await this.jwtService.extract(jwt);
      request['user'] = {
        username: user.username,
        name: user.name,
        id: user._id,
      };
      return true;
    } catch {
      return false;
    }
  }
}
