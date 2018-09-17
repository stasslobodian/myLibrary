import { Component, OnInit } from '@angular/core';
import { Author } from '../models/author.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
})
export class AuthorComponent implements OnInit {
  displayedColumns: string[] = ['increment', 'firstName', 'lastName', 'books', 'edit', 'delete'];
  authors: Author[];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.getAuthors();
  }

  getAuthors(): void {
    this.appService.getAuthors()
      .subscribe(res => this.authors = res);
  }

  deleteAuthor(author: Author): void {
    let arr: String[] = [];
    for (let work of author.works) {arr.push(work.title)}
    let works: string = arr.join(", ");
    let notification: string = "Are you sure you want to delete author "
    + author.firstName + " "+ author.lastName
    + "?\nAll related books will be also deleted:\n" + works + "."

    if (confirm(notification)) {
      this.appService.deleteAuthor(author.id).subscribe(() =>
        this.getAuthors()
      );
    }
  }
}
