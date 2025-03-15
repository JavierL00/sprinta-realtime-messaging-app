import { Injectable } from '@nestjs/common';
import {Supabase} from "../auth/supabase";

@Injectable()
export class UsersService {
	constructor(private readonly supabase: Supabase) {}

	async getUserById(userId: string) {
		const {data, error} = await this.supabase
			.getClient()
			.from('users')
			.select('id, email, name')
			.eq('id', userId)
			.single();

		if (error) {
			return {error: error.message};
		}

		return {user: data};
	}
}
