import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from './../src/prisma.service';
import { EventsModule } from './../src/events/events.module';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.vote.deleteMany();
    await prisma.event.deleteMany();

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api', {
      exclude: [
        { path: '', method: RequestMethod.GET }, // Exclude root redirect
      ],
    });
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  beforeEach(async () => {
    await prisma.vote.deleteMany();
    await prisma.event.deleteMany();
  });

  afterAll(async () => {
    await prisma.vote.deleteMany();
    await prisma.event.deleteMany();
    await app.close();
  });

  describe('GET /api/v1/event/list', () => {
    it('return an event listing object', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/event/list')
        .expect(200)
        .expect({
          events: [],
        });
    });

    it('return an event listing object', async () => {
      const event1 = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      const event2 = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: 'Bowling night',
          dates: ['2014-01-01'],
        });

      const event3 = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: 'Tabletop gaming',
          dates: ['2014-01-01'],
        });

      return request(app.getHttpServer())
        .get('/api/v1/event/list')
        .expect(200)
        .expect({
          events: [
            {
              id: event1.body.id,
              name: `Jake's secret party`,
            },
            {
              id: event2.body.id,
              name: 'Bowling night',
            },
            {
              id: event3.body.id,
              name: 'Tabletop gaming',
            },
          ],
        });
    });
  });

  describe('POST /api/v1/event', () => {
    it('create an event', async () => {
      const { status, headers, body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      expect(status).toBe(201);
      expect(headers['location']).toBe(`/api/v1/event/${body.id}`);
      expect(body).toStrictEqual({
        id: body.id,
      });
    });

    it('create an event without a name', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      expect(status).toBe(400);
    });

    it('create an event without a any date', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: [],
        });

      expect(status).toBe(400);
    });

    it('create an event without dates', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
        });

      expect(status).toBe(400);
    });
  });

  describe('GET /api/v1/event/{id}', () => {
    it('show an event', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'John',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Julia',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Paul',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Daisy',
          votes: ['2014-01-01'],
        });

      return request(app.getHttpServer())
        .get(`/api/v1/event/${body.id}`)
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
          votes: [
            {
              date: '2014-01-01',
              people: ['John', 'Julia', 'Paul', 'Daisy'],
            },
          ],
        });
    });

    it('show an non exist event', async () => {
      return request(app.getHttpServer()).get(`/api/v1/event/1`).expect(404);
    });
  });

  describe('POST /api/v1/event/{id}/vote', () => {
    it('add votes to an event', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'John',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Julia',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Paul',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Daisy',
          votes: ['2014-01-01'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        })
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
          votes: [
            {
              date: '2014-01-01',
              people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
            },
            { date: '2014-01-05', people: ['Dick'] },
            { date: '2014-01-12', people: ['Dick'] },
          ],
        });
    });

    it('edit votes to an event', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-01'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        })
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
          votes: [
            {
              date: '2014-01-01',
              people: ['Dick'],
            },
            { date: '2014-01-05', people: ['Dick'] },
            { date: '2014-01-12', people: ['Dick'] },
          ],
        });
    });

    it('add votes to an non exist event', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/event/1/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        })
        .expect(404);
    });

    it('add votes to an event without a name', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          votes: ['2014-01-01', '2014-01-05', '2014-01-12'],
        })
        .expect(400);
    });

    it('add votes to an event without date votes', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
        })
        .expect(400);
    });

    it('add votes to an event without a any date', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: [],
        })
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
          votes: [],
        });
    });

    it('add votes to an event without a valid date', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-02'],
        })
        .expect(400);
    });

    it('add votes to an event without a any date', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: [],
        })
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
          votes: [],
        });
    });
  });

  describe('GET /api/v1/event/{id}/results', () => {
    it('show the results of an event', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'John',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Julia',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Paul',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Daisy',
          votes: ['2014-01-01'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: ['2014-01-01', '2014-01-05'],
        });

      return request(app.getHttpServer())
        .get(`/api/v1/event/${body.id}/results`)
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          suitableDates: [
            {
              date: '2014-01-01',
              people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
            },
          ],
        });
    });

    it('show the results of an event without a any person', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      return request(app.getHttpServer())
        .get(`/api/v1/event/${body.id}/results`)
        .expect(200)
        .expect({
          id: body.id,
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

    it('show the results of an event without a any valid date vote', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/event')
        .send({
          name: `Jake's secret party`,
          dates: ['2014-01-01', '2014-01-05', '2014-01-12'],
        });

      await request(app.getHttpServer())
        .post(`/api/v1/event/${body.id}/vote`)
        .send({
          name: 'Dick',
          votes: [],
        });

      return request(app.getHttpServer())
        .get(`/api/v1/event/${body.id}/results`)
        .expect(200)
        .expect({
          id: body.id,
          name: "Jake's secret party",
          suitableDates: [],
        });
    });

    it('show the results of an non exist event', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/event/1/results`)
        .expect(404);
    });
  });
});
