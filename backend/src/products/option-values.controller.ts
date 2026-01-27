import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OptionValuesService } from './option-values.service';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';

@Controller('option-values')
export class OptionValuesController {
  constructor(private readonly optionValuesService: OptionValuesService) {}

  @Post()
  create(@Body() createOptionValueDto: CreateOptionValueDto) {
    return this.optionValuesService.create(createOptionValueDto);
  }

  @Get()
  findAll() {
    return this.optionValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionValuesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOptionValueDto: UpdateOptionValueDto,
  ) {
    return this.optionValuesService.update(id, updateOptionValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionValuesService.remove(id);
  }
}
