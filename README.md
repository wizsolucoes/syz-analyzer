# SYZ Analyzer

Ferramenta CLI para analisar adesão de uma aplicação ao design system SYZ.

## Uso
```bash
# Install
npm i -g @wizsolucoes/syz-analyzer

# Run
syz-analyzer
```

## Como funciona
A analizador segue os seguintes passos:
1. Busca uma lista dos components do SYZ esperados para a aplicação sob análise,
2. Procura por tags html que correspondem aos componentes SYZ,
3. Publica a porcentagem dos components do SYZ esperados que foram encontrados para um repostório de dados,
4. Opcionalmente termina seu processo com código de erro se a porcentagem estiver abaixo de um treshold especificado, o que provocaria a quebra do build em um pipeline de CI. 

## Options
### `--app` 
**(Required)** Nome do respositório da aplicação a ser analisada.

```sh
$ syz-analyzer --app speed-web
```

### `--src`
Caminho para a pasta do código fonte a ser analizado. Default: "src"

```sh
$ syz-analyzer --src projects/speed-web/src
```

### `--gateway`
Porcentagem dos components do SYZ esperados que devem ser encontrados nos arquivos html para evitar a quebra do build. Default: 100

```sh
$ syz-analyzer --gateway 70
```

### `--break-build`
Booleano que determina se o build de CI deve se quebrar quando o `gateway` de adesão ao SYZ não for atingido. Default: false

```sh
$ syz-analyzer --break-build
```

### Exemplo completo
```sh
$ syz-analyzer --app speed-web --src projects/speed-web/src --gateway 70 --break-build
```

## Variáveis de ambiente
Você deve prover a url base para o serviço que vá buscar a lista de componentes esperados, bem como as informações para a conexão com a conta de storage da Azure para publicação dos resultados da análise com os seguintes variáveis de ambiente:

`SYZ_ANALYSIS_STORAGE_KEY` - Chave de accesso.

`SYZ_ANALYSIS_STORAGE_ACCOUNT` - Nome da conta de storage.

`SYZ_ANALYSIS_STORAGE_TABLE` - Nome da tabela da conta de storage.

`SYZ_ANALYSIS_COMPONENT_SERVICE_URL` - URL base para o serviço que vá buscar a lista de componentes esperados.

## OpenAPI Specification do serviço de componentes

### /

#### POST
##### Description

Get list of compomonents by repository name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body | Object with name of repository | Yes | [compomonentsListRequest](#compomonentslistrequest) |

Example value
```json
{
  "repository": "speed-web"
}
```

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ [componentObj](#componentobj) ] |

Example value
```json
[
  {
    "Title": "wiz-alert"
  },
  {
    "Title": "wiz-tabs"
  }
]

```

### Models

#### compomonentsListRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| repository | string |  | No |

Example value
```json
{
  "repository": "speed-web"
}
```

#### componentObj

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Title | string |  | No |

Example value
```json
{
  "Title": "wiz-alert"
}
```
