import { TranslateService } from 'ng2-translate';

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    updated_at: Date;
    created_at: Date;

    constructor(user: any, private _translate?: TranslateService) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.avatar = user.avatar;
        this.updated_at = user.updated_at;
        this.created_at = user.created_at;
    }

    fullName(): string {
        return this.firstName.concat(' ', this.lastName);
    }
}
