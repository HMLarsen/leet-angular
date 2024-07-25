import { inject, Injectable } from '@angular/core';
import { Event } from '../../model/event.model';
import { FirestoreService } from '../firestore/firestore.service';

const USERS_COLLECTION_NAME = 'users';
const EVENTS_COLLECTION_NAME = 'events';

@Injectable({
	providedIn: 'root'
})
export class EventService {

	private readonly firestoreService = inject(FirestoreService);

	getEvents(userEmail: string) {
		return this.firestoreService.getCollectionData<Event>(USERS_COLLECTION_NAME, userEmail, EVENTS_COLLECTION_NAME);
	}

	getEvent(userEmail: string, eventId: string) {
		return this.firestoreService.getDocData<Event>(USERS_COLLECTION_NAME, userEmail, EVENTS_COLLECTION_NAME, eventId);
	}
}
