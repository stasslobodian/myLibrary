import { Work } from "./work.model";
import { Deserializable } from "./deserializable.model";

export class Author implements Deserializable {

  id: number;
  firstName: string;
  lastName: string;
  works: Work[];

  deserialize(input: any) {
    Object.assign(<any>this, input);
    input.works && (this.works = input.works.map((work: Work) => new Work().deserialize(work)));
    return this;
  }
}
