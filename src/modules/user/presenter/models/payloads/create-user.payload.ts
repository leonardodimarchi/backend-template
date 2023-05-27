import { ApiProperty } from "@nestjs/swagger";

export class CreateUserPayload {
    @ApiProperty({ example: 'john.doe@email.com' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'J0hn.Doe@123' })
    password: string;
}