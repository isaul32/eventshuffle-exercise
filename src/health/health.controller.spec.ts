import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { HealthController } from './health.controller';

const healthCheckExecutorMock: Partial<HealthCheckExecutor> = {
  execute: jest.fn(),
};

describe('HealthController', () => {
  let controller: HealthController;
  let spyService: HealthCheckService;

  beforeEach(async () => {
    const HealthCheckServiceProvider = {
      provide: HealthCheckService,
      useFactory: () => ({
        check: jest.fn(() => ({ status: 'ok' })),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        HealthCheckServiceProvider,
        {
          provide: HealthCheckExecutor,
          useValue: healthCheckExecutorMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    spyService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call check', () => {
    controller.check();
    expect(spyService.check).toHaveBeenCalled();
  });
});
