import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from 'src/Repositories/TaskRepository';

@Injectable()
export default class SaveTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    // todo-done IMPLEMENT HERE : VALIDATION DTO, DATA SAVING, ERROR CATCHING
    try {
      const data = {
        id: dto.id || undefined,
        name: dto.name.trim(),
      };
      return this.taskRepository.save(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
