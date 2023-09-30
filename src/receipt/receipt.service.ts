import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReceiptDto, Item } from './dto/create-receipt.dto';
import { countAlphaNumerics } from '../utils/countAlphaNumerics';

@Injectable()
export class ReceiptService {
  create(createReceiptDto: CreateReceiptDto) {
    const { retailer, purchaseDate, purchaseTime, items, total } =
      createReceiptDto;

    // receipt total already verified to be a valid expression of currency by class validator
    // but we can still throw if something goes wrong here
    const totalCents = parseInt(parseFloat(total).toFixed(2).split('.')[1]);
    if (Number.isNaN(totalCents)) {
      throw new InternalServerErrorException(
        'unable to parse order total into currency',
      );
    }

    const retailerPoints = countAlphaNumerics(retailer);
    const roundTotalPoints = getRoundTotalPoints(totalCents);
    const totalDivisibleByQuatersPoints =
      getDivisibleByQuartersPoints(totalCents);
    const itemCountPoints = getNumberItemsPoints(items);
    const trimmedLengthDivisibleBy3Points =
      getTrimmedLengthDivisibleBy3Points(items);
    const oddDayPoints = getPurchaseDayOddPoints(purchaseDate);
    const between2and4Points = getBetween2and4Points(purchaseTime);

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
}

// 50 points if the total is a round dollar amount with no cents.
const getRoundTotalPoints = (totalCents: number) => {
  return totalCents % 25 === 0 ? 50 : 0;
};

// 25 points if the total is a multiple of 0.25.
const getDivisibleByQuartersPoints = (totalCents: number) => {
  return totalCents % 25 === 0 ? 25 : 0;
};

// 5 points for every two items on the receipt.
const getNumberItemsPoints = (items: Item[]) => {
  return Math.floor(items.length / 2) * 5;
};

const getTrimmedLengthDivisibleBy3Points = (items: Item[]) => {
  return items.reduce((sum, item) => {
    if (item.shortDescription.trim().length % 3 !== 0) return sum;
    console.log(item.shortDescription.trim());
    return sum + Math.ceil(item.price * 0.2);
  }, 0);
};

const getPurchaseDayOddPoints = (purchaseDate: Date) => {
  // purchaseDate already validated as a date by class-validator
  const purchaseDay = new Date(purchaseDate).getDay();
  const isDayOdd = purchaseDay % 2 === 1;
  return isDayOdd ? 6 : 0;
};

const getBetween2and4Points = (purchaseTime: string) => {
  const time = parseInt(purchaseTime.split(':')[0]);
  const isBetween2and4pm = time >= 14 && time < 16;
  return isBetween2and4pm ? 10 : 0;
};
