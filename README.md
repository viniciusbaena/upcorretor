# Espelho estático — Plataforma de Sites para Corretores

Este é um **snapshot estático** (HTML/CSS/JS já renderizados, sem backend) do site,
gerado a partir da versão real em produção, para fins de demonstração.

## Estrutura

- `/` — landing page da plataforma (marketing, "UpCorretor")
- `/login.html`, `/cadastro.html` — telas do fluxo de entrada (formulários **não funcionam** aqui, sem backend)
- `/termos.html`, `/privacidade.html` — páginas legais da plataforma
- `/demo/` — site de exemplo de um corretor real ("Ana Souza Imóveis"): home, listagem de imóveis,
  páginas individuais de imóvel, sobre, contato
- `/prototipo/` — protótipo navegável standalone (4 telas, tudo em um único HTML)

## Limitações desta versão

Como é um snapshot estático, **não há**: cadastro real, login, envio de leads, geração de
subdomínio, upload de fotos ou cobrança. Para a experiência completa e funcional, acesse:
**https://217-216-95-162.sslip.io**

## Como publicar no GitHub Pages

1. Crie um repositório (ex.: `sitedocorretor`)
2. Faça upload de todo o conteúdo desta pasta para a raiz do repositório
3. Em **Settings → Pages**, defina Source = branch `main`, pasta `/ (root)`
4. Em alguns minutos o site fica em `https://SEU_USUARIO.github.io/sitedocorretor/`

Gerado em 16/07/2026 a partir da versão em produção do VPS.
