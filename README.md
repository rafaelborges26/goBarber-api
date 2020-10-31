# Recuperação de senha

**RF**

--O usuário deve poder recuperar sua senha informando o seu e-mail
--O usuário deve receber um e-mail com instruções de recuperação de senha
--O usuário deve poder resetar sua senha



**RNF**

--Utilizar MailTrap para testar envio em ambiente dev
--Utilizar o Amazon SES para envio em produção
--O envio de email deve acontecer em segundo plano (background job) - para isso criaremos um esquema de fila

**RN**

--O link enviado por e-mail para resetar a senha deve expirar em 2h
--O usuário precisa confirmar a nova senha ao resetar sua senha.

# Atualização do Perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha

**RN**

- O usuário nao pode alterar seu e-mail para um e-mail ja utilizado
- Para atualizar sua senha, o usuário deve informar sua senha antiga
- Para atualizar sua senha, o usuário precisa confirmar a nova senha

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico
- O prestador deve receber uma notificação sempre que houver um novo agendamento
- O prestador deve poder visualizar as notificações não lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no MongoDB
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io

**RN**

- A notificação deve ter um status de lida ou não lida, para que o prestador possa controlar

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados
- O usuário deve poder listar todos os dias de um mês com pelo menos um horário disponível de um prestador -doing
- O usuário deve poder listar horários disponiveis em um dia específico de um prestador
- O usuário deve poder realizar um novo agendamento com um prestador

**RNF**

- A listagem de prestadores devem ser armazenadas em cache

**RN**

- Cada agendamento deve durar 1h exatamente
- Os agendamentos devem estar disponiveis entre 8h e 18h (Primeiro as 08h - ultimo às 17h)
- O usuário não pode agendar em um horário ja ocupado
- O usuário não pode agendar em um horário que já passou
- O usuário não pode agendar serviços consigo mesmo


