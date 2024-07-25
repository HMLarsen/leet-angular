import { inject, Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, } from '@angular/fire/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	private readonly auth = inject(Auth);
	private readonly authState$ = authState(this.auth);

	getCurrentUser() {
		return this.auth.currentUser;
	}

	getState() {
		return this.authState$;
	}

	loginWithGoogle() {
		return signInWithPopup(this.auth, new GoogleAuthProvider());
	}

	signOut() {
		this.auth.signOut();
	}
}
