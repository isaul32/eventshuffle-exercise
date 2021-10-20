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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetEventDto } from './dto/get-event.dto';
import { Request, Response } from 'express';

@ApiTags('event')
@Controller({
  path: 'event',
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
   * This action returns all events
   */
  @Get('list')
  @ApiOkResponse({
    description: 'Successful operation',
    isArray: true,
    type: GetEventDto,
  })
  async findAll() {
    return await this.eventsService.findAll();
  }

  /**
   * This action returns an event
   */
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiOkResponse({ description: 'Successful operation', type: GetEventDto })
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
  async vote(
    @Param('id', ParseIntPipe) id: number,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    return await this.eventsService.vote(id, createVoteDto);
  }

  /**
   * This action returns results of an event
   */
  @Get(':id/results')
  async findOneResult(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.findOneResult(id);
  }
}
