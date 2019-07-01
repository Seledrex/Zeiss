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
