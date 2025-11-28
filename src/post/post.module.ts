import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { UserModule } from 'src/user/user.module';
import { PostService } from './post.service';
import { PostDomain } from './post.domain';
import { PostController } from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  providers: [PostService, PostDomain],
  controllers: [PostController],
})
export class PostModule {}
