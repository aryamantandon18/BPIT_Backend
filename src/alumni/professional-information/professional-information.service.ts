import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProfessionalInformationDto,
  UpdateProfessionalInformationDto,
} from './dto/index';
import { handleError, isPrismaError } from '../helper/exception.helper';

@Injectable()
export class ProfessionalInformationService {
  constructor(private prisma: PrismaService) {}

  // Create a new professional information entry
  async create(dto: CreateProfessionalInformationDto) {
    try {
      const professionalInfo = await this.prisma.professionalInformation.create(
        {
          data: dto,
        },
      );

      return {
        status: 'success',
        item: professionalInfo,
        message: 'Professional information created successfully',
      };
    } catch (error) {
      handleError(error);
    }
  }

  // Get all professional information entries (approved only)
  async findAll(page: number, role?: string) {
    try {
      const whereClause: any = { isApproved: true };

      if (role === 'ALUMNI') {
        whereClause.user = { role: 'ALUMNI' };
      } else if (role === 'STUDENT') {
        whereClause.user = { role: 'STUDENT' };
      }
      const professionalInfos =
        await this.prisma.professionalInformation.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                branch: true,
                passingYear: true,
                section: true,
                email: true,
                githubProfileUrl: true,
                linkedInProfileUrl: true,
              },
            },
          },
          skip: (page - 1) * 10,
          take: 10,
        });
      const total = await this.prisma.professionalInformation.count({
        where: whereClause,
      });
      return {
        status: 'success',
        items: professionalInfos,
        meta: {
          totalItems: total,
          totalPages: Math.ceil(total / 10),
          currentPage: page,
          itemsPerPage: 10,
        },
      };
    } catch (error) {
      handleError(error);
    }
  }

  // Get professional information by ID
  async findOne(id: bigint) {
    try {
      const professionalInfo =
        await this.prisma.professionalInformation.findUnique({
          where: { professionalInformationId: id },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                branch: true,
                passingYear: true,
                section: true,
                email: true,
                githubProfileUrl: true,
                linkedInProfileUrl: true,
              },
            },
          },
        });

      if (!professionalInfo) {
        throw new HttpException(
          { status: 'error', message: 'Professional information not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return { status: 'success', item: professionalInfo };
    } catch (error) {
      handleError(error);
    }
  }

  // Get all professional information for a user
  async findAllByUserId(userId: bigint, page: number) {
    try {
      const professionalInfos =
        await this.prisma.professionalInformation.findMany({
          where: { userId },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                branch: true,
                passingYear: true,
                section: true,
                email: true,
                githubProfileUrl: true,
                linkedInProfileUrl: true,
              },
            },
          },
          take: 10,
          skip: (page - 1) * 10,
        });
      const totalItems = await this.prisma.professionalInformation.count({
        where: { userId },
      });
      return {
        status: 'success',
        items: professionalInfos,
        meta: {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / 10),
          currentPage: page,
          itemsPerPage: 10,
        },
      };
    } catch (error) {
      handleError(error);
    }
  }

  // Get the current company of a user
  async findCurrentCompanyByUserId(userId: bigint) {
    try {
      // First, find the current company where endDate is null
      let currentCompany = await this.prisma.professionalInformation.findFirst({
        where: { userId, endDate: null },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              branch: true,
              passingYear: true,
              section: true,
              email: true,
              githubProfileUrl: true,
              linkedInProfileUrl: true,
            },
          },
        },
      });
      // If no current company is found, find the most recent past company
      if (!currentCompany) {
        currentCompany = await this.prisma.professionalInformation.findFirst({
          where: { userId },
          orderBy: { endDate: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                branch: true,
                passingYear: true,
                section: true,
                email: true,
                githubProfileUrl: true,
                linkedInProfileUrl: true,
              },
            },
          },
        });
      } // If no company is found at all, throw an exception
      if (!currentCompany) {
        throw new HttpException(
          { status: 'error', message: 'Current or past company not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'success', item: currentCompany };
    } catch (error) {
      handleError(error);
    }
  }

  // Update professional information by ID
  async update(id: bigint, dto: UpdateProfessionalInformationDto) {
    try {
      const updatedProfessionalInfo =
        await this.prisma.professionalInformation.update({
          where: { professionalInformationId: id },
          data: dto,
        });

      return {
        status: 'success',
        item: updatedProfessionalInfo,
        message: 'Professional information updated successfully',
      };
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new HttpException(
          { status: 'error', message: 'Professional information not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      handleError(error);
    }
  }

  // Delete professional information by ID
  async remove(id: bigint) {
    try {
      const deletedProfessionalInfo =
        await this.prisma.professionalInformation.delete({
          where: { professionalInformationId: id },
        });

      return {
        status: 'success',
        item: deletedProfessionalInfo,
        message: 'Professional information deleted successfully',
      };
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new HttpException(
          { status: 'error', message: 'Professional information not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      handleError(error);
    }
  }
}
