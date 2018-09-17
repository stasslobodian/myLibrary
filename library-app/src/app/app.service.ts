import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Author } from './models/author.model'

import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './models/book.model';
import { Names } from './models/names.model';
import { Person } from './models/person.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AppService {

  constructor(private http: HttpClient) {}

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books')
      .pipe(
        map(data => data.map(data2 => new Book().deserialize(data2))));
  }

  public getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>('/api/authors')
      .pipe(
        map(data => data.map(v => new Author().deserialize(v)))
      );
  }

  public getBook(id: number): Observable<Book> {
    const url = '/api/book/' + id;
    return this.http.get<Book>(url)
      .pipe();
  }

  public getPerson(id: number): Observable<Person> {
    const url = '/api/person/' + id;
    return this.http.get<Person>(url)
      .pipe();
  }

  public getNames(): Observable<Names> {
    return this.http.get<Names>('api/names')
      .pipe();
  }

  public submit(book: Book): Observable<Book> {
    return this.http.post<Book>('/api', book, httpOptions).pipe();
  }

  public updateBook (id: number, book: Book): Observable<any> {
    const url = '/api/book/' + id;
    return this.http.put(url, book, httpOptions).pipe();
  }

  public updatePerson (id: number, person: Person): Observable<any> {
    const url = '/api/person/' + id;
    return this.http.put(url, person, httpOptions).pipe();
  }

  public deleteBook(id: number): Observable<{}> {
    const url = '/api/book/' + id;
    return this.http.delete(url, httpOptions)
      .pipe();
  }

  public deleteAuthor(id: number): Observable<{}> {
    const url = '/api/author/' + id;
    return this.http.delete(url, httpOptions)
      .pipe();
  }
}
