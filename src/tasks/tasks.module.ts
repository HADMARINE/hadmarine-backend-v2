import { Module } from '@nestjs/common';
import { SessionsModule } from 'src/sessions/sessions.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [SessionsModule],
  providers: [TasksService],
})
export class TasksModule {}
