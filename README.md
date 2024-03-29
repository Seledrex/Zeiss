# Zeiss

Coding assessment for Zeiss.

## Description

Zeiss MachineStream API is used to ingest and expose data received from Zeiss instruments.

## Technology

- Node.js
- Express
- MongoDB
- Mongoose
- WS
- Docker

## Routes

/api/events

- Description: retrieves events and can be filtered by machineId or status
- Query params:
  - machineId
  - status

/api/machines

- Description: retrieves all machines and their latest status

## Instructions

1. docker-compose build
2. docker-compose up

The web server will automatically be port-forwarded to localhost.

- http://localhost
- http://localhost/api/events
- http://localhost/api/machines
