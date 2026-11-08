import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarPath?: string;
  public password!: string;
  public type!: UserType;
}
