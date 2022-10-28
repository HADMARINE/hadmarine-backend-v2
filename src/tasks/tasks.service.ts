import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class TasksService {
  constructor(private sessionService: SessionsService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('*/10 * * * *')
  async handleSessionDeletion() {
    try {
      const count = await this.sessionService.removeExpired();
      this.logger.debug(`Session deletion success. Count : ${count}`);
    } catch {
      this.logger.debug('Session deletion failed');
    }
  }
}
