// backend/src/auth/dto/login.dto.ts

// Validadores para asegurar que los datos del login sean correctos
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Valida que el valor sea un correo electrónico válido
  @IsEmail({}, { message: 'El correo debe ser válido' })
  email: string;
  // Asegura que la contraseña sea texto y tenga una longitud mínima
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
