import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from '../app.service';
import { Book } from '../models/book.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'editbook',
  templateUrl: './editbook.component.html',
})
export class EditBookComponent implements OnInit {
  isReady:boolean = false;
  firstNames: string[] = [];
  lastNames: string[] = [];
  filteredFirstNames: Observable<string[]>[] = [];
  filteredLastNames: Observable<string[]>[] = [];
  updateForm: FormGroup;

  id: number;
  numberOfAuthors: number;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.numberOfAuthors = 0;
    this.createForm();
    this.getBook();
  }

  createForm() {
    this.updateForm = this.fb.group({
      id: [],
      title: ['', [Validators.required]],
      genre: [''],
      year: ['', [Validators.required]],
      persons: this.fb.array([
        this.initForm()
      ])
    });
  }

  initForm() {
    return this.fb.group({
      id: [],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  getBook() {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id && this.id > 0) {
      this.isReady = true;
      this.appService.getBook(this.id).subscribe(
        res => {
          // get form array reference
          const persons = this.updateForm.get('persons') as FormArray;
          // empty form array
          while (persons.length) {persons.removeAt(0);}
          // use patchValue
          this.updateForm.patchValue(res);
          // add form array values in a loop
          res.persons.forEach(person => {
            persons.push(this.fb.group(person));
            this.numberOfAuthors += 1;
          });
          // load all names
          this.getNames();
        },
      );
    }
  }

  private getNames(): void {
    this.appService.getNames()
      .subscribe(res => {
        this.firstNames = res.firstNames;
        this.lastNames = res.lastNames;
        for(let i = 0; i < this.numberOfAuthors; i++) {
          this.ManageNameControl(i);
        }
      });
  }

  ManageNameControl(index: number) {
    var arrayControl = this.updateForm.get('persons') as FormArray;
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
    const controls = <FormArray>this.updateForm.controls['persons'];
    let formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
    controls.push(formGroup);
    this.ManageNameControl(controls.length - 1);
  }

  removeAuthor(i: number) {
    const controls = <FormArray>this.updateForm.controls['persons'];
    controls.removeAt(i);
    this.filteredFirstNames.splice(i, 1);
    this.filteredLastNames.splice(i, 1);
  }

  submit(updateForm: FormGroup) {
    const b = this.prepareSave(updateForm);
    this.appService.updateBook(this.id, b).subscribe(() =>
      this.router.navigate(['/books'])
    );
  }

  private prepareSave(updateForm: FormGroup): Book {
    return new Book().deserialize(updateForm.value);
  }
}
