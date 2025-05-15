import { UserService } from '@modules/api/user/user.service';
import { UserRepository } from '@modules/api/user/user.repository';

describe('UserService', () => {
  let service: UserService;
  const mockUserRepo: Partial<Record<keyof UserRepository, jest.Mock>> = {
    getFullUserById: jest.fn(),
  };

  beforeEach(() => {
    service = new UserService(mockUserRepo as any);
  });

  it('should call userRepo.getFullUserById', async () => {
    mockUserRepo.getFullUserById.mockResolvedValue({
      user_id: '1',
      username: 'alice',
    });
    const result = await service.getFullUserById('1');
    expect(result).toEqual({ user_id: '1', username: 'alice' });
    expect(mockUserRepo.getFullUserById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user is not found', async () => {
    mockUserRepo.getFullUserById.mockResolvedValue(null);

    await expect(service.getFullUserById('nonexistent-id')).rejects.toThrow(
      'User not found',
    );
  });
});
