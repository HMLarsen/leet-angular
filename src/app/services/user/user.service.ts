import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { UserAccess } from '../../model/user-access.model';
import { User as UserModel } from '../../model/user.model';
import { FirestoreService } from '../firestore/firestore.service';

const ACCESS_COLLECTION_NAME = 'access';
const USERS_COLLECTION_NAME = 'users';
const DEFAULT_EVENT_LIMIT = 20;

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private readonly firestoreService = inject(FirestoreService);

	async getAccessInfo(user: User) {
		const email = user.email;
		if (!email) return undefined;
		return firstValueFrom(this.firestoreService.getDocData<UserAccess>(ACCESS_COLLECTION_NAME, email));
	}

	async getInfo(user: User) {
		const email = user.email;
		if (!email) return undefined;
		return firstValueFrom(this.firestoreService.getDocData<UserModel>(USERS_COLLECTION_NAME, email));
	}

	async isAllowed(user: User) {
		const access = await this.getAccessInfo(user);
		if (!access) return false;
		return access.allowed;
	}

	async getEventLimit(user: User) {
		const access = await this.getAccessInfo(user);
		if (access) {
			return access.eventLimit || DEFAULT_EVENT_LIMIT;
		}
		return DEFAULT_EVENT_LIMIT;
	}

	async getEventCount(user: User) {
		const userInfo = await this.getInfo(user);
		if (userInfo) {
			return userInfo.eventCount || 0;
		}
		return 0;
	}

	async updateEventCount(user: User, dec = false) {
		const email = user.email;
		if (!email) throw new Error('User does not have e-mail');

		let userInfo = await this.getInfo(user);
		if (!userInfo) {
			userInfo = { eventCount: 0 };
		}
		userInfo.eventCount += (dec ? -1 : 1);

		this.firestoreService.updateDoc(user, ACCESS_COLLECTION_NAME, email);
	}
}