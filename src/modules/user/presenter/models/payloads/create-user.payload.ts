import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserPayload {
    @ApiProperty({ example: 'john.doe@email.com' })
    @IsEmail({}, { message: 'Invalid user e-mail' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    @IsDefined({ message: 'User name must be defined' })
    @IsString({ message: 'User name must be a text' })
    @IsNotEmpty({ message: 'User name must not be empty' })
    name: string;

    @ApiProperty({ example: 'J0hn.Doe@123' })
    @IsDefined({ message: 'User password must be defined' })
    @IsString({ message: 'User password must be a text' })
    @IsNotEmpty({ message: 'User password must not be empty' })
    password: string;
}