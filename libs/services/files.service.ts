import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient) {}

  public upload(name: string, data: string): Observable<any> {
    return this.http.post(`http://localhost:8000`, { name, data });
  }
}
