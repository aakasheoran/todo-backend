import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read the roles assigned to the route from the custom metadata
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      // No roles specified for the route, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Implement your role-based access control logic here
    // Check if the user has one of the required roles
    const hasRole = user && roles.includes(user.role);

    return hasRole;
  }
}
