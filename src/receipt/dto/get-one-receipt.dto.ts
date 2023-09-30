import { IsUUID } from 'class-validator';

export class GetOneReceiptDTO {
  @IsUUID()
  id: string;
}
