import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { OptionGroup } from '../entities/option-group.entity';
import { OptionValue } from '../entities/option-value.entity';
import { OptionValuesController } from './option-values.controller';
import { OptionValuesService } from './option-values.service';
import { OptionGroupsController } from './option-groups.controller';
import { OptionGroupsService } from './option-groups.service';
import { Product } from '../entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OptionGroup, OptionValue, Product])],
    controllers: [OptionGroupsController, OptionValuesController],
    providers: [OptionGroupsService, OptionValuesService],
    exports: [OptionGroupsService, OptionValuesService],
})
export class OptionsModule { }
