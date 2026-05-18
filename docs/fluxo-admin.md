# Fluxo de criacao de colecao e obra (Admin)

## 1) Acesso
- Abra: https://project-d4jg4.vercel.app/auth
- Entre com email e senha do Supabase Auth.
- Ao entrar, voce sera redirecionado para /admin.
- Se aparecer "Acesso negado", o usuario nao tem permissao de admin.

## 2) Criar colecao
- Menu lateral: clique em "Colecoes".
- Clique em "Nova colecao".
- Preencha os campos: nome, slug, tagline e descricao.
- Clique em salvar. O sistema volta para /admin/colecoes.

## 3) Criar obra
- Menu lateral: clique em "Obras".
- Clique em "Nova obra".
- Preencha: titulo, ano, tecnica, dimensoes, descricao e colecao.
- Imagem:
  - Pode colar uma URL em "image_url", ou
  - Enviar um arquivo: o upload vai para o bucket "daniela" em storage/artworks e gera uma URL publica.
- Clique em salvar. O sistema volta para /admin/obras.

## 4) Editar ou remover
- Na lista de obras/colecoes, use "Editar" para abrir o formulario com os dados.
- Use "Remover" para excluir.
- Para trocar imagem, envie novo arquivo ou edite a URL.

## Observacoes tecnicas
- Tabelas usadas: collections e artworks (schema public).
- Storage bucket: daniela.
- Para gravar, o usuario precisa estar autenticado e ter permissao de admin (RLS).
