import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { DataNotFoundException } from 'src/errors/exceptions/DataNotFound.exception';
import { DatabaseExecutionException } from 'src/errors/exceptions/DatabaseExecution.exception';
import { DatabaseValidationException } from 'src/errors/exceptions/DatabaseValidation.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
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

    return createdUser;
  }

  async findOne(userid: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ userid }).exec();
    if (!user) throw new DataNotFoundException({ name: 'user' });
    return user;
  }

  async update(userid: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    let passwordEncrypted = {};

    if (password) {
      passwordEncrypted = this.authService.createPassword(password);
    }

    const user = await this.userModel
      .findOneAndUpdate(
        { userid },
        { ...rest, ...passwordEncrypted },
        { upsert: true },
      )
      .exec();
    if (!user) throw new DataNotFoundException({ name: 'user' });
  }

  async remove(userid: string) {
    const user = await this.userModel.findOneAndDelete({ userid }).exec();
    if (!user) throw new DataNotFoundException({ name: 'user' });
  }
}
