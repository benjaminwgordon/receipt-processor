import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { plainToInstance } from 'class-transformer';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetOneReceiptDTO } from './dto/get-one-receipt.dto';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let existingMockReceipt: GetOneReceiptDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptService],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);

    // preload one receipt into memory for all findOne tests
    let existingReceipt: { id: string } = service.create(testingData1);
    existingMockReceipt = plainToInstance(GetOneReceiptDTO, existingReceipt);
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

  const testingData2: CreateReceiptDto = plainToInstance(CreateReceiptDto, {
    retailer: 'M&M Corner Market',
    purchaseDate: '2022-03-20',
    purchaseTime: '14:33',
    items: [
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
    ],
    total: '9.00',
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a uuid with valid input', () => {
    expect(service.create(testingData1).id).toBeDefined();
  });

  it('should correctly evaluate the points', () => {
    expect(service.getTotalPoints(testingData1)).toStrictEqual(28);
  });

  it('should correctly evaluate the points', () => {
    expect(service.getTotalPoints(testingData2)).toStrictEqual(109);
  });

  it('should extract the number of cents from the input total', () => {
    expect(service.getTotalCents('39.85')).toBe(85);
  });

  it('should throw an exception if the input receipt total is not decimal', () => {
    expect(() => {
      service.getTotalCents('39');
    }).toThrowError();
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

  it('should fetch existing receipts by UUID', () => {
    expect(service.findOne(existingMockReceipt)).toStrictEqual({ points: 28 });
  });

  it('should throw a 404 if the id does not exist in records', () => {});
  it('should throw an error if the points associated with the ID are not valid', () => {
    expect(() => {
      service.findOne({ id: 'UUID-THAT-DOESNT-EXIST-YET' });
    }).toThrowError(NotFoundException);
  });
});
