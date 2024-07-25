import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	private firestore = inject(Firestore);

	getDocData<T>(path: string, ...pathSegments: string[]) {
		const docRef = doc(this.firestore, path, ...pathSegments);
		return docData(docRef) as Observable<T>;
	}

	updateDoc(data: any, path: string, ...pathSegments: string[]) {
		const docRef = doc(this.firestore, path, ...pathSegments);
		return updateDoc(docRef, data);
	}

	getCollectionData<T>(path: string, ...pathSegments: string[]) {
		const collRef = collection(this.firestore, path, ...pathSegments);
		return collectionData(collRef) as Observable<T[]>;
	}
}
