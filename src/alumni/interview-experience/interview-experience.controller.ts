// interview-experience.controller.ts
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
import { InterviewExperienceService } from './interview-experience.service';
import {
  CreateInterviewExperienceDto,
  UpdateInterviewExperienceDto,
} from './dto/index';

@Controller('interview-experience')
export class InterviewExperienceController {
  constructor(
    private readonly interviewExperienceService: InterviewExperienceService,
  ) {}

  // Create a new interview experience
  @Post()
  async create(
    @Body() createInterviewExperienceDto: CreateInterviewExperienceDto,
  ) {
    return await this.interviewExperienceService.create(
      createInterviewExperienceDto,
    );
  }

  // Get all interview experiences (only approved ones)
  @Get()
  async findAll(
    @Query('role') role?: string,
    @Query('page') page: string = '1',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    return await this.interviewExperienceService.findAll(pageNumber, role);
  }

  // Get a specific interview experience by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let experienceId : bigint
    try {
      experienceId = BigInt(id)
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.interviewExperienceService.findOne(experienceId);
  }

  // Get all interview experiences for a user (approved and non-approved)
  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    let userIdInt : bigint
    try {
      userIdInt = BigInt(userId)
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.interviewExperienceService.findByUserId(
      userIdInt,
      pageNumber,
    );
  }

  // Update an interview experience by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterviewExperienceDto: UpdateInterviewExperienceDto,
  ) {
    let experienceId : bigint
    try {
      experienceId = BigInt(id)
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.interviewExperienceService.update(
      experienceId,
      updateInterviewExperienceDto,
    );
  }

  // Delete an interview experience by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let experienceId : bigint
    try {
      experienceId = BigInt(id)
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.interviewExperienceService.remove(experienceId);
  }
}
