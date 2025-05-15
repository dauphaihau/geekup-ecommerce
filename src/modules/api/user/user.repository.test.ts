import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { UserEntity } from './user.entity';

describe('The CategoryRepository class', () => {
  let executeQuerySingleMock: jest.Mock;
  let createUserData: CreateUserDto;
  let userRepository: UserRepository;

  beforeEach(async () => {
    executeQuerySingleMock = jest.fn();

    createUserData = {
      username: 'john',
      first_name: 'John',
      last_name: 'Smith',
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DatabaseService,
          useValue: {
            executeQuerySingle: executeQuerySingleMock,
          },
        },
      ],
    }).compile();

    userRepository = await moduleRef.get(UserRepository);
  });

  describe('when the create method is called', () => {
    describe('and the database returns valid data', () => {
      let userEntityData: UserEntity;

      beforeEach(() => {
        userEntityData = {
          user_id: '1',
          username: 'john',
          first_name: 'John',
          last_name: 'Smith',
          updated_at: new Date(),
          created_at: new Date(),
        };

        executeQuerySingleMock.mockResolvedValue(userEntityData);
      });

      // it('should return an instance of the UserEntity', async () => {
      //   const result = await userRepository.create(createUserData);
      //
      //   expect(result instanceof UserEntity).toBe(true);
      // });

      it('should return the UserEntity with correct properties', async () => {
        const result = await userRepository.create(createUserData);

        expect(result.user_id).toBe(userEntityData.user_id);
        expect(result.username).toBe(userEntityData.username);
        expect(result.first_name).toBe(userEntityData.first_name);
        expect(result.last_name).toBe(userEntityData.last_name);
        expect(result.created_at).toBe(userEntityData.created_at);
        expect(result.updated_at).toBe(userEntityData.updated_at);
      });
    });
  });
});
