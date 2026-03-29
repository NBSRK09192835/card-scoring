import { __decorate } from "tslib";
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
let AppService = class AppService {
    constructor() {
        this.users = [];
    }
    getUsers() {
        return this.users.map(({ password, ...rest }) => rest);
    }
    signup(user) {
        if (this.users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
            throw new ConflictException('Username already exists');
        }
        this.users.push(user);
        const { password, ...payload } = user;
        return { message: 'User registered', user: payload };
    }
    login(payload) {
        const user = this.users.find(u => u.username.toLowerCase() === payload.username?.toLowerCase());
        if (!user || user.password !== payload.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...safe } = user;
        return { message: 'Login success', user: safe };
    }
};
AppService = __decorate([
    Injectable()
], AppService);
export { AppService };
//# sourceMappingURL=app.service.js.map