# 🎟️ Flash Ticket System

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-success?style=for-the-badge&logo=springboot">
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql">
  <img src="https://img.shields.io/badge/Redis-Cloud-red?style=for-the-badge&logo=redis">
  <img src="https://img.shields.io/badge/Redisson-Distributed%20Lock-darkred?style=for-the-badge">
  <img src="https://img.shields.io/badge/JWT-Security-black?style=for-the-badge">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Maven-Build-red?style=for-the-badge&logo=apachemaven">
</p>

<p align="center">

# 🚀 Enterprise-Level High Concurrency Ticket Booking Platform

*A production-oriented ticket booking system built with Spring Boot, PostgreSQL, Redis, Redisson Distributed Lock and React, designed to prevent race conditions, overselling and support high concurrent traffic.*

</p>

---

# 📖 Overview

Flash Ticket System is an enterprise-grade online ticket booking platform developed to simulate how modern booking platforms such as concert, cinema, sports and event reservation systems handle thousands of users attempting to purchase tickets simultaneously.

Unlike traditional CRUD projects, this project focuses on solving real-world backend engineering challenges including:

- High Concurrent Ticket Booking
- Distributed Locking
- Seat Reservation
- Race Condition Prevention
- Cloud Database Deployment
- Redis-based Performance Optimization
- Enterprise Security

The primary goal of this project is to demonstrate modern backend architecture, scalability, performance optimization and clean software engineering practices.

---

# 🌍 Business Problem

Imagine a concert having only **100 seats**.

Now suppose **5,000 users** click the **Book Now** button at exactly the same time.

Without proper synchronization:

❌ Same seat may be sold twice.

❌ Payment inconsistencies occur.

❌ Database race conditions appear.

❌ Overselling becomes possible.

❌ Users receive invalid tickets.

This project solves these challenges using enterprise backend architecture.

---

# 💡 Solution

Instead of allowing every request to directly update the database, the application introduces multiple protection layers.

```

Client Request

↓

JWT Authentication

↓

Spring Security

↓

Redis Cache

↓

Redisson Distributed Lock

↓

Business Validation

↓

PostgreSQL Transaction

↓

Booking Confirmation

```

Only one booking process can modify seat availability for a specific event at a time.

This completely prevents overselling.

---

# ⭐ Key Features

## Authentication

- JWT Authentication
- BCrypt Password Encryption
- Role Based Authorization
- Secure REST APIs

---

## Ticket Booking

- Concert Booking
- Cinema Booking
- Event Booking
- Real-Time Seat Availability
- Seat Reservation
- Booking Confirmation

---

## Redis Integration

- Redis Cache
- Seat Availability Cache
- Temporary Seat Reservation
- TTL Expiration
- High-Speed Reads
- Reduced Database Load

---

## Distributed Locking

Implemented using

**Redisson Distributed Lock**

Features:

- Prevents Duplicate Booking
- Prevents Race Conditions
- Atomic Booking Process
- Thread Safe Operations
- Cloud Compatible

---

## Database

Cloud Hosted PostgreSQL using

**Neon Database**

Benefits

- Managed PostgreSQL
- Automatic Backups
- Cloud Native
- SSL Enabled
- Production Ready

---

## Spring Profiles

Different environments are configured separately.

Development

```

application-dev.yml

```

Production

```

application-prod.yml

```

This keeps local development completely isolated from production deployment.

---

# 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| Language | Java 21 |
| Framework | Spring Boot 3 |
| Security | Spring Security |
| Authentication | JWT |
| Database | PostgreSQL |
| Cloud Database | Neon |
| Cache | Redis Cloud |
| Distributed Lock | Redisson |
| ORM | Spring Data JPA |
| Build Tool | Maven |
| Frontend | React.js |
| API | REST |
| Version Control | Git |
| Repository | GitHub |
| Testing | JMeter |
| Deployment | *(To be Added)* |

---

# 🏗 System Architecture

```

                    React Frontend

↓

REST API

↓

Spring Boot

├───────────────┐

│               │

Spring Security JWT

│

Redis Cloud

│

Redisson Lock

│

PostgreSQL (Neon)

↓

Booking Completed

```

---

# 🔥 Enterprise Highlights

✅ Cloud PostgreSQL

✅ Redis Cloud

✅ Distributed Locking

✅ High Concurrent Booking

✅ Spring Profiles

✅ Secure JWT Authentication

✅ Production Ready Architecture

✅ Scalable Backend Design

✅ Clean Layered Architecture

✅ RESTful APIs

---

# 🎯 Why This Project?

This project was built to demonstrate practical backend engineering concepts that are commonly used in enterprise systems rather than focusing only on CRUD operations.

The architecture emphasizes:

