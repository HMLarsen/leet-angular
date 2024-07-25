import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventParticipantsComponent } from './event-participants/event-participants.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home/home.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { PublicEventComponent } from './public-event/public-event.component';
import { UpsertEventComponent } from './upsert-event/upsert-event.component';

const redirectUnauthorized = () => redirectUnauthorizedTo(['']);

export const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{
		path: 'dashboard', component: DashboardComponent, ...canActivate(redirectUnauthorized), children: [
			{ path: '', redirectTo: 'events', pathMatch: 'full' },
			{ path: 'events', component: MyEventsComponent },
			{ path: 'events/create', component: UpsertEventComponent },
			{ path: 'events/:id', component: EventComponent },
			{ path: 'events/:id/edit', component: UpsertEventComponent },
			{ path: 'events/:id/participants', component: EventParticipantsComponent }
		]
	},
	{ path: 'events/:params', component: PublicEventComponent },
	{ path: '**', redirectTo: '/' }
];
