import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
})
export class BookComponent implements OnInit {
  displayedColumns: string[] = ['increment', 'title', 'persons', 'genre', 'year', 'edit', 'delete'];
  books: Book[];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.getBooks();
  }

  getBooks(): void {
    this.appService.getBooks()
      .subscribe(res => this.books = res);
  }

  deleteBook(book: Book): void {
    if(confirm("Are you sure you want to delete book " + book.title + "?")) {
      this.books = this.books.filter(b => b !== book);
      this.appService.deleteBook(book.id).subscribe();
    }
  }
}
