# Inzira Navix Transit — API

The proposal lists a backend (Node.js/Express) and **real-time APIs**. In this
Next.js app these are implemented as native **Next.js Route Handlers** under
`app/api/**`. They are the server-side source of truth, serving the shared
Kigali dataset from `src/lib/transit.server.ts`.

All responses are JSON. Every list endpoint wraps items in a `data` key, and
most include a `count`. Endpoint failures return an appropriate HTTP status
(`404`, `500`) with an `{ "error": "code" }` body.

## Endpoints

| Method | Path                                          | Description                                   |
| ------ | --------------------------------------------- | --------------------------------------------- |
| GET    | `/api/routes`                                 | List all bus routes                           |
| GET    | `/api/routes/:routeId`                        | Single route by id (`r1`, `r2`, …)            |
| GET    | `/api/stations`                               | List all stations                             |
| GET    | `/api/stations/:stationId`                    | Station by id + live arrivals (ETAs)         |
| GET    | `/api/updates`                                | Transport updates, newest first              |
| GET    | `/api/fleet`                                  | Fleet units + status counts                   |
| GET    | `/api/predictions`                            | Hourly congestion forecasts + network status  |
| GET    | `/api/notifications`                          | Notification feed, newest first              |
| GET    | `/api/tickets`                                | Digital ticket product catalog               |
| GET    | `/api/analytics`                              | KPIs, ridership, operator & route performance |
| GET    | `/api/network/status`                         | Live network status (congestion, fleet, on-time) |

## Example

```bash
curl http://localhost:3000/api/routes/r1
curl http://localhost:3000/api/stations/nyabugogo
curl http://localhost:3000/api/network/status
```

> Production note: the shared dataset in `src/data/kigali.ts` is a mock GTFS
> approximation. Swap `src/lib/transit.server.ts` internals for a PostgreSQL /
> MongoDB query or a live GTFS/API feed to serve real data. Handlers
> intentionally import nothing from a client bundle (`.server.ts`).