- Scalability
- Performance
- Security
- Concurrency Handling
- Cloud Infrastructure
- Production-Oriented Design

making it suitable as a portfolio project showcasing modern Spring Boot backend development practices.

---

# 🏛 System Design

The Flash Ticket System follows a layered enterprise architecture that separates responsibilities across multiple layers to improve maintainability, scalability, testing and future extensibility.

```
                React Frontend
                       │
               REST API Requests
                       │
          Spring Security + JWT Filter
                       │
                 Controller Layer
                       │
                  Service Layer
                       │
        ┌──────────────┴──────────────┐
        │                             │
    Redis Cloud                 PostgreSQL
        │                             │
 Redisson Distributed Lock      Permanent Data
        │                             │
        └──────────────┬──────────────┘
                       │
               JSON Response
```

---

# 📂 Project Architecture

```
src
├── config
│
├── controller
│
├── dto
│
├── entity
│
├── repository
│
├── service
│
├── security
│
├── exception
│
├── redis
│
├── mapper
│
├── util
│
└── resources
     ├── application.yml
     ├── application-dev.yml
     └── application-prod.yml
```

Each package follows the Single Responsibility Principle (SRP), making the application easier to maintain and scale.

---

# 🗄 Database Architecture

PostgreSQL is used as the primary persistent storage.

All business-critical information is permanently stored inside PostgreSQL.

Examples include:

- Users
- Events
- Venues
- Bookings
- Payments
- Roles
- Permissions
- Refresh Tokens

Database:

```
Neon PostgreSQL (Cloud)
```

Advantages:

- ACID Transactions
- Strong Consistency
- Relational Integrity
- Cloud Hosted
- SSL Secured
- Automatic Backup
- Production Ready

---

# ☁ Why Neon PostgreSQL?

Instead of using a local database in production, this project uses Neon Cloud PostgreSQL.

Benefits:

- No local database dependency
- Accessible from anywhere
- SSL encrypted connection
- Managed PostgreSQL service
- Easy deployment
- Suitable for portfolio projects

Development uses:

```
application-dev.yml
```

Production uses:

```
application-prod.yml
```

allowing complete separation between local and production environments.

---

# ⚡ Redis Architecture

Redis is used as an in-memory datastore for extremely fast operations.

Unlike PostgreSQL, Redis stores temporary information.

Redis is responsible for:

- Seat Availability Cache
- Temporary Seat Reservation
- Distributed Lock
- Rate Limiting (Future)
- Session Storage (Future)
- OTP Storage (Future)

Redis dramatically reduces database traffic during heavy booking operations.

---

# Why Redis?

Imagine 10,000 users checking seat availability every second.

Without Redis:

```
10,000 Requests

↓

PostgreSQL

↓

Heavy Database Load
```

With Redis:

```
10,000 Requests

↓

Redis

↓

Only booking operations hit PostgreSQL
```

This significantly improves response time.

---

# Redis Key Design

The application follows a consistent Redis key naming strategy.

Example

```
event:1:availableSeats
```

Value

```
120
```

Reserved seats

```
event:1:reservedSeats
```

Example

```
A10
A11
B5
```

Distributed Lock

```
lock:event:1
```

This naming convention keeps Redis organized and easy to maintain.

---

# 🔒 Redisson Distributed Lock

One of the biggest problems in ticket booking systems is concurrent booking.

Suppose only one seat remains.

```
Seat A10
```

Two users click

Book Now

at exactly the same time.

Without locking:

```
User A

↓

Database

↓

Seat Available

↓

Book

-----------------

User B

↓

Database

↓

Seat Available

↓

Book
```

Result

❌ Duplicate Booking

❌ Overselling

❌ Data Corruption

---

Using Redisson

```
User A

↓

Acquire Lock

↓

Check Seat

↓

Book Ticket

↓

Update Database

↓

Release Lock

--------------------

User B

↓

Wait

↓

Acquire Lock

↓

Check Again

↓

Seat Already Sold

↓

Booking Rejected
```

Only one booking request can modify seat availability at a time.

---

# Why Redisson?

Instead of implementing manual synchronization, Redisson provides a production-ready distributed locking mechanism.

Benefits:

- Thread Safe
- Distributed
- Cluster Ready
- Auto Unlock
- Retry Mechanism
- Reliable
- Easy Integration
- Production Tested

---

# Booking Lifecycle

```
User Opens Event

↓

Redis

↓

Available Seats

↓

User Selects Seat

↓

Temporary Reservation

↓

Payment Starts

↓

Payment Successful

↓

Save Booking

↓

Update Redis

↓

Return Confirmation
```

---

# Temporary Seat Reservation

When a user selects a seat, the seat is not immediately sold.

Instead,

it becomes temporarily reserved.

