# CPFs para Teste

## CPFs Válidos para Demonstração

Para testar o sistema de login, você pode usar os seguintes CPFs válidos:

### CPFs de Teste:

- `111.444.777-35`
- `123.456.789-09`
- `987.654.321-00`
- `000.000.001-91`

## Como Funciona

1. **Formatação Automática**: O campo CPF aplica automaticamente a máscara `000.000.000-00`
2. **Validação**: O sistema valida se o CPF é matematicamente válido
3. **Login**: Qualquer CPF válido + qualquer senha = login bem-sucedido (modo demo)

## Validação de CPF

O sistema implementa a validação completa do CPF:

- ✅ Verifica formato (xxx.xxx.xxx-xx)
- ✅ Valida algoritmo dos dígitos verificadores
- ✅ Rejeita CPFs com todos os dígitos iguais (111.111.111-11)
- ✅ Aplica máscara automática durante digitação

## Exemplo de Uso

```
CPF: 111.444.777-35
Senha: qualquer_senha
```

Resultado: ✅ Login bem-sucedido
