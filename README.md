<!-- omit in toc -->
# SYZ Analyzer

Ferramenta CLI para analisar adesão de uma aplicação ao design system SYZ.

- [Uso](#uso)
- [Desenvolvimento, por onde começar](#desenvolvimento-por-onde-começar)
- [Como funciona](#como-funciona)
- [Parâmetros](#parâmetros)
  - [`--app`](#--app)
  - [`--src`](#--src)
  - [`--break-build`](#--break-build)
  - [`--components`](#--components)
  - [Exemplo completo](#exemplo-completo)
- [Variáveis de ambiente](#variáveis-de-ambiente)

## Uso
```bash
# Install
npm i -g @wizsolucoes/syz-analyzer

# Run
syz-analyzer
```

## Desenvolvimento, por onde começar
Primeiramente, seta os [variáveis de ambiente necessários](#variáveis-de-ambiente) para rodar o programa.

```bash
# Install
npm install

# Run tests
npm test

# Run (Exemplo)
# O codígo fonte tem uma pasta chamada 'fake-app' que pode ser usado para testar o funcionamento da ferrmenta.
npm run start --  --app anyname-web --src fake-app/src --break-build --components wiz-privacy,wiz-xpto
```

## Como funciona
A analisador segue os seguintes passos:
1. Busca a lista dos componentes do SYZ,
2. Procura por tags html que correspondem aos componentes SYZ,
3. Publica a quais componentes foram encontrados para um repositório de dados,
4. Opcionalmente, termina seu processo com código de erro se a porcentagem estiver abaixo de um threshold especificado, o que provocaria a quebra do build em um pipeline de CI. 

## Parâmetros
### `--app` 
**(Required)** Nome do repositório da aplicação a ser analisada.

```sh
$ syz-analyzer --app speed-web
```

### `--src`
Caminho para a pasta do código fonte a ser analisado. **Default: "src"**

```sh
$ syz-analyzer --src projects/speed-web/src
```

### `--break-build`
Booleano que determina se o build de CI deve se quebrar quando o `gateway` de adesão ao SYZ não for atingido. **Default: false**

```sh
$ syz-analyzer --break-build
```

### `--components`
String para informar todos os componentes que são obrigatórios para todas as aplicações.
Os componentes devem ser separados por vírgulas e sem espaços. **Default: empty**

```sh
$ syz-analyzer --components component1,component2,component3
```

### Exemplo completo
```sh
$ syz-analyzer --app speed-web --src projects/speed-web/src --break-build --components wiz-privacy
```

## Variáveis de ambiente
Você deve prover a url base para o serviço que vá buscar a lista de componentes esperados, bem como as informações para a conexão com a conta de storage da Azure para publicação dos resultados da análise com os seguintes variáveis de ambiente:

`SYZ_ANALYSIS_STORAGE_KEY` - Chave de accesso.

`SYZ_ANALYSIS_STORAGE_ACCOUNT` - Nome da conta de storage.

`SYZ_ANALYSIS_STORAGE_TABLE` - Nome da tabela da conta de storage.

`GITHUB_PERSONAL_ACCESS_TOKEN` - Token para fazer uso da API do GitHub