```
Seat

A15

↓

Reserved

↓

10 Minutes

↓

Payment
```

If payment succeeds

```
Reserved

↓

Booked
```

If payment fails

```
Reserved

↓

TTL Expired

↓

Seat Available Again
```

---

# TTL (Time To Live)

Redis automatically removes temporary reservations.

Example

```
Seat Reserved

↓

TTL = 10 Minutes

↓

Payment Failed

↓

Reservation Removed

↓

Seat Available Again
```

This prevents seats from remaining locked forever.

---

# Cache Warming

If Redis restarts, all cache data is lost.

During application startup,

the application reloads frequently required information from PostgreSQL into Redis.

```
Application Starts

↓

Load Events

↓

Load Seat Counts

↓

Populate Redis

↓

Application Ready
```

This process is known as

Cache Warming.

---

# Event Creation Flow

When an administrator creates a new event:

```
Admin

↓

Create Event

↓

Save Event

↓

PostgreSQL

↓

Initialize Redis

↓

availableSeats = totalSeats

↓

Ready For Booking
```

Redis is updated automatically by the backend.

No manual Redis operations are required.

---

# Source of Truth

Redis is **not** the permanent database.

The permanent source of truth is PostgreSQL.

Redis only stores temporary and high-speed operational data.

```
PostgreSQL

↓

Permanent Data

Users

Bookings

Payments

Events

↓

Redis

↓

Temporary Data

Seat Availability

Reservations

Locks

Cache
```

This hybrid architecture combines reliability with performance.

---

# 🔐 Authentication & Authorization

Security is one of the core components of this project.

The application uses JSON Web Tokens (JWT) to authenticate users and secure REST APIs.

Authentication Flow

```
Client

↓

Login Request

↓

Spring Security

↓

Authentication Manager

↓

JWT Generated

↓

Client Stores Token

↓

Token Sent with Every Request

↓

JWT Validation

↓

Authorized API Access
```

---

## Authentication Features

- User Registration
- User Login
- BCrypt Password Encryption
- JWT Access Token
- Stateless Authentication
- Protected REST APIs

---

# 🔑 Why JWT?

JWT allows the server to remain stateless.

Instead of storing user sessions on the server, every request carries its own authentication token.

Benefits

- Faster Authentication
- Better Scalability
- No Server Session Storage
- Easy Integration with React
- Suitable for REST APIs

---

# 🛡 Spring Security

Spring Security is responsible for protecting every secured endpoint.

Responsibilities

- Authentication
- Authorization
- Password Encryption
- JWT Filter
- Request Validation
- Access Control

Only authenticated users can access protected resources.

---

# 👤 User Roles

The system currently supports Role-Based Access Control (RBAC).

### Admin

Responsible for

- Managing Events
- Managing Venues
- Viewing Bookings
- Managing Users
- Monitoring System Data

---

### User

Responsible for

- Register Account
- Login
- Browse Events
- View Available Seats
- Reserve Seats
- Book Tickets
- View Booking History

---

# 🎟 Ticket Booking Workflow

```
User Login

↓

Browse Events

↓

Select Event

↓

View Available Seats

↓

Choose Seat

↓

Acquire Redisson Lock

↓

Validate Seat Availability

↓

Reserve Seat

↓

Save Booking

↓

Update PostgreSQL

↓

Update Redis

↓

Booking Confirmation
```

Only one booking request is processed for the same seat at a time.

---

# ⚠ Race Condition Prevention

Suppose only one seat is available.

Without locking

```
User A

↓

Seat Available

↓

Booking

-------------------

User B

↓

Seat Available

↓

Booking
```

Result

❌ Duplicate Booking

❌ Overselling

❌ Data Inconsistency

---

Using Redisson Lock

```
User A

↓

Acquire Lock

↓

Reserve Seat

↓

Save Booking

↓

Release Lock

----------------------

User B

↓

Wait

↓

Acquire Lock

↓

Seat Already Reserved

↓

Booking Rejected
```

This guarantees booking consistency.

---

# 📦 Layered Architecture

The backend follows a layered architecture.

```
Controller

↓

Service

↓

Repository

↓

Database
```

Each layer has a dedicated responsibility.

### Controller

- Accept Requests
- Validate Input
- Return Responses

---

### Service

Contains business logic.

Examples

- Booking Validation
- Seat Reservation
- Redis Synchronization
- Lock Handling

---

### Repository

Responsible for communication with PostgreSQL using Spring Data JPA.

---

### Database

Stores permanent business information.

---

# 📂 DTO Pattern

DTOs are used to transfer only the required information between client and server.

Benefits

- Smaller Responses
- Better Security
- Cleaner API Design
- Easier Validation

---

# ❗ Exception Handling

The application uses centralized exception handling.

Examples

