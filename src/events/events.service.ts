import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { name, dates } = createEventDto;
    const { id } = await this.prismaService.event.create({
      data: {
        name,
        dates: dates.map((value) => new Date(value)),
      },
    });

    return {
      id,
    };
  }

  async findAll() {
    return await this.prismaService.event.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }

  async vote(id: number, createVoteDto: CreateVoteDto) {
    return 'This action adds a new vote';
  }

  async findOneResult(id: number) {
    return `This action returns results of a #${id} event`;
  }
}
