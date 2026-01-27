import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AttributeDefinitionsService } from './attribute-definitions.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@Controller('attribute-definitions')
export class AttributeDefinitionsController {
  constructor(
    private readonly attributeDefinitionsService: AttributeDefinitionsService,
  ) {}

  @Post()
  create(@Body() createAttributeDefinitionDto: CreateAttributeDefinitionDto) {
    return this.attributeDefinitionsService.create(createAttributeDefinitionDto);
  }

  @Get()
  findAll() {
    return this.attributeDefinitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeDefinitionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDefinitionDto: UpdateAttributeDefinitionDto,
  ) {
    return this.attributeDefinitionsService.update(
      id,
      updateAttributeDefinitionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeDefinitionsService.remove(id);
  }
}
