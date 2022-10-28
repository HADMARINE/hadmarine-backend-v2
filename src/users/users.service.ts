import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { DataNotFoundException } from 'src/errors/exceptions/data-not-found.exception';
import { DatabaseExecutionException } from 'src/errors/exceptions/database-execution.exception';
import { DatabaseValidationException } from 'src/errors/exceptions/database-validation.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { password, ...remainings } = createUserDto;
    const createdPassword = this.authService.createPassword(password);
    const createdUser = new this.userModel({
      ...remainings,
      ...createdPassword,
    });
    try {
      await createdUser.save();
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const paths = Object.keys(e.errors);
        throw new DatabaseValidationException({
          database: 'user',
          path: paths.toString(),
        });
      }
      throw new DatabaseExecutionException({
        action: 'create',
        database: 'user',
      });
    }

    return;
  }

  async findOne(userid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ userid }).exec();
    if (!user) throw new DataNotFoundException({ name: 'user' });
    return user;
  }

  async update(userid: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { password, ...rest } = updateUserDto;
    let passwordEncrypted = {};

    if (password) {
      passwordEncrypted = this.authService.createPassword(password);
    }

    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { userid },
          { ...rest, ...passwordEncrypted },
          { upsert: true },
        )
        .exec();
      if (!user) throw new DataNotFoundException({ name: 'user' });
    } catch {
      throw new DatabaseExecutionException({
        action: 'update',
        database: 'user',
      });
    }
  }

  async remove(userid: string): Promise<void> {
    const user = await this.userModel.findOneAndDelete({ userid }).exec();
    if (!user) throw new DataNotFoundException({ name: 'user' });
  }
}
