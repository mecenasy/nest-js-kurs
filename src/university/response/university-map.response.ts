import { Exclude } from 'class-transformer';

export class UniversityMapResponse {
  constructor(private readonly partial?: Partial<UniversityMapResponse>) {
    Object.assign(this, partial);
  }

  @Exclude()
  directions: DirectionRes[];

  @Exclude()
  specialties: SpecialtyRes[];

  @Exclude()
  group: GroupRes[];

  @Exclude()
  years: YearRes[];
}

export class DirectionRes {
  constructor(private readonly partial?: Partial<DirectionRes>) {
    Object.assign(this, partial);
  }

  @Exclude()
  name: string;

  @Exclude()
  specialties: string[];

  @Exclude()
  years: string[];
}

export class SpecialtyRes {
  constructor(private readonly partial?: Partial<SpecialtyRes>) {
    Object.assign(this, partial);
  }

  @Exclude()
  name: string;

  @Exclude()
  direction: string;

  @Exclude()
  groups: string[];

  @Exclude()
  years: string[];
}

export class GroupRes {
  constructor(private readonly partial?: Partial<GroupRes>) {
    Object.assign(this, partial);
  }

  @Exclude()
  name: string;

  @Exclude()
  specialty: string;

  @Exclude()
  years: string[];
}

export class YearRes {
  constructor(private readonly partial?: Partial<YearRes>) {
    Object.assign(this, partial);
  }

  @Exclude()
  name: string;

  @Exclude()
  directions: string[];

  @Exclude()
  specialties: string[];

  @Exclude()
  groups: string[];
}
