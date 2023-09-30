import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { plainToInstance } from 'class-transformer';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ReceiptService', () => {
  let service: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptService],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
  });

  // run the testing example through the class-transformer
  const testingData1: CreateReceiptDto = plainToInstance(CreateReceiptDto, {
    retailer: 'Target',
    purchaseDate: '2022-01-01',
    purchaseTime: '13:01',
    items: [
      {
        shortDescription: 'Mountain Dew 12PK',
        price: '6.49',
      },
      {
        shortDescription: 'Emils Cheese Pizza',
        price: '12.25',
      },
      {
        shortDescription: 'Knorr Creamy Chicken',
        price: '1.26',
      },
      {
        shortDescription: 'Doritos Nacho Cheese',
        price: '3.35',
      },
      {
        shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
        price: '12.00',
      },
    ],
    total: '35.35',
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct point count with valid input', () => {
    expect(service.create(testingData1)).toStrictEqual({ points: 28 });
  });

  it('should extract the number of cents from the input total', () => {
    expect(service.getTotalCents('39.85')).toBe(85);
  });

  it('should throw an exception if the input number of cents is unparsable', () => {
    expect(() => {
      service.getTotalCents('123.0p3');
    }).toThrow(BadRequestException);
  });

  it('should correctly calculate the bonus points for a non-round number total', () => {
    expect(service.getRoundTotalPoints(37)).toBe(0);
  });
  it('should correctly calculate the bonus points for a round number total', () => {
    expect(service.getRoundTotalPoints(0)).toBe(50);
  });
});
