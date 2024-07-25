import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../model/event.model';
import { AuthService } from '../services/auth/auth.service';
import { EventService } from '../services/event/event.service';

@Component({
	selector: 'app-my-events',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './my-events.component.html',
	styleUrl: './my-events.component.sass'
})
export class MyEventsComponent {

	private readonly authService = inject(AuthService);
	private readonly eventService = inject(EventService);

	eventsSubscription?: Subscription;
	events?: Event[];
	loadingEvents = true;

	constructor() {
		afterNextRender(() => {
			const user = this.authService.getCurrentUser();
			const userEmail = user?.email;
			this.eventsSubscription = this.eventService.getEvents(userEmail!)
				.subscribe(events => {
					this.loadingEvents = false;
					this.events = events;
				});
		});
	}

	ngOnDestroy() {
		this.eventsSubscription?.unsubscribe();
	}
}
