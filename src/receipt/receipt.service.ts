import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptService {
  create(createReceiptDto: CreateReceiptDto) {
    return 'This action adds a new receipt';
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }
}
