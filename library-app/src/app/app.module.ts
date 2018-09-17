import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthorComponent } from './author/author.component';
import { BookComponent } from './book/book.component';
import { AppRoutingModule } from './app.routing.module';
import { AppService } from './app.service';
import { HttpClientModule } from "@angular/common/http";
import { CustomMaterialModule } from "./material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AddBookComponent } from './addbook/addbook.component';
import { OnlyNumber } from './addBook/number.directive';
import { EditAuthorComponent } from './editauthor/editauthor.component';
import { EditBookComponent } from './editBook/editBook.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    AuthorComponent,
    BookComponent,
    AddBookComponent,
    EditAuthorComponent,
    EditBookComponent,
    OnlyNumber
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
