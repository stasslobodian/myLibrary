import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from '../app.service';
import { Book } from '../models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'addbook',
  templateUrl: './addbook.component.html',
})
export class AddBookComponent implements OnInit {
  isReady:boolean = false;
  firstNames: string[] = [];
  lastNames: string[] = [];
  filteredFirstNames: Observable<string[]>[] = [];
  filteredLastNames: Observable<string[]>[] = [];
  addForm: FormGroup;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getNames();
  }

  private getNames(): void {
    this.appService.getNames()
      .subscribe(res => {
        this.firstNames = res.firstNames;
        this.lastNames = res.lastNames;
        this.createForm();
      });
  }

  createForm() {
    this.addForm = this.fb.group({
      title: ['', [Validators.required]],
      genre: [''],
      year: ['', [Validators.required]],
      persons: this.initPersons(),
    });
    this.ManageNameControl(0);
    this.isReady = true;
  }

  initPersons() {
    var formArray = this.fb.array([]);
    for (let i = 0; i < 1; i++) {
      formArray.push(this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
      }));
    }
    return formArray;
  }

  ManageNameControl(index: number) {
    var arrayControl = this.addForm.get('persons') as FormArray;
    this.filteredFirstNames[index] = arrayControl.at(index).get('firstName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'F'))
      );
    this.filteredLastNames[index] = arrayControl.at(index).get('lastName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'L'))
      );
  }

  private _filter(value: string, key: string): string[] {
    const filterValue = value.toLowerCase();
    if (key === 'F') {
      return this.firstNames.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.lastNames.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  addAuthor() {
    const controls = <FormArray>this.addForm.controls['persons'];
    let formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
    controls.push(formGroup);
    this.ManageNameControl(controls.length - 1);
  }

  removeAuthor(i: number) {
    const controls = <FormArray>this.addForm.controls['persons'];
    controls.removeAt(i);
    this.filteredFirstNames.splice(i, 1);
    this.filteredLastNames.splice(i, 1);
  }

  submit(addForm: FormGroup) {
    const book = this.prepareSave(addForm);
    this.appService.submit(book).subscribe(() =>
      this.router.navigate(['/books'])
    );
  }

  private prepareSave(addForm: FormGroup): Book {
    return new Book().deserialize(addForm.value);
  }
}
