import { Person } from "./person.model";

export class Book {

  id: number;
  title: string;
  genre: string;
  year: number;
  persons: Person[];

  deserialize(input: any) {
    Object.assign(<any>this, input);
    input.persons && (this.persons = input.persons.map((person: Person) => new Person().deserialize(person)));
    return this;
  }
}
