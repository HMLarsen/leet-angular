import { Component, ExperimentalPendingTasks, inject, makeStateKey, OnInit, signal, TransferState } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../model/event.model';
import { EventService } from '../services/event/event.service';
import { UtilsService } from '../services/utils/utils.service';

const eventKey = makeStateKey<Event>('event');

@Component({
	selector: 'app-public-event',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './public-event.component.html',
	styleUrl: './public-event.component.sass'
})
export class PublicEventComponent implements OnInit {

	private readonly transferState = inject(TransferState);
	private readonly route = inject(ActivatedRoute);
	private readonly eventService = inject(EventService);
	private readonly utilsService = inject(UtilsService);
	private readonly title = inject(Title);
	private readonly meta = inject(Meta);

	private serverEventSubscription?: Subscription;

	event = signal<Event | undefined>(undefined);

	constructor() {
		if (this.utilsService.isServer()) {
			const eventId = this.route.snapshot.paramMap.get('params') || undefined;
			if (eventId) this.updatePageInServer(eventId);
		}
	}

	ngOnInit() {
		const eventState = this.transferState.get(eventKey, undefined);
		this.event.set(eventState);
	}

	ngOnDestroy() {
		this.serverEventSubscription?.unsubscribe();
	}

	updatePageInServer(eventId: string) {
		const pendingTasks = inject(ExperimentalPendingTasks);
		const taskCleanup = pendingTasks.add();

		this.serverEventSubscription = this.eventService.getEvent('hugomarcel91@gmail.com', eventId)
			.subscribe({
				next: eventDoc => {
					if (eventDoc) {
						this.title.setTitle(eventDoc.name);
						this.meta.updateTag({ name: 'og:title', content: this.title.getTitle() });
						this.transferState.set(eventKey, eventDoc);
					}
					taskCleanup();
				},
				error: _ => taskCleanup()
			});
	}
}
