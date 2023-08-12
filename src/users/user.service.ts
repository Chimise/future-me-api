import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    public create(userData: Partial<User>) {
        return this.userRepository.create(userData);
    }

    public findOne(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({id});

    }

    public findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({email});
    }

    public async update(id: string, userAttr: Partial<User>) {
        const user = await this.userRepository.findOneBy({id});
        if(!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, userAttr);
        return this.userRepository.save(user);
    }

    public async delete(id: string) {
        const user = await this.userRepository.findOneBy({id});
        if(!user) {
            throw new NotFoundException('User not found')
        }

        return this.userRepository.remove(user);
    }

    get repository() {
        return this.userRepository;
    }

}