import { Deserializable } from "./deserializable.model";

export class Person implements Deserializable {

  id: number;
  firstName: string;
  lastName: string;

  deserialize(input: any) {
    Object.assign(<any>this, input);
    return this;
  }

  getFullName() {
  return this.firstName + ' ' + this.lastName;
  }
}
