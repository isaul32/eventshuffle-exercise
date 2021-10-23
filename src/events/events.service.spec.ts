import { Test, TestingModule } from '@nestjs/testing';
import { Event, Vote } from '@prisma/client';
import { EventsService } from './events.service';
import { PrismaService } from './../prisma.service';
import { InvalidVoteDateException } from './../common/exceptions/invalid-vote-date.exception';

const eventArray: (Event & { votes: Vote[] })[] = [
  {
    id: 1,
    name: `Jake's secret party`,
    people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
    dates: [
      new Date('2014-01-01'),
      new Date('2014-01-05'),
      new Date('2014-01-12'),
    ],
    votes: [
      {
        eventId: 1,
        name: 'John',
        date: new Date('2014-01-01'),
      },
      {
        eventId: 1,
        name: 'Julia',
        date: new Date('2014-01-01'),
      },
      {
        eventId: 1,
        name: 'Paul',
        date: new Date('2014-01-01'),
      },
      {
        eventId: 1,
        name: 'Daisy',
        date: new Date('2014-01-01'),
      },
      {
        eventId: 1,
        name: 'Dick',
        date: new Date('2014-01-01'),
      },
      {
        eventId: 1,
        name: 'Dick',
        date: new Date('2014-01-05'),
      },
    ],
  },
  {
    id: 2,
    name: 'Bowling night',
    people: [],
    dates: [],
    votes: [],
  },
  {
    id: 3,
    name: 'Tabletop gaming',
    people: [],
    dates: [],
    votes: [],
  },
];

const oneEvent = eventArray[0];

const voteArray: Vote[] = [
  {
    date: new Date('2014-01-01'),
    name: 'John',
    eventId: 1,
  },
  {
    date: new Date('2014-01-01'),
    name: 'Julia',
    eventId: 1,
  },
  {
    date: new Date('2014-01-01'),
    name: 'Paul',
    eventId: 1,
  },
  {
    date: new Date('2014-01-01'),
    name: 'Daisy',
    eventId: 1,
  },
  {
    date: new Date('2014-01-01'),
    name: 'Dick',
    eventId: 1,
  },
  {
    date: new Date('2014-01-05'),
    name: 'Dick',
    eventId: 1,
  },
];

const batchPayload = {
  count: 0,
};

const db = {
  $transaction: jest.fn().mockImplementation(async (resolve) => {
    return await resolve({
      event: {
        update: jest.fn().mockResolvedValue({
          ...oneEvent,
          people: [...oneEvent.people, 'Joe'],
        }),
      },
      vote: {
        deleteMany: jest.fn().mockResolvedValue(batchPayload),
        createMany: jest.fn().mockResolvedValue(voteArray),
      },
    });
  }),
  event: {
    findMany: jest.fn().mockResolvedValue(eventArray),
    create: jest.fn().mockResolvedValue(oneEvent),
    findUnique: jest.fn().mockResolvedValue(oneEvent),
  },
  vote: {
    deleteMany: jest.fn().mockResolvedValue(batchPayload),
    createMany: jest.fn().mockResolvedValue(voteArray),
  },
};

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = await service.findAll();
      expect(events).toEqual({
        events: [
          { id: 1, name: `Jake's secret party` },
          { id: 2, name: `Bowling night` },
          { id: 3, name: `Tabletop gaming` },
        ],
      });
    });
  });

  describe('create', () => {
    it('should successfully insert an event', async () => {
      expect(
        await service.create({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        }),
      ).toEqual({
        id: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should get an event', async () => {
      expect(await service.findOne(1)).toEqual({
        id: 1,
        name: "Jake's secret party",
        dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        votes: [
          {
            date: '2014-01-01',
            people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
          },
          {
            date: '2014-01-05',
            people: ['Dick'],
          },
        ],
      });
    });

    it('show an non-existent event', async () => {
      jest.spyOn(prisma.event, 'findUnique').mockImplementationOnce(() => null);
      expect(await service.findOne(1)).toEqual(null);
    });
  });

  describe('vote', () => {
    it('should successfully add a vote to the event', async () => {
      expect(
        await service.vote(1, {
          name: 'Joe',
          votes: ['2014-01-01'],
        }),
      ).toEqual({
        id: 1,
        name: "Jake's secret party",
        dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        votes: [
          {
            date: '2014-01-01',
            people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
          },
          {
            date: '2014-01-05',
            people: ['Dick'],
          },
        ],
      });
    });

    it('should successfully edit a vote to the event', async () => {
      expect(
        await service.vote(1, {
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        }),
      ).toEqual({
        id: 1,
        name: "Jake's secret party",
        dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        votes: [
          {
            date: '2014-01-01',
            people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
          },
          {
            date: '2014-01-05',
            people: ['Dick'],
          },
        ],
      });
    });

    it('add a vote to an non-existent event', async () => {
      jest.spyOn(prisma.event, 'findUnique').mockImplementationOnce(() => null);
      expect(
        await service.vote(1, {
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        }),
      ).toEqual(null);
    });

    it('add a vote to the event without a valid date', async () => {
      expect(async () => {
        await service.vote(1, {
          name: 'Dick',
          votes: ['2014-01-02'],
        });
      }).rejects.toThrow(InvalidVoteDateException);
    });
  });

  describe('findOneResults', () => {
    it('should successfully show the results of an event', async () => {
      expect(await service.findOneResults(1)).toEqual({
        id: 1,
        name: "Jake's secret party",
        suitableDates: [
          {
            date: '2014-01-01',
            people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
          },
        ],
      });
    });

    it('should successfully show the results of an event without any person', async () => {
      jest.spyOn(prisma.event, 'findUnique').mockResolvedValue({
        ...oneEvent,
        people: [],
      });
      expect(await service.findOneResults(1)).toEqual({
        id: 1,
        name: "Jake's secret party",
        suitableDates: [
          {
            date: '2014-01-01',
            people: [],
          },
          {
            date: '2014-01-05',
            people: [],
          },
          {
            date: '2014-01-12',
            people: [],
          },
        ],
      });
    });

    it('show the results of an non-existent event', async () => {
      jest.spyOn(prisma.event, 'findUnique').mockImplementationOnce(() => null);
      expect(await service.findOneResults(1)).toEqual(null);
    });
  });
});
