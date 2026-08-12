# Pendências do UpCorretor

## Domínio e e-mail profissional

- Adquirir o domínio oficial do UpCorretor.
- Criar um endereço profissional, por exemplo `contato@upcorretor.com.br`.
- Configurar SMTP no Supabase usando esse endereço.\n- Ajustar o limite de e-mails em Authentication → Rate Limits após ativar o SMTP próprio.
- Personalizar remetente, assunto e template dos e-mails de confirmação em português.
- Testar novamente cadastro, confirmação de e-mail, login e recuperação de senha.

## Cloudflare e segurança de produção

- Após adquirir o domínio, adicionar o domínio ao Cloudflare.
- Configurar DNS do domínio para o GitHub Pages e validar os registros exigidos.
- Ativar SSL/TLS completo, redirecionamento HTTPS e proxy Cloudflare.
- Configurar regras básicas de segurança, proteção contra bots e cabeçalhos adequados.
- Atualizar as URLs de autenticação e recuperação de senha no Supabase para o domínio próprio.
- Revalidar o site com o antivírus depois da propagação do domínio e do SSL.



- Ativar no Supabase a proteção contra senhas comprometidas em Authentication → Password Security.

