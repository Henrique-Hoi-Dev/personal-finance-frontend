import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
  cpf: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    cpf: string;
    email?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { cpf, password } = body;

    // Basic validation
    if (!cpf || !password) {
      return NextResponse.json(
        { error: 'CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // CPF format validation
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return NextResponse.json(
        { error: 'Formato de CPF inválido' },
        { status: 400 }
      );
    }

    // CPF validation function
    const isValidCPF = (cpf: string): boolean => {
      // Remove dots and dashes
      const numbers = cpf.replace(/\D/g, '');

      // Check if all digits are the same
      if (/^(\d)\1{10}$/.test(numbers)) return false;

      // Validate CPF algorithm
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers[i]) * (10 - i);
      }
      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(numbers[9])) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers[i]) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(numbers[10])) return false;

      return true;
    };

    if (!isValidCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    }

    // Simulate authentication logic
    // In a real application, you would:
    // 1. Hash the password
    // 2. Query the database
    // 3. Compare hashed passwords
    // 4. Generate JWT token
    // 5. Set secure cookies

    // For demo purposes, accept any cpf/password combination
    // In production, replace this with actual authentication logic
    if (cpf && password) {
      // Simulate successful login
      const user = {
        id: '1',
        cpf: cpf,
        name: 'Usuário',
        email: 'usuario@exemplo.com',
      };

      // Generate a mock JWT token (in production, use a proper JWT library)
      const mockToken = Buffer.from(
        JSON.stringify({
          userId: user.id,
          cpf: user.cpf,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      ).toString('base64');

      return NextResponse.json({
        token: mockToken,
        user,
      });
    } else {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
