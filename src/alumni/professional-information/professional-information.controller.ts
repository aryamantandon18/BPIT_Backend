import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProfessionalInformationService } from './professional-information.service';
import {
  CreateProfessionalInformationDto,
  UpdateProfessionalInformationDto,
} from './dto/index';

@Controller('professional-information')
export class ProfessionalInformationController {
  constructor(
    private readonly professionalInformationService: ProfessionalInformationService,
  ) {}

  @Post()
  async create(
    @Body() createProfessionalInformationDto: CreateProfessionalInformationDto,
  ) {
    return await this.professionalInformationService.create(
      createProfessionalInformationDto,
    );
  }

  @Get()
  async findAll(
    @Query('role') role?: string,
    @Query('page') page: string = '1',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    return await this.professionalInformationService.findAll(pageNumber, role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let professionalId : bigint
    try{
      professionalId = BigInt(id)
    } catch{
      throw new BadRequestException('Invalid id')
    }
    return await this.professionalInformationService.findOne(professionalId);
  }

  @Get('user/:userId')
  async findAllByUserId(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    let userIdInt : bigint;
    try{
      userIdInt = BigInt(userId)
    } catch{
      throw new BadRequestException('Invalid id')
    }
    return await this.professionalInformationService.findAllByUserId(
      userIdInt,
      pageNumber,
    );
  }

  @Get('current-company/:userId')
  async findCurrentCompany(@Param('userId') userId: string) {
    let userIdInt : bigint;
    try{
      userIdInt = BigInt(userId)
    } catch{
      throw new BadRequestException('Invalid id')
    }
    return await this.professionalInformationService.findCurrentCompanyByUserId(
      userIdInt,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfessionalInformationDto: UpdateProfessionalInformationDto,
  ) {
    let professionalId : bigint
    try{
      professionalId = BigInt(id)
    } catch{
      throw new BadRequestException('Invalid id')
    }
    return await this.professionalInformationService.update(
      professionalId,
      updateProfessionalInformationDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let professionalId : bigint
    try{
      professionalId = BigInt(id)
    } catch{
      throw new BadRequestException('Invalid id')
    }
    return await this.professionalInformationService.remove(professionalId);
  }
}
