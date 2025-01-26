import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ) {
    if (!data.id) {
      return this.prisma.task.create({
        data: data as Prisma.TaskCreateInput,
      });
    }

    const taskExist = await this.prisma.task.findUnique({
      where: {
        id: (data as Prisma.TaskUncheckedUpdateInput).id as number
      },
    });

    if (!taskExist) {
      throw new NotFoundException(`Task with id ${(data as Prisma.TaskUncheckedUpdateInput).id} not found`);
    }

    return this.prisma.task.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.TaskUpdateInput,
    });
  }
}
