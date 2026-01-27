import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';

@Controller('option-groups')
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Post()
  create(@Body() createOptionGroupDto: CreateOptionGroupDto) {
    return this.optionGroupsService.create(createOptionGroupDto);
  }

  @Get()
  findAll() {
    return this.optionGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionGroupsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOptionGroupDto: UpdateOptionGroupDto,
  ) {
    return this.optionGroupsService.update(id, updateOptionGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionGroupsService.remove(id);
  }
}
