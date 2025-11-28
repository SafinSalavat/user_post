import { ApiProperty } from '@nestjs/swagger';

class TokensDto {
  @ApiProperty({
    description: 'Access токен',
    example: 'giueawrggh9aerhgeaohgeohrioewnoi32',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh токен',
    example: 'giueawrggh9aerhgeaohgeohrioewnoi32',
  })
  refreshToken: string;
}

export class TokensResponseDto {
  @ApiProperty({
    description: 'Сообщение об успешной операции',
    example: 'Успешный вход',
  })
  message: string;

  @ApiProperty({ description: 'Объект токенов' })
  data: TokensDto;
}
