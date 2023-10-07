import {Request, RestBindings} from '@loopback/rest';

import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {compareSync, genSalt, hash} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {EnumToken} from '../enums';
import {authorized} from '../helpers';
import {GetUser, Token, User} from '../models';
import {UserCredentialsRepository, UserRepository} from '../repositories';
import {Credentials, RefreshGrant, Tokens} from '../types';


export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserCredentialsRepository) public userCredentialsRepository: UserCredentialsRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) { }

  @post('/auth/register')
  @response(200)
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['userID', 'userId']
          }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const PN = (user.phoneNumber.toString()).split("", 2);
    if (!(PN.join('') == "09")) {
      throw new HttpErrors[422]('مفادیر صحیح نمیباشند')
    }
    user.username = (user.username)?.toLowerCase();
    const userfinded = await this.userRepository.findOne({where: {username: user.username}})
    if (userfinded) {
      throw new HttpErrors[401]('این کاربر وجود دارد')
    }

    console.log(`/auth/register`);
    user.userId = String(Math.random().toString(16).slice(2))
    const userRes = await this.userRepository.create(user);
    const password = await hash(user.password, await genSalt());

    const userCredential = {
      hashPasswordUser: password,
      userId: userRes.userId
    }
    await this.userCredentialsRepository.create(userCredential);
  }


  @post('/auth/login-get-token')
  @response(200, {
    content: {
      'application/json': {
        schema: getModelSchemaRef(Token),
      },
    },
  })
  async LoginUser(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          }
        },
      },
    }) loginUser: Credentials,
  ): Promise<object> {
    loginUser.username = (loginUser.username)?.toLowerCase()
    const foundUser = await this.userRepository.findOne({where: {username: loginUser.username}});
    if (!foundUser) throw new HttpErrors.Unauthorized('همیچین کاربری وجود ندارد');
    const credentialsFound: any = await this.userCredentialsRepository.findOne({where: {userId: foundUser.userId}});
    if (!credentialsFound) throw new HttpErrors.Unauthorized('Invalid username or password.');
    const passwordMatched = compareSync(loginUser.password, credentialsFound.hashPasswordUser);
    if (!passwordMatched) throw new HttpErrors.Unauthorized('رمز مورد نظر اشتباه میباشد');


    console.log(`/auth/login-get-token`);
    const accessToken = jwt.sign({userID: foundUser.userId}, EnumToken.SecretAccessToken, {
      expiresIn: EnumToken.ET,
    });
    const refreshToken = jwt.sign({userID: foundUser.userId}, EnumToken.SecretRefreshToken, {
      expiresIn: EnumToken.ERT,
    });

    const tokens: Tokens = {
      userId: foundUser.userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAccsessToken: Number(EnumToken.ExpiresToken),
      expiresRefreshToken: Number(EnumToken.ExpiresRefreshToken),
    }

    return tokens
  }

  @post('/auth/refresh-token')
  @response(200, {
    content: {
      'application/json': {
        schema: getModelSchemaRef(Token),
      },
    },
  })
  async RefreshTokenUser(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['userId', 'refreshToken'],
            properties: {
              userId: {
                type: 'string',
              },
              refreshToken: {
                type: 'string',
              },
            },
          }
        },
      },
    }) authRefreshToken: RefreshGrant,
  ): Promise<Tokens> {
    const foundUser = await this.userRepository.findOne({where: {userId: authRefreshToken.userId}});
    if (!foundUser) throw new HttpErrors.Unauthorized('ای دی کاربر مورد نظر صحیح نمیباشد');

    console.log(`/auth/refresh-token`);

    const refreshVerify: any = jwt.verify(authRefreshToken.refreshToken, EnumToken.SecretRefreshToken, function (err, decoded) {
      if (err) {
        throw new HttpErrors.Unauthorized(err.message)
        // throw new HttpErrors.Unauthorized('همچین رفرش توکنی وجود ندارد یا منقضی شده است')
      }
      return decoded
    });
    if (refreshVerify.userID !== foundUser.userId) new HttpErrors.Unauthorized('رفرش توکن برای این کاربر نیست');

    const accessToken = jwt.sign({userID: refreshVerify.userId}, EnumToken.SecretAccessToken, {
      expiresIn: EnumToken.ET,
    });
    const refreshToken = jwt.sign({userID: refreshVerify.userId}, EnumToken.SecretRefreshToken, {
      expiresIn: EnumToken.ERT,
    });

    const tokens: Tokens = {
      userId: foundUser.userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAccsessToken: Number(EnumToken.ExpiresToken),
      expiresRefreshToken: Number(EnumToken.ExpiresRefreshToken),
    }

    return tokens
  }

  @get('/get-users')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GetUser),
        },
      },
    },
  })
  async FindAllUser(): Promise<object[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/get-users`);
    return await this.userRepository.find({fields: {userId: true, label: true}})
  }

}
