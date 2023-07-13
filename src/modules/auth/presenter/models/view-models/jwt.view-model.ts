import { ApiProperty } from '@nestjs/swagger';

export class JwtViewModel {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.IFTuLGYTIc6MWPllvADKLvuWbsdAqL7FoYCg4HnpzmY',
  })
  accessToken: string;
}
