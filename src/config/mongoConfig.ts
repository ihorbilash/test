import { User } from 'src/entities/user/entity/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const mongoConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.qfddtc0.mongodb.net/`,
  synchronize: true,
  entities: [User],
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
