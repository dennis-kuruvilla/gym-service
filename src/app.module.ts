import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSource } from './common/datasource';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), MembershipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
