import { Role } from "../auth/roles/role.enum";

export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roles: Role[];

    constructor(firstname: string, lastname: string, email: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}