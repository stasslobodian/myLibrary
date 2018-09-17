import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from '../app.service';
import { Person } from '../models/person.model';

@Component({
  selector: 'editauthor',
  templateUrl: './editauthor.component.html'
})
export class EditAuthorComponent implements OnInit {
  isReady:boolean = false;
  person: Person;
  updateForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPerson();
  }

  getPerson(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.appService.getPerson(id)
      .subscribe(person => {
        this.person = person;
        this.createForm();
      });
  }

  createForm() {
    this.updateForm = this.fb.group({
      'id': [],
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
    });
    this.updateForm.setValue(this.person);
    this.isReady = true;
  }

  submit(updateForm: FormGroup) {
    const updated = this.prepareSave(updateForm);
    this.appService.updatePerson(this.person.id, updated).subscribe(() =>
      this.router.navigate(['/authors'])
    );
  }

  private prepareSave(updateForm: FormGroup): Person {
    return new Person().deserialize(updateForm.value);
  }
}
