import { afterNextRender, Component } from '@angular/core';
import { Router } from '@angular/router';

import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [],
	templateUrl: './home.component.html',
	styleUrl: './home.component.sass'
})
export class HomeComponent {

	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);

	user?: User;
	authStateSubs?: Subscription;
	loadingUser = true;
	loadingLogin = false;

	private userService = inject(UserService);

	constructor() {
		afterNextRender(() => {
			const authState = this.authService.getState();
			this.authStateSubs = authState.subscribe((aUser: User | undefined) => {
				this.loadingUser = false;
				this.user = aUser;
			});
		});
	}

	ngOnDestroy() {
		this.authStateSubs?.unsubscribe();
	}

	loginGoogle() {
		this.loadingLogin = true;

		this.authService.loginWithGoogle()
			.then(async response => {
				const user = response.user;
				try {
					const isAllowedUser = await this.userService.isAllowed(user);
					if (isAllowedUser) {
						this.goToDashboard();
					} else {
						throw new Error;
					}
				} catch {
					user.delete();
					//this.showModalEmitter.emit();
				}
			})
			.catch(() => { })
			.finally(() => this.loadingLogin = false);
	}

	goToDashboard() {
		this.router.navigate(['/dashboard']);
	}

	logout() {
		this.authService.signOut();
	}
}
