import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { OrderModule } from './modules/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './services/task.service';

config();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      cors: {
        origin: ['http://localhost:8000', 'https://faec-108-29-6-138.ngrok.io'],
        credentials: true,
      },
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      context: async ({ req, res }) => {
        return { req, res };
      },
    }),
    OrderModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}