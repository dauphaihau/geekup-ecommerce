import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { CurrentUser } from '@app/decorators/current-user.decorator';
import { CreateOrderSingleProductDto } from '@modules/api/order/dto/create-order-single-product.dto';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';

@Controller('orders')
@UseGuards(JwtAuthenticationGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('buy-now')
  buyNow(
    @Body() dto: CreateOrderSingleProductDto,
    @CurrentUser() user: FullUserResponseDto,
  ) {
    return this.orderService.createWithSingleProduct(dto, user);
  }

  // @Post()
  // create(
  //   @Body() createOrderDto: CreateOrderDto,
  //   @CurrentUser('user_id') userId: string,
  // ) {
  //   return this.orderService.create(createOrderDto, userId);
  // }

  @Get(':orderId')
  findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser('user_id') userId: string,
  ) {
    return this.orderService.findOne(orderId, userId);
  }

  @Get()
  findAll(@CurrentUser('user_id') userId: string) {
    return this.orderService.findByUserId(userId);
  }
}
