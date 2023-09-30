import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ReceiptModule } from '../src/receipt/receipt.module';
import { ReceiptService } from '../src/receipt/receipt.service';
import { Test } from '@nestjs/testing';

describe('receipts', () => {
  let app: INestApplication;

  const testingJson1 = {
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
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ReceiptModule],
    })
      .overrideProvider(ReceiptService)
      .useValue(ReceiptService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST a receipt', () => {
    return request(app.getHttpServer())
      .post('/receipts/process')
      .send(testingJson1)
      .expect(200)
      .expect({});
  });
});
