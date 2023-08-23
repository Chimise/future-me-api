import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { User } from "./user.entity";
import { UserToken } from "./user.entity";

type UserOrId = User | string;

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(UserToken) private userTokenRepository: Repository<UserToken>) { }

    public create(userData: Partial<User>) {
        const user = this.userRepository.create();
        Object.assign(user, userData);
        return this.userRepository.save(user);
    }

    public findOne(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });

    }

    public findAll(options?: FindManyOptions<User>) : Promise<User[]> {
        return this.userRepository.find(options);
    }

    public findOneBy(data: Partial<Omit<User, 'messages' | 'tokens' | 'toJSON'>>) {
        return this.userRepository.findOneBy(data);
    }

    public findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    public async update(id: UserOrId, userAttr: Partial<User>) {
        const user = await this.getUser(id);
        Object.assign(user, userAttr);
        return this.userRepository.save(user);
    }

    public async delete(id: UserOrId) {
        const user = await this.getUser(id);
        return this.userRepository.remove(user);
    }

    public async saveToken(id: UserOrId, kind: string, token: string) {
        const user = await this.getUser(id);
        const userToken = await this.userTokenRepository.create();
        Object.assign(userToken, { kind, access_token: token, user: user.id });

        return this.userTokenRepository.save(userToken);
    }

    private async getUser(user: UserOrId): Promise<User> {
        if (user instanceof User) {
            return user;
        }

        const newUser = await this.userRepository.findOneBy({ id: user });
        if (!newUser) {
            throw new NotFoundException('User not found');
        }

        return newUser;
    }

    get repository() {
        return this.userRepository;
    }

}


