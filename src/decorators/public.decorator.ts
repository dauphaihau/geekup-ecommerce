// import { IS_PUBLIC } from '@/constants/app.constant';
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC, true);
