# Problem 6: Live Scoreboard Module Specification

## Overview

This document specifies a backend module for a real-time scoreboard system that displays the top 10 user scores with live updates and protection against malicious score manipulation.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Flow Diagram](#flow-diagram)
3. [API Specification](#api-specification)
4. [Database Schema](#database-schema)
5. [Security Measures](#security-measures)
6. [Real-time Updates](#real-time-updates)
7. [Implementation Guidelines](#implementation-guidelines)
8. [Improvements & Recommendations](#improvements--recommendations)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│   │   Web App    │         │  Mobile App  │         │  Other Client │        │
│   └──────┬───────┘         └──────┬───────┘         └──────┬───────┘        │
│          │                        │                        │                 │
│          └────────────────────────┼────────────────────────┘                 │
│                                   │                                          │
│                          ┌────────▼────────┐                                 │
│                          │  WebSocket/SSE  │ (Live Updates)                  │
│                          └────────┬────────┘                                 │
│                                   │                                          │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼──────────────────────────────────────────┐
│                              API GATEWAY                                     │
├───────────────────────────────────┼──────────────────────────────────────────┤
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────┐          │
│   │                      Load Balancer                             │          │
│   └───────────────────────────────┬───────────────────────────────┘          │
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────┐          │
│   │                 Rate Limiter / DDoS Protection                 │          │
│   └───────────────────────────────┬───────────────────────────────┘          │
│                                   │                                          │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼──────────────────────────────────────────┐
│                          APPLICATION SERVER                                  │
├───────────────────────────────────┼──────────────────────────────────────────┤
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────┐          │
│   │                    Authentication Middleware                   │          │
│   │                    (JWT Token Validation)                      │          │
│   └───────────────────────────────┬───────────────────────────────┘          │
│                                   │                                          │
│   ┌───────────────┬───────────────┴───────────────┬───────────────┐          │
│   │               │                               │               │          │
│   ▼               ▼                               ▼               ▼          │
│ ┌─────────┐  ┌──────────┐                  ┌──────────┐   ┌─────────────┐    │
│ │ Score   │  │ Action   │                  │Leaderboard│   │ WebSocket   │    │
│ │ Service │  │ Validator│                  │ Service  │   │ Manager     │    │
│ └────┬────┘  └────┬─────┘                  └────┬─────┘   └──────┬──────┘    │
│      │            │                             │                │           │
│      └────────────┴─────────────┬───────────────┴────────────────┘           │
│                                 │                                            │
└─────────────────────────────────┼────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼────────────────────────────────────────────┐
│                            DATA LAYER                                        │
├─────────────────────────────────┼────────────────────────────────────────────┤
│                                 │                                            │
│   ┌─────────────────────────────▼─────────────────────────────────┐          │
│   │                                                                │          │
│   │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │          │
│   │    │   Database   │    │    Redis     │    │  Message     │   │          │
│   │    │  (PostgreSQL)│    │   (Cache)    │    │  Queue       │   │          │
│   │    └──────────────┘    └──────────────┘    └──────────────┘   │          │
│   │                                                                │          │
│   └────────────────────────────────────────────────────────────────┘          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Flow Diagram

### Score Update Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Client  │     │  API Server │     │   Services   │     │  Database   │
└────┬─────┘     └──────┬──────┘     └──────┬───────┘     └──────┬──────┘
     │                  │                   │                    │
     │  1. Complete     │                   │                    │
     │     Action       │                   │                    │
     │ ─────────────────>                   │                    │
     │                  │                   │                    │
     │  2. POST /api/scores/update          │                    │
     │     {action_id, token, signature}    │                    │
     │ ─────────────────>                   │                    │
     │                  │                   │                    │
     │                  │  3. Validate JWT  │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │                  │  4. Verify Action │                    │
     │                  │     Signature     │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │                  │  5. Check Rate    │                    │
     │                  │     Limit         │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │                  │  6. Update Score  │                    │
     │                  │ ─────────────────>│ ─────────────────> │
     │                  │                   │                    │
     │                  │  7. Invalidate    │                    │
     │                  │     Cache         │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │                  │  8. Broadcast to  │                    │
     │                  │     WebSocket     │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │  9. Success Response                 │                    │
     │ <─────────────────                   │                    │
     │                  │                   │                    │
     │  10. Real-time   │                   │                    │
     │      Update (WS) │                   │                    │
     │ <═══════════════════════════════════════════════════════  │
     │                  │                   │                    │
```

### Leaderboard Fetch Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Client  │     │  API Server │     │    Redis     │     │  Database   │
└────┬─────┘     └──────┬──────┘     └──────┬───────┘     └──────┬──────┘
     │                  │                   │                    │
     │  GET /api/leaderboard                │                    │
     │ ─────────────────>                   │                    │
     │                  │                   │                    │
     │                  │  Check Cache      │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │                  │ [Cache HIT]       │                    │
     │ <─────────────────────────────────────                    │
     │                  │                   │                    │
     │                  │ [Cache MISS]      │                    │
     │                  │ ─────────────────────────────────────> │
     │                  │                   │                    │
     │                  │  Store in Cache   │                    │
     │                  │ ─────────────────>│                    │
     │                  │                   │                    │
     │  Return Top 10   │                   │                    │
     │ <─────────────────                   │                    │
```

---

## API Specification

### Base URL
```
https://api.example.com/v1
```

### Authentication
All endpoints (except public leaderboard) require JWT Bearer token:
```
Authorization: Bearer <jwt_token>
```

---

### Endpoints

#### 1. Get Leaderboard (Public)

```http
GET /api/leaderboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_abc123",
        "username": "player1",
        "score": 15000,
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      // ... top 10 users
    ],
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 2. Update Score (Protected)

```http
POST /api/scores/update
```

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Action-Signature: <hmac_signature>
X-Request-Id: <unique_request_id>
```

**Request Body:**
```json
{
  "actionId": "action_xyz789",
  "actionType": "COMPLETE_TASK",
  "timestamp": 1705312200000,
  "payload": {
    "taskId": "task_123",
    "difficulty": "medium"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "previousScore": 14500,
    "newScore": 15000,
    "pointsAwarded": 500,
    "currentRank": 1
  }
}
```

**Response (Error - Rate Limited):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

#### 3. Get User Score (Protected)

```http
GET /api/scores/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "username": "player1",
    "score": 15000,
    "rank": 1,
    "actions": {
      "today": 5,
      "total": 150
    }
  }
}
```

---

#### 4. WebSocket Connection

```
WSS /ws/leaderboard
```

**Connection:**
```javascript
const ws = new WebSocket('wss://api.example.com/v1/ws/leaderboard');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle leaderboard update
};
```

**Message Types:**

*Leaderboard Update:*
```json
{
  "type": "LEADERBOARD_UPDATE",
  "data": {
    "leaderboard": [...],
    "changedPositions": [1, 2, 3]
  }
}
```

*Score Change Notification:*
```json
{
  "type": "SCORE_CHANGE",
  "data": {
    "userId": "user_abc123",
    "username": "player1",
    "oldRank": 2,
    "newRank": 1,
    "score": 15000
  }
}
```

---

## Database Schema

### Tables

```sql
-- Users table (reference)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scores table
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Action log table (for audit and validation)
CREATE TABLE action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_id VARCHAR(100) UNIQUE NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    points_awarded INTEGER NOT NULL,
    signature VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_scores_score_desc ON scores(score DESC);
CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_action_logs_user_id ON action_logs(user_id);
CREATE INDEX idx_action_logs_action_id ON action_logs(action_id);
CREATE INDEX idx_action_logs_created_at ON action_logs(created_at);
```

---

## Security Measures

### 1. Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Request ──► JWT Validation ──► Action Signature ──►        │
│                                                              │
│              ──► Rate Limiting ──► IP Validation ──►         │
│                                                              │
│              ──► Action Uniqueness ──► Process               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Action Signature (HMAC)

Each score update request must include a cryptographic signature:

```javascript
// Client-side signature generation
const signature = HMAC_SHA256(
  `${actionId}:${userId}:${timestamp}:${actionType}`,
  CLIENT_SECRET
);
```

**Server Validation:**
```javascript
// Server-side validation
function validateActionSignature(req) {
  const { actionId, timestamp, actionType } = req.body;
  const userId = req.user.id;
  
  // Check timestamp freshness (5 minute window)
  if (Date.now() - timestamp > 5 * 60 * 1000) {
    throw new Error('Request expired');
  }
  
  // Verify signature
  const expectedSignature = HMAC_SHA256(
    `${actionId}:${userId}:${timestamp}:${actionType}`,
    SERVER_SECRET
  );
  
  if (req.headers['x-action-signature'] !== expectedSignature) {
    throw new Error('Invalid signature');
  }
}
```

### 3. Rate Limiting Rules

| Rule | Limit | Window | Action |
|------|-------|--------|--------|
| Global | 1000 req | 1 min | Block IP |
| Per User | 100 req | 1 min | Block user |
| Score Updates | 10 req | 1 min | Reject |
| Same Action | 1 req | 24 hours | Reject duplicate |

### 4. Anti-Cheat Measures

| Measure | Description |
|---------|-------------|
| Action ID Uniqueness | Each action can only be claimed once |
| Timestamp Validation | Requests expire after 5 minutes |
| Server-side Scoring | Points calculated on server, not client |
| Audit Logging | All actions logged for review |
| Anomaly Detection | Flag unusual score patterns |
| IP Tracking | Monitor for suspicious IP patterns |

---

## Real-time Updates

### WebSocket Implementation

```javascript
// Server-side broadcasting
class LeaderboardBroadcaster {
  private connections: Map<string, WebSocket> = new Map();
  
  broadcast(event: LeaderboardEvent) {
    const message = JSON.stringify(event);
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
  
  onScoreUpdate(userId: string, newScore: number) {
    // Check if leaderboard changed
    const newLeaderboard = getTop10();
    if (leaderboardChanged(newLeaderboard)) {
      this.broadcast({
        type: 'LEADERBOARD_UPDATE',
        data: { leaderboard: newLeaderboard }
      });
    }
  }
}
```

### Alternative: Server-Sent Events (SSE)

```http
GET /api/leaderboard/stream
Accept: text/event-stream
```

```
event: leaderboard_update
data: {"leaderboard": [...], "timestamp": "2024-01-15T10:30:00Z"}

event: score_change
data: {"userId": "user_abc123", "newRank": 1, "score": 15000}
```

---

## Implementation Guidelines

### Technology Recommendations

| Component | Recommended Technology |
|-----------|----------------------|
| Runtime | Node.js / Go / Rust |
| Framework | Express / Fastify / Hono |
| Database | PostgreSQL |
| Cache | Redis |
| Real-time | WebSocket (ws) / Socket.io |
| Message Queue | Redis Pub/Sub / RabbitMQ |
| Rate Limiting | Redis + sliding window |

### Caching Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  Cache Invalidation                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   Score Update ──► Check if Top 10 affected              │
│                           │                              │
│                    ┌──────┴──────┐                       │
│                    │             │                       │
│                   YES           NO                       │
│                    │             │                       │
│                    ▼             ▼                       │
│             Invalidate      Keep Cache                   │
│               Cache                                      │
│                    │                                     │
│                    ▼                                     │
│             Broadcast                                    │
│              Update                                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Cache Keys:**
```
leaderboard:top10          # Top 10 scores (TTL: 30s)
user:score:{userId}        # Individual user score (TTL: 5min)
rate_limit:user:{userId}   # Rate limit counter (TTL: 1min)
action:processed:{actionId} # Processed action marker (TTL: 24h)
```

---

## Improvements & Recommendations

### 1. Scalability Improvements

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Horizontal Scaling** | Use Redis Cluster for distributed caching and rate limiting | High |
| **Database Sharding** | Partition action_logs table by date for better query performance | Medium |
| **Read Replicas** | Use database read replicas for leaderboard queries | High |
| **CDN** | Cache leaderboard responses at CDN edge | Medium |

### 2. Security Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| **Device Fingerprinting** | Track device signatures to detect multi-accounting | High |
| **Behavioral Analysis** | ML-based anomaly detection for unusual patterns | Medium |
| **CAPTCHA** | Add CAPTCHA for suspicious activity | Medium |
| **Webhook Verification** | If actions come from external services, verify webhooks | High |

### 3. Performance Optimizations

| Optimization | Description | Impact |
|--------------|-------------|--------|
| **Sorted Sets** | Use Redis ZSET for real-time leaderboard | High |
| **Batch Updates** | Aggregate score updates in short windows | Medium |
| **Connection Pooling** | Database connection pooling | High |
| **Compression** | Gzip WebSocket messages | Low |

### 4. Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│                   Monitoring Stack                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │   Metrics    │  │   Logging    │  │   Tracing    │  │
│   │ (Prometheus) │  │ (ELK Stack)  │  │  (Jaeger)    │  │
│   └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│   Key Metrics:                                           │
│   • Score updates per second                             │
│   • Leaderboard cache hit rate                          │
│   • WebSocket connection count                           │
│   • Rate limit rejections                               │
│   • Action validation failures                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5. Future Considerations

| Feature | Description |
|---------|-------------|
| **Leaderboard History** | Store daily/weekly snapshots for historical rankings |
| **Regional Leaderboards** | Support multiple leaderboards by region |
| **Leagues/Tiers** | Implement tiered competition (Bronze, Silver, Gold) |
| **Anti-Cheat Appeals** | Self-service system for users to appeal bans |
| **Admin Dashboard** | Real-time monitoring and manual score adjustments |

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Action not permitted |
| `INVALID_SIGNATURE` | 400 | HMAC signature validation failed |
| `EXPIRED_REQUEST` | 400 | Request timestamp too old |
| `DUPLICATE_ACTION` | 409 | Action already processed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Summary

This specification provides a secure, scalable, and real-time scoreboard system with:

✅ **Security**: Multi-layer protection against score manipulation  
✅ **Real-time**: WebSocket-based live updates  
✅ **Performance**: Redis caching with smart invalidation  
✅ **Auditability**: Complete action logging  
✅ **Scalability**: Designed for horizontal scaling  

The backend team should implement this module following the API contracts and security measures specified above.