- User Not Found
- Invalid Credentials
- Seat Already Reserved
- Seat Not Available
- Event Not Found
- Unauthorized Access

Centralized exception handling provides consistent API responses.

---

# ✅ Input Validation

Incoming requests are validated before processing.

Typical validations include

- Required Fields
- Email Format
- Password Rules
- Seat Selection
- Event Existence

This prevents invalid data from reaching the database.

---

# 📡 REST API Design

The backend follows REST principles.

Typical endpoints include

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/events

GET    /api/events/{id}

GET    /api/events/{id}/seats

POST   /api/bookings

GET    /api/bookings/my
```

All secured endpoints require a valid JWT.

---

# 📤 Sample API Response

Successful Response

```json
{
    "success": true,
    "message": "Booking completed successfully.",
    "data": {
        "bookingId": 145,
        "eventId": 5,
        "seatNumber": "A12"
    }
}
```

Error Response

```json
{
    "success": false,
    "message": "Seat is already reserved."
}
```

---

# 🧠 Design Principles

This project follows modern backend development principles.

- Separation of Concerns
- Layered Architecture
- Clean Code
- Reusable Components
- Stateless Authentication
- High Performance
- Scalability
- Cloud Ready

---

# 🚀 Current Implemented Features

- ✅ Spring Boot 3
- ✅ Java 21
- ✅ PostgreSQL (Neon Cloud)
- ✅ Spring Data JPA
- ✅ Redis Cloud
- ✅ Redisson Distributed Lock
- ✅ JWT Authentication
- ✅ Spring Security
- ✅ BCrypt Password Encryption
- ✅ REST APIs
- ✅ Redis TTL
- ✅ Production & Development Profiles
- ✅ React Frontend Integration

---

# 🔮 Planned Future Enhancements

The following features are planned for future releases.

- Payment Gateway Integration
- QR Code Ticket Generation
- Email Notifications
- Ticket Cancellation
- Refund Management
- Event Analytics Dashboard
- WebSocket Live Seat Updates
- Microservices Architecture
- Kafka Event Streaming
- Docker Deployment
- Kubernetes Deployment


# 📂 Project Structure

The project follows a clean layered architecture to ensure maintainability, scalability, and separation of concerns.

```
flash-ticket-system
│
├── src
│   ├── main
│   │
│   ├── java
│   │   └── com.zynvora.flash_ticket_system
│   │
│   │       ├── config
│   │       ├── controller
│   │       ├── service
│   │       ├── service.impl
│   │       ├── repository
│   │       ├── entity
│   │       ├── dto
│   │       ├── mapper
│   │       ├── security
│   │       ├── redis
│   │       ├── exception
│   │       ├── validation
│   │       ├── util
│   │       └── FlashTicketSystemApplication.java
│   │
│   └── resources
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── static
│
├── pom.xml
│
└── README.md
```

---

# 🏛 Clean Architecture

The application is divided into independent layers where every layer has a single responsibility.

```
                Client
                   │
             React Frontend
                   │
             REST Controllers
                   │
            Business Services
                   │
        Repository / Data Access
                   │
      PostgreSQL + Redis Cloud
