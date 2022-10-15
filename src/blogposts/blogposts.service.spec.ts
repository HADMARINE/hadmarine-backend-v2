import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostsService } from './blogposts.service';

describe('BlogpostsService', () => {
  let service: BlogpostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogpostsService],
    }).compile();

    service = module.get<BlogpostsService>(BlogpostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
