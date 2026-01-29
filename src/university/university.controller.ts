import { Controller, Post, Body, Get } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateYearDto } from './dto/create-year.dto';
import { UniversityMapResponse } from './response/university-map.response';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  public async getUniversityMap(): Promise<UniversityMapResponse> {
    return await this.universityService.getUniversityMap();
  }

  @Post('direction')
  public async createDirection(@Body() dto: CreateDirectionDto) {
    return await this.universityService.createDirection(dto);
  }

  @Post('specialty')
  public async createSpecialty(@Body() dto: CreateSpecialtyDto) {
    return this.universityService.createSpecialty(dto);
  }

  @Post('group')
  public async createGroup(@Body() dto: CreateGroupDto) {
    return this.universityService.createGroup(dto);
  }
  @Post('year')
  public async createYear(@Body() dto: CreateYearDto) {
    return this.universityService.createYear(dto);
  }
}