```

This architecture improves

- Maintainability
- Readability
- Testability
- Scalability
- Reusability

---

# 📌 Layer Responsibilities

## Controller Layer

Responsible for

- Receiving HTTP Requests
- Returning HTTP Responses
- Input Validation
- Calling Service Layer

No business logic exists inside controllers.

---

## Service Layer

This layer contains the application's business rules.

Examples

- Booking Logic
- Seat Reservation
- Redis Synchronization
- Redisson Lock Handling
- Event Management
- User Management

The service layer acts as the heart of the application.

---

## Repository Layer

Responsible for communicating with PostgreSQL using Spring Data JPA.

Responsibilities

- CRUD Operations
- Custom Queries
- Pagination
- Filtering
- Sorting

---

## Entity Layer

Represents database tables.

Examples

- User
- Event
- Booking
- Venue
- Role

Entities are mapped using JPA annotations.

---

## DTO Layer

DTOs are used instead of directly exposing entities.

Benefits

- Improved Security
- Reduced Payload Size
- Better API Design
- Flexible Responses
- Easier Validation

---

## Configuration Layer

Contains application configuration classes.

Examples

- Security Configuration
- JWT Configuration
- Redis Configuration
- Redisson Configuration
- CORS Configuration

---

# 🎯 Design Principles

This project follows modern software engineering principles.

### Single Responsibility Principle

Every class has only one responsibility.

Example

BookingService

Only manages booking operations.

---

### Open Closed Principle

The application is designed to allow new features without modifying existing code.

---

### Dependency Injection

Spring Boot manages object creation using dependency injection.

Benefits

- Loose Coupling
- Better Testing
- Easier Maintenance

---

### Separation of Concerns

Authentication

Booking

Database

Redis

Business Logic

are separated into independent modules.

---

# 🧩 Design Patterns

The following software design patterns are used.

## Repository Pattern

Spring Data JPA repositories abstract database access.

Benefits

- Cleaner Code
- Easy Database Operations
- Reusable Queries

---

## Dependency Injection

Used throughout the application.

Spring automatically injects

- Services
- Repositories
- Redis Templates
- Configuration Beans

---

## Builder Pattern

DTOs and entities can utilize the Builder pattern (e.g., Lombok `@Builder`) for cleaner object creation.

Benefits

- Readable Code
- Immutable Object Creation
- Flexible Initialization

---

## Factory Pattern

Spring Boot internally uses factory methods to create beans.

Developers benefit from automatic bean lifecycle management.

---

# 📦 Configuration Profiles

Different environments use different configurations.

Development

```
application-dev.yml
```

Production

```
application-prod.yml
```

Default

```
application.yml
```

Benefits

- Easy Environment Switching
- Secure Credentials
- Clean Configuration
- Production Ready

---

# ☁ Development Environment

Development environment uses

- Local PostgreSQL
- Local Redis

Purpose

- Fast Development
- Local Testing
- Debugging

---

# 🚀 Production Environment

Production environment uses

- Neon PostgreSQL
- Redis Cloud

Benefits

- Cloud Hosted
- Accessible Anywhere
- SSL Enabled
- Suitable for Deployment

---

# 🔐 Security Practices

The project follows several backend security practices.

- BCrypt Password Hashing
- JWT Authentication
- Stateless Authorization
- Protected APIs
- Role-Based Access Control
- Request Validation
- Exception Handling

Passwords are never stored in plain text.

---

# 📚 Dependency Overview

Main libraries used in the project.

| Dependency | Purpose |
|------------|---------|
| Spring Boot | Backend Framework |
| Spring Web | REST APIs |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | ORM |
| PostgreSQL Driver | Database Connectivity |
| Spring Data Redis | Redis Integration |
| Redisson | Distributed Locking |
| JWT | Token-Based Authentication |
| Lombok | Boilerplate Reduction |
| Validation | Request Validation |

---

# 🔄 Request Lifecycle

Every client request follows the same lifecycle.

```
Client

↓

Spring Security

↓

JWT Validation

↓

Controller

↓

Service

↓

Redis Check

↓

Redisson Lock

↓

PostgreSQL

↓

Response
```

This layered request flow keeps responsibilities separated and simplifies maintenance.

---

# 🧪 Development Best Practices

The project follows several development standards.

- Clean Package Structure
- Constructor Injection
- Layered Architecture
- Reusable Services
- Centralized Exception Handling
- Environment-Based Configuration
- Cloud Database
- Cloud Redis
- Stateless Authentication
- High-Concurrency Design

---

# 💼 Enterprise Readiness

This project is designed with production-oriented concepts in mind.

✔ Layered Architecture

✔ Cloud Infrastructure

✔ Redis Caching

✔ Distributed Locking

✔ Secure Authentication

✔ RESTful APIs

✔ Scalable Design

✔ Environment Profiles

✔ Clean Code Practices

✔ Modern Java Development

# 🗄 Database Design

The Flash Ticket System uses **PostgreSQL** as its primary relational database. It stores all permanent business data and ensures ACID-compliant transactions for reliable booking operations.

Cloud Provider

```
Neon PostgreSQL
```

---

# 📊 Core Database Entities

The backend is designed around the following core entities.

```
User
│
├── id
├── firstName
├── lastName
├── email
├── password
├── role
├── createdAt
└── updatedAt

↓

Event
│
├── id
├── title
├── description
├── venue
├── eventDate
├── totalSeats
├── availableSeats
├── createdAt
└── updatedAt

↓

Booking
│
├── id
├── bookingReference
├── seatNumber
├── bookingTime
├── status
├── userId
└── eventId

↓

Role
│
├── id
└── name
```

---

# 🔗 Entity Relationships

```
User

1
│
│
│
∞

Booking

∞
│
│
│
1

Event
```

Relationship Summary

- One User → Many Bookings
- One Event → Many Bookings
- Each Booking belongs to exactly one User
- Each Booking belongs to exactly one Event

---

# 📑 Why PostgreSQL?

PostgreSQL was selected because it provides enterprise-level reliability and transactional consistency.

Advantages

- ACID Transactions
- High Performance
- Referential Integrity
- Strong SQL Support
- Excellent Spring Boot Integration
- Cloud Ready
- Open Source

---

# ☁ Cloud Database

Production environment uses

```
Neon PostgreSQL
```

Development environment uses

```
Local PostgreSQL
```

This enables developers to work locally while production remains completely isolated.

---

# 🔴 Redis Data Design

Redis is **not** used as the primary database.

Redis stores temporary and high-speed operational data only.

Examples

```
Seat Availability

