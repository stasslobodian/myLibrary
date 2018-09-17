import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorComponent } from './author/author.component';
import { BookComponent } from './book/book.component';
import { AddBookComponent } from './addbook/addbook.component';
import { EditAuthorComponent } from './editauthor/editauthor.component';
import { EditBookComponent } from './editBook/editBook.component';

const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BookComponent },
  { path: 'authors', component: AuthorComponent },
  { path: 'addbook', component: AddBookComponent },
  { path: 'editauthor/:id', component: EditAuthorComponent},
  { path: 'editbook/:id', component: EditBookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
