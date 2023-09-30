import {
  IsCurrency,
  IsDate,
  IsMilitaryTime,
  ValidateNested,
} from 'class-validator';

export class CreateReceiptDto {
  retailer: string;

  @IsDate()
  purchaseDate: Date;

  @IsMilitaryTime()
  purchaseTime: string;

  @ValidateNested()
  items: Item[];

  @IsCurrency()
  total: string;
}

export class Item {
  shortDescription: string;

  @IsCurrency()
  price: number;
}