Temporary Reservations

Distributed Locks
```

---

# 🧠 Redis Key Structure

The application follows a consistent Redis naming convention.

Available Seats

```
event:1:availableSeats
```

Example Value

```
120
```

Reserved Seats

```
event:1:reservedSeats
```

Example

```
A10
A11
B5
```

Distributed Lock

```
lock:event:1
```

This structure makes Redis data predictable and easy to manage.

---

# 🔄 Booking State

Each booking moves through a well-defined lifecycle.

```
Seat Available

↓

Seat Reserved

↓

Booking Confirmed
```

If the reservation expires before confirmation, the seat becomes available again.

```
Seat Reserved

↓

TTL Expired

↓

Seat Available
```

---

# ⏳ Temporary Reservation

When a user selects a seat, it is temporarily reserved.

Example

```
Seat A15

↓

Reserved

↓

Redis

↓

TTL = 10 Minutes
```

If no confirmation occurs before TTL expires, Redis automatically removes the reservation.

---

# ⚡ Booking Strategy

Every booking request follows this sequence.

```
User

↓

Acquire Redisson Lock

↓

Check Seat Availability

↓

Reserve Seat

↓

Update PostgreSQL

↓

Update Redis

↓

Release Lock

↓

Return Response
```

This sequence prevents concurrent booking conflicts.

---

# 🚫 Overselling Prevention

Overselling occurs when multiple users purchase the same seat simultaneously.

The application prevents this by combining

- Redis
- Redisson Distributed Lock
- PostgreSQL Transactions

Only one booking process can update a specific event at any given moment.

---

# 🔐 Why Redisson Instead of Java synchronized?

Using the Java `synchronized` keyword only works within a single application instance.

If the application is deployed across multiple servers, `synchronized` cannot coordinate requests between them.

Redisson uses Redis as a distributed lock provider, allowing multiple application instances to share the same lock.

Benefits

- Works across multiple servers
- Suitable for cloud deployments
- Prevents duplicate bookings
- Reliable under high concurrency

---

# 📈 Database Optimization

To improve query performance, the database should use indexes on frequently searched columns.

Recommended indexes include

- email
- eventDate
- bookingReference
- userId
- eventId

These indexes reduce query execution time during filtering and lookups.

---

# 📋 Transaction Management

Booking operations should execute inside a database transaction.

Typical flow

```
Start Transaction

↓

Validate Request

↓

Acquire Lock

↓

Persist Booking

↓

Update Available Seats

↓

Commit Transaction
```

If any step fails, the transaction is rolled back to maintain data consistency.

---

# 🌐 Scalability Strategy

The backend is designed with scalability in mind.

Current architecture supports

- Stateless REST APIs
- Cloud PostgreSQL
- Redis Cloud
- Distributed Locking
- Environment Profiles

Future enhancements may include

- Load Balancer
- Multiple Application Instances
- Read Replicas
- Message Queue Integration
- Microservices

---

# 🏆 Engineering Decisions

| Decision | Reason |
|----------|--------|
| PostgreSQL | Reliable relational database |
| Neon Cloud | Managed cloud hosting |
| Redis | High-speed in-memory operations |
| Redisson | Distributed locking |
| Spring Boot | Enterprise backend framework |
| JWT | Stateless authentication |
| React | Modern frontend framework |

---

# 💡 Design Philosophy

The architecture focuses on solving real-world engineering challenges rather than only implementing CRUD operations.

Key goals

- Data Consistency
- High Performance
- Scalability
- Maintainability
- Security
- Clean Architecture
- Production Readiness


# ⚡ Performance & Scalability

The Flash Ticket System is designed using modern backend engineering practices to support high concurrent traffic while maintaining consistency and reliability.

Instead of relying solely on database transactions, the application combines PostgreSQL, Redis, and Redisson to minimize latency and prevent race conditions.

---

# 🚀 Performance Strategy

The application uses multiple optimization techniques.

### PostgreSQL

- Permanent Data Storage
- ACID Transactions
- Indexed Queries
- Referential Integrity

---

### Redis

Redis acts as an in-memory data store.

Responsibilities

- Cache frequently accessed data
- Store temporary reservations
- Fast seat availability lookup
- Distributed synchronization

Average Redis operations complete significantly faster than querying a relational database.

---

### Redisson

Redisson provides distributed locking.

Benefits

- Prevents duplicate booking
- Eliminates race conditions
- Supports multiple application instances
- Cloud ready

---

# 📊 High Concurrency Design

Traditional booking systems may suffer from overselling when thousands of users submit booking requests simultaneously.

This project introduces a concurrency-safe booking workflow.

```
          User Request
                │
                ▼
      Acquire Distributed Lock
                │
                ▼
      Validate Seat Availability
                │
                ▼
        Reserve Requested Seat
                │
                ▼
     Persist Booking (PostgreSQL)
                │
                ▼
      Update Redis Cache
                │
                ▼
         Release Lock
                │
                ▼
         Return Response
