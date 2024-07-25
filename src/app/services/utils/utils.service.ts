import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	private readonly platform = inject(PLATFORM_ID);

	isBrowser() {
		return isPlatformBrowser(this.platform);
	}

	isServer() {
		return isPlatformServer(this.platform);
	}
}
