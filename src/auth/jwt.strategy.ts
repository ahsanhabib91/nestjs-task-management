import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (
		@InjectRepository(UserRepository)
		private uerRepository: UserRepository
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'topSecret51'
		});
	}

	async validate (payload: JwtPayload): Promise<User> {
		const { username } = payload;
		const user = await this.uerRepository.findOne({ username });

		if(!user) {
			throw new NotFoundException();
		}

		return user
	}
}