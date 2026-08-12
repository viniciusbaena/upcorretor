# UpCorretor

Plataforma SaaS para corretores criarem e publicarem sites profissionais de imóveis.

## O que já está funcionando

- Cadastro, confirmação de e-mail, login, logout e recuperação de acesso.
- Painel protegido por autenticação.
- Cadastro de imóveis com até 40 fotos e opção de publicação/rascunho.
- Temas e personalizações persistidos no Supabase.
- Site público por slug: `site.html?slug=seu-site`.
- Leads públicos com proteção básica anti-spam e gestão no painel.
- Storage privado com URLs assinadas para mídia publicada.
- Trial de 15 dias e estrutura de assinatura de R$ 69,99/mês.

## Endereços

- Produção: https://viniciusbaena.github.io/upcorretor/
- Site de corretor: https://viniciusbaena.github.io/upcorretor/site.html?slug=seu-site

## Pendências externas

Ainda falta escolher gateway de pagamento, domínio oficial e provedor SMTP. Esses itens estão documentados em `PENDENCIAS.md`.

## Publicação

O projeto é publicado pelo branch `main` deste repositório no GitHub Pages. O frontend usa uma chave publishable do Supabase; chaves de serviço nunca devem ser colocadas neste repositório.
