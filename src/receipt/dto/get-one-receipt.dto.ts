import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetOneReceiptDTO {
  @IsUUID()
  id: UUID;
}
