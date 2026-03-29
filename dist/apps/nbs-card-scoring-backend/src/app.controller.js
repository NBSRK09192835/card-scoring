import { __decorate, __metadata, __param } from "tslib";
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getUsers() {
        return this.appService.getUsers();
    }
    signup(payload) {
        return this.appService.signup(payload);
    }
    login(payload) {
        return this.appService.login(payload);
    }
};
__decorate([
    Get('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getUsers", null);
__decorate([
    Post('signup'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "signup", null);
__decorate([
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
AppController = __decorate([
    Controller('api'),
    __metadata("design:paramtypes", [AppService])
], AppController);
export { AppController };
//# sourceMappingURL=app.controller.js.map