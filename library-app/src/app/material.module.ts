import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule,
  MatInputModule, MatTableModule, MatToolbarModule,
  MatAutocompleteModule, MatFormFieldModule, MatSortModule,
  MatSelectModule

} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, MatDialogModule,
    MatInputModule, MatTableModule, MatToolbarModule,
    MatAutocompleteModule, MatFormFieldModule, MatSortModule,
    MatSelectModule],
  exports: [
    CommonModule,
    MatButtonModule, MatCardModule, MatDialogModule,
    MatInputModule, MatTableModule, MatToolbarModule,
    MatAutocompleteModule, MatFormFieldModule, MatSortModule,
    MatSelectModule],
})
export class CustomMaterialModule { }
