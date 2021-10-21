import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  NotFoundException,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { InvalidVoteDateException } from './../common/exceptions/invalid-vote-date.exception';

@ApiTags('event')
@Controller({
  path: 'event',
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * This action returns all events
   */
  @Get('list')
  @ApiOkResponse({
    description: 'Successful operation',
    isArray: true,
  })
  async findAll() {
    return await this.eventsService.findAll();
  }

  /**
   * This action adds a new event
   */
  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const event = await this.eventsService.create(createEventDto);
    res.header('Location', `${req.url}/${event.id}`);
    res.send(event);
    return res;
  }

  /**
   * This action returns an event
   */
  @Get(':id')
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  /**
   * This action adds a new vote
   */
  @Post(':id/vote')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  async vote(
    @Param('id', ParseIntPipe) id: number,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    let event;
    try {
      event = await this.eventsService.vote(id, createVoteDto);
    } catch (err) {
      if (err instanceof InvalidVoteDateException) {
        throw new BadRequestException('Invalid vote date');
      } else {
        throw err;
      }
    }

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  /**
   * This action returns results of an event
   */
  @Get(':id/results')
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  async findOneResults(@Param('id', ParseIntPipe) id: number) {
    const results = await this.eventsService.findOneResults(id);
    if (!results) {
      throw new NotFoundException();
    }

    return results;
  }
}
