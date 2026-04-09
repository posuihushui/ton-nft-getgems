import { Length, Matches } from 'class-validator';

export class CreateUploadCredentialsDto {
  @Length(1, 80)
  @Matches(/^[a-zA-Z0-9]+(\.(jpg|png|gif|mp4|json|webp))?$/)
  fileName!: string;
}
