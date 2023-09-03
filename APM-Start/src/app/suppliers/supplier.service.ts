import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {throwError, Observable, of, map, Subscription} from 'rxjs';
import {Supplier} from "./supplier";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  subscriptions:Subscription[]=[]
  constructor(private http: HttpClient) {
    console.log('suppier service initiated.')
    this.subscriptions.push(this.suppliersWithMap$.subscribe({
      next:(suppObs$)=>{
        this.subscriptions.push(suppObs$.subscribe(supp=>console.log(supp)))
      }
    }))

    //clear subscriptions on destroy...
  }

  suppliersWithMap$=of(1,5,8).pipe(map((id)=> this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)))

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
