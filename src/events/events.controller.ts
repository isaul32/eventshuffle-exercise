import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Logger,
  NotFoundException,
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

@ApiTags('event')
@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * This action adds a new event
   */
  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  /**
   * This action returns all events
   */
  @Get('list')
  @ApiOkResponse({
    description: 'A list of all events',
    isArray: true,
    type: GetEventDto,
  })
  async findAll() {
    return await this.eventsService.findAll();
  }

  /**
   * This action returns a event
   */
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Not Found.' })
  @ApiOkResponse({ description: 'Asd' })
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
   * This action returns results of a event
   */
  @Get(':id/results')
  async findOneResult(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.findOneResult(id);
  }
}
