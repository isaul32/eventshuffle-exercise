import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { InvalidVoteDateException } from '../common/exceptions/invalid-vote-date.exception';

describe('EventsController', () => {
  let controller: EventsController;
  let spyService: EventsService;

  beforeEach(async () => {
    const EventsServiceProvider = {
      provide: EventsService,
      useFactory: () => ({
        findAll: jest.fn(() => ({
          events: [],
        })),
        create: jest.fn(() => ({ id: 1 })),
        findOne: jest.fn(() => ({ id: 1 })),
        vote: jest.fn(() => ({ id: 1 })),
        findOneResults: jest.fn(() => ({ id: 1 })),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, EventsServiceProvider],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    spyService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should call service methods', () => {
    it('should call the findAll method', async () => {
      controller.findAll();
      expect(spyService.findAll).toHaveBeenCalled();
    });

    it('should call the create method', async () => {
      controller.create(
        {
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        },
        httpMocks.createRequest(),
        httpMocks.createResponse(),
      );
      expect(spyService.create).toHaveBeenCalled();
    });

    it('should call the findOne method', async () => {
      controller.findOne(1);
      expect(spyService.findOne).toHaveBeenCalled();
    });

    it('should call the vote method', async () => {
      controller.vote(1, {
        name: 'Dick',
        votes: ['2014-01-01', '2014-01-05'],
      });
      expect(spyService.vote).toHaveBeenCalled();
    });

    it('should call the results method', async () => {
      controller.findOneResults(1);
      expect(spyService.findOneResults).toHaveBeenCalled();
    });
  });

  describe('Validate endpoint responses', () => {
    it('get an event listing object', async () => {
      expect(await controller.findAll()).toStrictEqual({ events: [] });
    });

    it('create an event listing object', async () => {
      const res = await controller.create(
        {
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/api/v1/event',
        }),
        httpMocks.createResponse(),
      );
      expect(res.getHeader('Location')).toBe('/api/v1/event/1');
      expect(res.statusCode).toBe(200);
    });

    it('get an event', async () => {
      expect(await controller.findOne(1)).toStrictEqual({ id: 1 });
    });

    it('get an non-existent event', async () => {
      jest.spyOn(spyService, 'findOne').mockImplementationOnce(() => null);
      expect(async () => {
        await controller.findOne(1);
      }).rejects.toThrow(NotFoundException);
    });

    it('add a vote to the non-existent event', async () => {
      jest.spyOn(spyService, 'vote').mockImplementationOnce(() => null);
      expect(async () => {
        await controller.vote(1, {
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05'],
        });
      }).rejects.toThrow(NotFoundException);
    });

    it('add a vote to the event without a valid date', async () => {
      expect(async () => {
        jest.spyOn(spyService, 'vote').mockImplementationOnce(() => {
          throw new InvalidVoteDateException();
        });
        await controller.vote(1, {
          name: 'Dick',
          votes: ['2014-01-02'],
        });
      }).rejects.toThrow(BadRequestException);
    });

    it('add a vote to the event and throw error', async () => {
      expect(async () => {
        jest.spyOn(spyService, 'vote').mockImplementationOnce(() => {
          throw new Error();
        });
        await controller.vote(1, {
          name: 'Dick',
          votes: ['2014-01-02'],
        });
      }).rejects.toThrow(Error);
    });

    it('show the results of the non-existent event', async () => {
      expect(async () => {
        jest
          .spyOn(spyService, 'findOneResults')
          .mockImplementationOnce(() => null);
        await controller.findOneResults(1);
      }).rejects.toThrow(NotFoundException);
    });
  });
});
