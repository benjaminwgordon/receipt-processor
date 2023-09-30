import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { GetOneReceiptDTO } from './dto/get-one-receipt.dto';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('/process')
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Get(':id/points')
  findOne(@Param('id') getOneReceiptDto: GetOneReceiptDTO) {
    return this.receiptService.findOne(getOneReceiptDto);
  }
}
