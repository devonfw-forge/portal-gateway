export class Role {
  static APP1_USER = new Role('APP1_USER');

  constructor(private name:string) {
    this.name = name;
  }
}
