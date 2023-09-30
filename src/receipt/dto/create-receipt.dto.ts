import {
  IsCurrency,
  IsDate,
  IsMilitaryTime,
  ValidateNested,
} from 'class-validator';

export class CreateReceiptDto {
  retailer: String;

  @IsDate()
  purchaseDate: String;

  @IsMilitaryTime()
  purchaseTime: String;

  @ValidateNested()
  items: Item[];
}

class Item {
  shortDescription: String;

  @IsCurrency()
  price: number;
}
