import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { GetStudentsParams } from './params/get-students.params';
import { StudentService } from './student.service';
import { Student } from './entity/student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  public async createStudent(@Body() body: CreateStudentDto): Promise<Student> {
    return await this.studentService.createStudent(body);
  }

  @Put()
  public async updateStudent(@Body() body: UpdateStudentDto): Promise<Student> {
    return await this.studentService.updateStudent(body);
  }

  @Delete(':id')
  public async deleteStudent(@Param('id') id: string): Promise<void> {
    await this.studentService.deleteStudent(id);
  }

  @Get(':id')
  public async getStudent(@Param('id') id: string): Promise<Student> {
    return await this.studentService.getStudent(id);
  }

  @Get()
  public async getStudents(
    @Query() query: GetStudentsParams,
  ): Promise<[Student[], number]> {
    return await this.studentService.getStudents(query);
  }
}
