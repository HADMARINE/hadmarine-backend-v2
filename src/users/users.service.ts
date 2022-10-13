import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...remainings } = createUserDto;
    const createdPassword = this.authService.createPassword(password);
    const createdUser = new this.userModel({
      ...remainings,
      ...createdPassword,
    });
    await createdUser.save();
    return createdUser;
  }

  async findOne(userid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ userid }).exec();
    if (!user) throw 'error'; // TODO : Error
    return user;
  }

  async update(userid: string, updateUserDto: UpdateUserDto) {\
    // TODO : Password!
    const user = await this.userModel
      .findOneAndUpdate({ userid }, { ...updateUserDto }, { upsert: true })
      .exec();
    if (!user) throw 'error'; // TODO : Error
  }

  async remove(userid: string) {
    const user = await this.userModel.findOneAndDelete({ userid }).exec();
    if (!user) throw 'error'; // TODO : Error
  }
}
