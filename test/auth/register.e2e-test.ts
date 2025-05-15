import request from 'supertest';
import { app } from '../setup.e2e';
import { DATABASE_CONNECTION } from '@modules/database/database.provider';
import { HttpStatus } from '@nestjs/common';
import { UserRepository } from '@modules/api/user/user.repository';
import { AuthRepository } from '@modules/api/auth/auth.repository';

const registerDto = {
  email: 'myemail@gmail.com',
  username: 'myusername',
  password: 'Passw0rd!',
  first_name: 'my',
  last_name: 'My',
};

describe('AuthController (e2e)', () => {
  // let userRepo: CategoryRepository;

  beforeEach(async () => {
    const db = app.get(DATABASE_CONNECTION); // adjust token name as needed
    await db.none('DELETE FROM "users"');
  });

  describe('[e2e] POST /auth/register', () => {
    it('Should respond 201 created for a valid email and password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.user).toHaveProperty('user_id');
      expect(response.body.user.email).toEqual(registerDto.email);
      expect(response.body.user).not.toHaveProperty('password_hash');
      expect(response.body.user).toHaveProperty('created_at');

      // Verify user exists in database
      const userRepo = app.get(UserRepository);
      const authRepo = app.get(AuthRepository);
      const user = await userRepo.findOne('username = $1', [
        registerDto.username,
      ]);
      const auth = await authRepo.findOne('email = $1', [registerDto.email]);
      expect(user).toBeDefined();
      expect(auth).toBeDefined();
      expect(auth.email).toEqual(registerDto.email);
      expect(user.username).toEqual(registerDto.username);
    });

    it('should fail to register with duplicate username', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      // Attempt second registration with same username
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toContain('username');
    });

    it('should fail to register with duplicate email ( transactional )', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      // Attempt second registration with same email
      const differentUsername = 'different_username';
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...registerDto,
          username: differentUsername,
        })
        .expect(HttpStatus.CONFLICT);

      // Verify user record does not exist
      const userRepo = app.get(UserRepository);
      const user = await userRepo.findOne('username = $1', [differentUsername]);

      expect(user).toBeNull();
      expect(response.body.message).toContain('email');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...registerDto,
          email: 'invalid-email',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('email');
    });

    it('should fail with weak password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...registerDto,
          password: 'weak',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('password');
    });

    it('should fail with missing required fields', async () => {
      delete registerDto.password;

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('password');
    });
  });
});
