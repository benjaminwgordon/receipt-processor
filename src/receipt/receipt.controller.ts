import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post(':id/process')
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptService.findOne(+id);
  }
}
