import { Deserializable } from "./deserializable.model";

export class Work implements Deserializable {

  id: number;
  title: string;

  deserialize(input: any) {
    Object.assign(<any>this, input);
    return this;
  }
}
