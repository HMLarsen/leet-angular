import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../model/event.model';
import { AuthService } from '../services/auth/auth.service';
import { EventService } from '../services/event/event.service';

@Component({
	selector: 'app-event',
	standalone: true,
	imports: [],
	templateUrl: './event.component.html',
	styleUrl: './event.component.sass',
})
export class EventComponent {

	private readonly route = inject(ActivatedRoute);
	private readonly authService = inject(AuthService);
	private readonly eventService = inject(EventService);

	loadingEvent = signal(true);
	event = signal<Event | undefined>(undefined);

	constructor() {
		afterNextRender(() => {
			const eventId = this.route.snapshot.paramMap.get('id') || undefined;
			if (eventId) this.getEvent(eventId);
		});
	}

	async getEvent(eventId: string) {
		const user = this.authService.getCurrentUser()!;
		const userEmail = user?.email;
		this.eventService.getEvent(userEmail!, eventId).subscribe(event2 => {
			this.loadingEvent.set(false);
			this.event.set(event2);
		});
	}
}