```

Only one request can modify seat availability for a specific event at a time.

---

# 📈 Scalability

The application is designed so that it can grow without major architectural changes.

Current Design

```
React Frontend

↓

Spring Boot

↓

Redis Cloud

↓

Neon PostgreSQL
```

Future Scale

```
                Load Balancer
                      │
      ┌───────────────┼───────────────┐
      │               │               │
 Spring Boot     Spring Boot     Spring Boot
      │               │               │
      └───────────────┼───────────────┘
                      │
               Redis Cloud
                      │
              Neon PostgreSQL
```

Because authentication is stateless (JWT), horizontal scaling becomes significantly easier.

---

# 📦 Caching Strategy

The project uses a Cache-Aside strategy.

Workflow

```
Client Request

↓

Redis

↓

Cache Hit ?

↓

YES

↓

Return Cached Data

-----------------------

NO

↓

Query PostgreSQL

↓

Store Result in Redis

↓

Return Response
```

This reduces unnecessary database load and improves response time.

---

# 🧪 Load Testing

The backend architecture is designed to be evaluated under concurrent load using Apache JMeter.

Testing objectives include

- Concurrent Booking Requests
- Seat Reservation Validation
- Duplicate Booking Prevention
- API Response Time
- System Stability
- Throughput Analysis

---

# 📊 JMeter Test Results

> **Note:** Performance testing will be executed after feature completion. Replace the placeholders below with actual results.

| Metric | Value |
|---------|------|
| Concurrent Users | *(To be Updated)* |
| Total Requests | *(To be Updated)* |
| Average Response Time | *(To be Updated)* |
| 90th Percentile | *(To be Updated)* |
| 95th Percentile | *(To be Updated)* |
| Throughput | *(To be Updated)* |
| Error Rate | *(To be Updated)* |
| Test Duration | *(To be Updated)* |

---

# 📷 Performance Dashboard

Add screenshots after executing JMeter.

```
docs/images/

├── jmeter-dashboard.png
├── response-time-graph.png
├── throughput-graph.png
├── active-users.png
└── summary-report.png
```

---

# 📉 Expected Observations

After testing, evaluate

- API response consistency
- Booking success rate
- Duplicate booking prevention
- Lock acquisition behavior
- Redis performance
- PostgreSQL performance

---

# 🔒 Reliability

The backend prioritizes data consistency.

Implemented strategies

- JWT Authentication
- BCrypt Password Encryption
- Distributed Locking
- Transaction Management
- Exception Handling
- Stateless APIs

---

# 🌍 Cloud Infrastructure

Production environment

| Component | Service |
|-----------|---------|
| Database | Neon PostgreSQL |
| Cache | Redis Cloud |
| Backend | *(Deployment URL Placeholder)* |
| Frontend | *(Netlify URL Placeholder)* |

---

# 📸 Project Screenshots

> Replace the placeholders below after completing the frontend.

```
docs/images/

├── login-page.png
├── register-page.png
├── home-page.png
├── event-list.png
├── event-details.png
├── seat-selection.png
├── booking-success.png
├── admin-dashboard.png
├── redis-dashboard.png
├── swagger-ui.png
└── jmeter-dashboard.png
```

---

# 🌐 Live Demo

Frontend

```
https://YOUR-NETLIFY-URL.netlify.app
```

Backend API

```
https://YOUR-BACKEND-URL
```

Swagger

```
https://YOUR-BACKEND-URL/swagger-ui/index.html
```

---

# 📜 API Documentation

API documentation will be available through Swagger UI.

Example endpoints

```
POST    /api/auth/register

POST    /api/auth/login

GET     /api/events

GET     /api/events/{id}

GET     /api/events/{id}/seats

POST    /api/bookings

GET     /api/bookings/my-bookings
```

Authentication

```
Authorization

Bearer <JWT_TOKEN>
```

---

# 🎯 Portfolio Highlights

This project demonstrates practical backend engineering concepts beyond basic CRUD development.

Highlights

- Enterprise Layered Architecture
- JWT Authentication
- Spring Security
- PostgreSQL Cloud Database
- Redis Cloud Integration
- Redisson Distributed Lock
- High-Concurrency Booking Design
- RESTful APIs
- Environment-Based Configuration
- Production-Oriented Development


# ⚙️ Installation & Setup

This guide explains how to set up the Flash Ticket System for local development and production.

---

# 📋 Prerequisites

Before running the project, ensure the following software is installed.

| Software | Version |
|----------|---------|
| Java | 21+ |
| Maven | 3.9+ |
| PostgreSQL | 16+ (Development) |
| Redis | Latest |
| Git | Latest |
| Node.js | Latest (Frontend) |

---

# 📥 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/flash-ticket-system.git

cd flash-ticket-system
```

