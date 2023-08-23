import { Controller, UseGuards, Get, Param, ParseUUIDPipe, NotFoundException, Body, Post, Put, BadRequestException, Delete } from "@nestjs/common";
import {JwtGuard} from '../common/guard/jwt.guard';
import { SetRoles } from "../common/decorators/user.decorator";
import { UserService } from "./user.service";
import { AuthSignUpData } from "../auth/dto";
import { UpdateUserDto } from "./dtos/index.dto";
import { AuthService } from "../auth/auth.service";


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService, private authService: AuthService) {}

    @SetRoles('admin')
    @Get()
    getAllUsers() {
        return this.userService.findAll();
    }

    
    @SetRoles('admin')
    @Get(':id')
    getUser(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
        const user = this.userService.findOne(id);
        if(!user) {
            throw new NotFoundException();
        }

        return user;
    }

    @SetRoles('admin')
    @Post()
    async createUser(@Body() body: AuthSignUpData) {
        const user = await this.authService.signup(body.email, body.password, body.role);
        return user;
    }


    @SetRoles('admin')
    @Put(':id')
    async updateUser(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() body: UpdateUserDto) {
        if(!body || Object.keys(body).length === 0) {
            throw new BadRequestException('Invalid body');
        }

        if(body.password) {
            body.password = await this.authService.hashPassword(body.password);
        }

        return this.userService.update(id, body);
    }   


    @SetRoles('admin')
    @Put(':id')
    async deleteUser(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
        return this.userService.delete(id);
    }


}