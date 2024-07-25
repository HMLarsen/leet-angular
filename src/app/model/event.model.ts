import { Timestamp } from "@angular/fire/firestore";

export interface Event {
	id: string;
	createdAt: Timestamp;
	bannerFile?: File;
	name: string;
	date: Timestamp;
	description: string;
	acceptingParticipants: boolean;
}