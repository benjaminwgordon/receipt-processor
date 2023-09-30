# Receipt-Processor

An implementation of a receipt processing API

## Links to relevent code for graders

The important application code and tests are all under the [/src/receipt](/src/receipt/) directory

- [controller](/src/receipt/receipt.controller.ts)
- [service](/src/receipt/receipt.service.ts)
- [DTO](/src/receipt/dto/create-receipt.dto.ts)

## Run Locally

### Option 1: Pull image from Dockerhub and run

```bash
  docker pull benjaminwillardgordon/receipt-server
  docker run -p 8080:8080 benjaminwillardgordon/receipt-server
```

### Option 2: Clone, build, and install locally

Clone the project

```bash
  git clone git@github.com:benjaminwgordon/receipt-processor.git
```

Go to the project directory

```bash
  cd receipt-processor
```

build and run locally

```bash
  docker build -t benjaminwillardgordon/receipt-server .
  docker run -p 8080:8080 benjaminwillardgordon/receipt-server
```

## API Reference

#### Get a receipt by id

```http
  GET /receipts/:id/points
```

| Parameter | Type          | Description                           |
| :-------- | :------------ | :------------------------------------ |
| `id`      | `string/uuid` | **Required**. The receipt id to fetch |

Fetches the score associated with the receipt matching the route parameter

#### Create a new receipt

```http
  POST /receipts/process
```

Creates a new receipt based on request body [see request body schema](/src/receipt/dto/create-receipt.dto.ts).
