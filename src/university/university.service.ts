import { BadRequestException, Injectable } from '@nestjs/common';
import { Direction } from './entity/direction.entity';
import { DataSource, EntityManager, EntityTarget } from 'typeorm';
import { Specialty } from './entity/specialty.entity';
import { Group } from './entity/group.entity';
import { Year } from './entity/year.entity';
import {
  CreateDirectionDto,
  CreateGroup,
  CreateSpecialty,
} from './dto/create-direction.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateYearDto } from './dto/create-year.dto';
import { IDto } from './model/dto.model';
import {
  DirectionRes,
  GroupRes,
  SpecialtyRes,
  UniversityMapResponse,
  YearRes,
} from './response/university-map.response';

@Injectable()
export class UniversityService {
  constructor(private readonly dataSource: DataSource) {}

  public async createDirection(dto: CreateDirectionDto): Promise<void> {
    if (await this.getEntity(dto, Direction)) {
      const { specialties } = dto;
      await Promise.all(
        specialties.map((specialty) =>
          this.createSpecialty({ ...specialty, direction: dto.name }),
        ),
      );
      return;
    }
    await this.dataSource.transaction(async (manager) => {
      const direction = await this.directionTree(dto, manager);
      await manager.save(direction);
    });
  }

  public async createSpecialty(dto: CreateSpecialtyDto): Promise<void> {
    if (await this.getEntity(dto, Specialty)) {
      const { groups } = dto;
      await Promise.all(
        groups.map((group) =>
          this.createGroup({ ...group, specialty: dto.name }),
        ),
      );
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const direction = await this.findByName<Direction>(
        dto.direction,
        'specialties',
        Direction,
      );

      direction.specialties.push(await this.specialtiesTree(dto, manager));
      await manager.save(direction);
    });
  }

  public async createGroup(dto: CreateGroupDto): Promise<void> {
    if (await this.getEntity(dto, Group)) {
      throw new BadRequestException('group already exist');
    }

    await this.dataSource.transaction(async (manager) => {
      const group = await this.findByName<Specialty>(
        dto.specialty,
        'groups',
        Specialty,
      );
      group.groups.push(await this.groupsTree(dto, manager));
      await manager.save(group);
    });
  }

  public async createYear(dto: CreateYearDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      let year: Year | null = (await this.getEntity(dto, Year)) as Year;

      if (!year) {
        year = manager.create(Year, { name: dto.name });
      }
      const [directions, specialties, groups] = await Promise.all([
        this.getDirectionsByGroupNames(dto.groups),
        this.getSpecialtiesBygGroupNames(dto.groups),
        this.getGroups(dto.groups),
      ]);

      directions.forEach((direction) => {
        direction.years.push(year);
      });
      groups.forEach((group) => {
        group.years.push(year);
      });
      specialties.forEach((specialty) => {
        specialty.years.push(year);
      });

      await Promise.all([
        manager.save(year),
        manager.save(groups),
        manager.save(specialties),
        manager.save(directions),
      ]);
    });
  }

  public async getUniversityMap(): Promise<UniversityMapResponse> {
    const [directions, specialties, group, years] = await Promise.all([
      this.dataSource
        .getRepository(Direction)
        .createQueryBuilder('direction')
        .leftJoin('direction.years', 'year')
        .leftJoin('direction.specialties', 'specialty')
        .select('direction.name', 'name')
        .addSelect('json_agg(distinct specialty.name)', 'specialties')
        .addSelect('json_agg(distinct year.name)', 'years')
        .groupBy('direction.name')
        .getRawMany<DirectionRes>(),
      this.dataSource
        .getRepository(Specialty)
        .createQueryBuilder('specialty')
        .leftJoin('specialty.direction', 'direction')
        .leftJoin('specialty.years', 'year')
        .leftJoin('specialty.groups', 'group')
        .select('specialty.name', 'name')
        .addSelect('direction.name', 'direction')
        .addSelect('json_agg(distinct group.name)', 'groups')
        .addSelect('json_agg(distinct year.name)', 'years')
        .groupBy('specialty.name')
        .groupBy('specialty.name')
        .addGroupBy('direction.name')
        .getRawMany<SpecialtyRes>(),
      this.dataSource
        .getRepository(Group)
        .createQueryBuilder('group')
        .leftJoin('group.specialty', 'specialty')
        .leftJoin('group.years', 'year')
        .select('group.name', 'name')
        .addSelect('specialty.name', 'specialty')
        .addSelect('json_agg(distinct year.name)', 'years')
        .groupBy('group.name')
        .addGroupBy('specialty.name')
        .getRawMany<GroupRes>(),
      this.dataSource
        .getRepository(Year)
        .createQueryBuilder('year')
        .leftJoin('year.directions', 'direction')
        .leftJoin('year.specialties', 'specialty')
        .leftJoin('year.group', 'group')
        .select('year.name', 'name')
        .addSelect('json_agg(distinct direction.name)', 'directions')
        .addSelect('json_agg(distinct specialty.name)', 'specialties')
        .addSelect('json_agg(distinct group.name)', 'groups')
        .groupBy('year.name')
        .getRawMany<YearRes>(),
    ]);

    return {
      directions,
      specialties,
      group,
      years,
    };
  }

  private async directionTree(
    { name, specialties, years }: CreateDirectionDto,
    manager: EntityManager,
  ) {
    return manager.create(Direction, {
      name,
      years: await this.getYears(years),
      specialties: await Promise.all(
        specialties.map((specialty) =>
          this.specialtiesTree(specialty, manager),
        ),
      ),
    });
  }

  private async specialtiesTree(
    { groups, name, years }: CreateSpecialty,
    manager: EntityManager,
  ) {
    return manager.create(Specialty, {
      name,
      years: await this.getYears(years),
      groups: await Promise.all(
        groups.map((group) => this.groupsTree(group, manager)),
      ),
    });
  }

  private async groupsTree(
    { name, years }: CreateGroup,
    manager: EntityManager,
  ) {
    return manager.create(Group, {
      name,
      years: await this.getYears(years),
    });
  }

  private async getYears(names: string[]) {
    return await this.dataSource
      .getRepository(Year)
      .createQueryBuilder('year')
      .where('year.name IN (:...names)', { names })
      .getMany();
  }

  private async getDirectionsByGroupNames(names: string[]) {
    return await this.dataSource
      .getRepository(Direction)
      .createQueryBuilder('direction')
      .leftJoinAndSelect('direction.years', 'year')
      .innerJoin('direction.specialties', 'specialty')
      .innerJoin('specialty.groups', 'group')
      .where('group.name IN (:...names)', { names })
      .getMany();
  }

  private async getSpecialtiesBygGroupNames(names: string[]) {
    return await this.dataSource
      .getRepository(Specialty)
      .createQueryBuilder('specialty')
      .leftJoinAndSelect('specialty.years', 'year')
      .innerJoin('specialty.groups', 'group')
      .where('group.name IN (:...names)', { names })
      .getMany();
  }

  private async getGroups(names: string[]) {
    return await this.dataSource
      .getRepository(Group)
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.years', 'year')
      .where('group.name IN (:...names)', { names })
      .getMany();
  }

  private async findByName<T extends IDto>(
    name: string,
    relationName: string,
    entityModel: EntityTarget<T>,
  ): Promise<T> {
    const entity = await this.dataSource
      .getRepository(entityModel)
      .createQueryBuilder('e')
      .leftJoinAndSelect(`e.${relationName}`, 'd')
      .where('e.name = :name', { name })
      .getOne();

    if (!entity) {
      throw new BadRequestException('entity already not exist');
    }

    return entity;
  }

  private async getEntity<R extends IDto>(
    dto: IDto,
    entityModel: EntityTarget<R>,
  ): Promise<IDto | null> {
    if (!dto) {
      throw new BadRequestException('dto is required');
    }

    return await this.dataSource
      .getRepository(entityModel)
      .createQueryBuilder('e')
      .where('e.name = :name', { name })
      .getOne();
  }
}
