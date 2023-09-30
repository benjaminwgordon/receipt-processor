import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReceiptDto, Item } from './dto/create-receipt.dto';
import { countAlphaNumerics } from '../utils/countAlphaNumerics';

@Injectable()
export class ReceiptService {
  create(createReceiptDto: CreateReceiptDto) {
    const { retailer, purchaseDate, purchaseTime, items, total } =
      createReceiptDto;

    // receipt total already verified to be a valid expression of currency by class validator
    // but we can still throw if something goes wrong here
    const totalCents = this.getTotalCents(total);
    if (Number.isNaN(totalCents)) {
      throw new InternalServerErrorException(
        'unable to parse order total into currency',
      );
    }

    const retailerPoints = countAlphaNumerics(retailer);
    const roundTotalPoints = this.getRoundTotalPoints(totalCents);
    const totalDivisibleByQuatersPoints =
      this.getDivisibleByQuartersPoints(totalCents);
    const itemCountPoints = this.getNumberItemsPoints(items);
    const trimmedLengthDivisibleBy3Points =
      this.getTrimmedLengthDivisibleBy3Points(items);
    const oddDayPoints = this.getPurchaseDayOddPoints(purchaseDate);
    const between2and4Points = this.getBetween2and4Points(purchaseTime);

    const totalPoints =
      retailerPoints +
      roundTotalPoints +
      totalDivisibleByQuatersPoints +
      itemCountPoints +
      trimmedLengthDivisibleBy3Points +
      oddDayPoints +
      between2and4Points;

    return { points: totalPoints };
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }

  getTotalCents = (total: string): number => {
    const [_dollars, cents] = total.split('.');
    if (cents === undefined) {
      throw new InternalServerErrorException(
        'unable to parse cents from order total',
      );
    }
    const parsedCents = Number(cents);
    if (Number.isNaN(parsedCents)) {
      throw new BadRequestException('unable to parse cents from receipt total');
    }
    return parsedCents;
  };

  // 50 points if the total is a round dollar amount with no cents.
  getRoundTotalPoints = (totalCents: number) => {
    return totalCents === 0 ? 50 : 0;
  };

  // 25 points if the total is a multiple of 0.25.
  getDivisibleByQuartersPoints = (totalCents: number) => {
    return totalCents % 25 === 0 ? 25 : 0;
  };

  // 5 points for every two items on the receipt.
  getNumberItemsPoints = (items: Item[]) => {
    return Math.floor(items.length / 2) * 5;
  };

  getTrimmedLengthDivisibleBy3Points = (items: Item[]) => {
    return items.reduce((sum, item) => {
      if (item.shortDescription.trim().length % 3 !== 0) return sum;
      console.log(item.shortDescription.trim());
      return sum + Math.ceil(item.price * 0.2);
    }, 0);
  };

  getPurchaseDayOddPoints = (purchaseDate: Date) => {
    // purchaseDate already validated as a date by class-validator
    const purchaseDay = new Date(purchaseDate).getDay();
    const isDayOdd = purchaseDay % 2 === 1;
    return isDayOdd ? 6 : 0;
  };

  getBetween2and4Points = (purchaseTime: string) => {
    const time = parseInt(purchaseTime.split(':')[0]);
    const isBetween2and4pm = time >= 14 && time < 16;
    return isBetween2and4pm ? 10 : 0;
  };
}
