import { Injectable } from '@nestjs/common';
import { Event, Vote } from '@prisma/client';
import { InvalidVoteDateException } from 'src/common/exceptions/invalid-vote-date.exception';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const events = await this.prismaService.event.findMany();

    return {
      events: events.map((event) => ({
        id: event.id,
        name: event.name,
      })),
    };
  }

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

  async findOne(id: number) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    });

    if (!event) {
      return null;
    }

    return {
      id: event.id,
      name: event.name,
      dates: event.dates.map((value) => value.toISOString().substring(0, 10)),
      votes: this.groupVotesByDates(event),
    };
  }

  async vote(id: number, createVoteDto: CreateVoteDto) {
    const { name, votes } = createVoteDto;

    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      return null;
    }
    votes.map((vote) => {
      if (
        !event.dates
          .map((date) => date.toISOString().substring(0, 10))
          .includes(vote)
      ) {
        throw new InvalidVoteDateException();
      }
    });

    if (!event.people.includes(name)) {
      await this.prismaService.event.update({
        where: {
          id,
        },
        data: {
          people: [...event.people, name],
        },
      });
    }

    await this.prismaService.vote.createMany({
      data: votes
        // Add only valid vote dates. Could also throw bad request.
        .filter((vote) => {
          return event.dates
            .map((date) => date.toISOString().substring(0, 10))
            .includes(vote);
        })
        .map((vote) => ({
          name,
          date: new Date(vote),
          eventId: id,
        })),
      skipDuplicates: true,
    });

    return this.findOne(id);
  }

  async findOneResults(id: number) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    });

    if (!event) {
      return null;
    }

    // All dates are suitable if no one has voted.
    // Besides none dates are suitable if some one voted zero dates.
    return {
      id: event.id,
      name: event.name,
      suitableDates:
        event.people.length === 0
          ? event.dates.map((date) => ({
              date: date.toISOString().substring(0, 10),
              people: [],
            }))
          : this.groupVotesByDates(event).filter(
              (vote) => vote.people.length === event.people.length,
            ),
    };
  }

  private groupVotesByDates(
    event: Event & {
      votes: Vote[];
    },
  ): {
    date: string;
    people: string[];
  }[] {
    const tempVotes = {};
    event.votes.map((vote) => {
      const date = vote.date.toISOString().substring(0, 10);
      if (tempVotes[date]) {
        tempVotes[date].people.push(vote.name);
      } else {
        tempVotes[date] = {
          date,
          people: [vote.name],
        };
      }
    });

    return Object.values(tempVotes);
  }
}