---

# 📦 Install Dependencies

```bash
mvn clean install
```

---

# 🚀 Run Backend

Development

```bash
mvn spring-boot:run
```

Production Profile

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

# 🛠 Build Project

```bash
mvn clean package
```

Generated JAR

```
target/
flash-ticket-system.jar
```

Run

```bash
java -jar flash-ticket-system.jar
```

---

# ⚙ Spring Profiles

The project supports multiple environments using Spring Profiles.

```
application.yml
```

Shared configuration.

```
application-dev.yml
```

Development environment.

```
application-prod.yml
```

Production environment.

This allows different database and Redis configurations without modifying application code.

---

# 🖥 Development Configuration

Development Environment

Database

```
Local PostgreSQL
```

Redis

```
Local Redis
```

Profile

```
dev
```

Purpose

- Local Development
- Debugging
- Feature Development

---

# ☁ Production Configuration

Production Environment

Database

```
Neon PostgreSQL
```

Redis

```
Redis Cloud
```

Profile

```
prod
```

Purpose

- Production Deployment
- Cloud Hosting
- Portfolio Demonstration

---

# 📄 Configuration Example

Development

```yaml
spring:

  datasource:
    url: jdbc:postgresql://localhost:5432/flash_ticket_system
    username: your_username
    password: your_password

  data:
    redis:
      host: localhost
      port: 6379

  profiles:
    active: dev
```

---

Production

```yaml
spring:

  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

  data:
    redis:
      host: ${REDIS_HOST}
      port: ${REDIS_PORT}
      password: ${REDIS_PASSWORD}

  profiles:
    active: prod
```

---

# 🔒 Environment Variables

Sensitive credentials should never be committed to Git.

Example

```
DATABASE_URL=

DATABASE_USERNAME=

DATABASE_PASSWORD=

REDIS_HOST=

REDIS_PORT=

REDIS_PASSWORD=

JWT_SECRET=

JWT_EXPIRATION=
```

Environment variables keep secrets secure across different environments.

---

# 📡 Default Server

```
http://localhost:8080
```

---

# 🔑 Authentication

Protected endpoints require a JWT.

Example Header

```
Authorization

Bearer YOUR_ACCESS_TOKEN
```

---

# 🌍 Frontend

Frontend Technology

```
React.js
```

Frontend Repository

```
(Add GitHub Repository URL)
```

Production URL

```
(Add Netlify URL)
```

The React application communicates with the backend through REST APIs.

---

# 🌐 Backend Deployment

Production Backend

```
(Add Backend Deployment URL)
```

Example providers

- Railway
- Render
- Koyeb

---

# 📁 Recommended Git Ignore

```
target/

.idea/

.vscode/

*.log

.env

application-local.yml
```

---

# 🧪 Testing Checklist

Before deployment verify

- User Registration
- Login
- JWT Authentication
- Event Management
- Booking
- Redis Connection
- PostgreSQL Connection
- Distributed Lock
- API Validation
- Exception Handling

---

# 🔍 Health Check

Verify

```
Database Connected

Redis Connected

Application Started

JWT Working

REST APIs Accessible
```

---

# 🚀 Deployment Workflow

```
Developer

↓

Git Commit

↓

GitHub

↓

Backend Deployment

↓

Neon PostgreSQL

↓

Redis Cloud

↓

Application Running

↓

React Frontend

↓

Users
```

---

# 📈 Production Readiness Checklist

✅ Java 21

✅ Spring Boot 3

✅ PostgreSQL Cloud

✅ Redis Cloud

✅ Redisson Distributed Lock

✅ JWT Authentication

✅ Spring Security

✅ Layered Architecture

✅ Environment Profiles

✅ REST APIs

✅ Production Configuration

---

# 📚 Useful Commands

Build

```bash
mvn clean package
```

Run

```bash
java -jar target/flash-ticket-system.jar
```

Run Development

```bash
mvn spring-boot:run
```

Run Production

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Clean

```bash
mvn clean
```

Test

```bash
mvn test
```

---

# 💡 Notes

- Development and production environments are completely isolated using Spring Profiles.
- PostgreSQL acts as the system of record, while Redis handles high-speed caching and synchronization.
- Redisson ensures concurrency-safe booking operations.
- Sensitive configuration values should always be supplied through environment variables in production.



