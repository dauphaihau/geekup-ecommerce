import { CreateCartItemDto } from './create-cart-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
