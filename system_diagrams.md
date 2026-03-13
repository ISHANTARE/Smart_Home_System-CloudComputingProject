# Project System Diagrams

For your review and presentation, here are the exact technical diagrams of your Smart Home Cloud Computing project. 

> [!TIP]
> These diagrams are generated using Mermaid. You can take screenshots of these rendered diagrams directly from this document, as they contain the exact, typon-free variable and table names from your codebase (unlike AI-generated images which often misspell technical terms).

---

## 1. Entity-Relationship Diagram (ERD)
This diagram shows the complete SQLite database schema for the project, illustrating how Users, Rooms, Devices, and Logs are connected.

```mermaid
erDiagram
    USERS ||--o{ ROOMS : has
    USERS ||--o{ ACTIVITY_LOG : "actions"
    USERS ||--o{ BOOKMARKS : saves
    
    ROOMS ||--o{ DEVICES : contains
    ROOMS ||--o{ LIGHTS : contains
    ROOMS ||--o{ USAGE_DATA : tracks
    
    DEVICES ||--o{ BOOKMARKS : "bookmarked as"

    USERS {
        int id PK
        string name
        string email
        string password
        string avatar_color
        datetime created_at
    }

    ROOMS {
        int id PK
        int user_id FK
        string name
        string climate_type
        int climate_temp
        int climate_on
        string total_spend
        string total_hours
    }

    DEVICES {
        int id PK
        int room_id FK
        string name
        string icon
        string status
        string power
        int is_on
    }

    LIGHTS {
        int id PK
        int room_id FK
        string name
        int brightness
        int is_on
    }

    USAGE_DATA {
        int id PK
        int room_id FK
        string time_label
        int value
    }

    ACTIVITY_LOG {
        int id PK
        int user_id FK
        string action
        string target
        string detail
    }

    BOOKMARKS {
        int id PK
        int user_id FK
        int device_id FK
    }
```

---

## 2. Authentication & JWT Sequence Diagram
This diagram illustrates the secure login flow and how the stateless JWT token is issued. This is highly relevant for cloud computing security.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React UI
    participant Express API
    participant SQLite DB

    User->>React UI: Enters Email & Password
    React UI->>Express API: POST /api/auth/login
    Express API->>SQLite DB: SELECT * FROM users WHERE email=?
    
    alt User Not Found or Invalid
        SQLite DB-->>Express API: Returns null / No mismatch
        Express API-->>React UI: 401 Unauthorized
        React UI-->>User: Shows Error Toast
    else Valid Credentials
        SQLite DB-->>Express API: Returns User Object (Hash)
        Note over Express API: bcrypt.compareSync(hash)
        Note over Express API: jwt.sign(userId)
        Express API->>SQLite DB: INSERT INTO activity_log (login)
        Express API-->>React UI: 200 OK (JWT Token + User Data)
        Note over React UI: stores Token in localStorage
        React UI-->>User: Redirects to Dashboard
    end
```

---

## 3. IoT Device Control Data Flow (Toggle Device)
This diagram shows how the frontend performs "optimistic UI updates" to make the app feel instantly responsive when toggling a smart device.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React UI
    participant SmartHomeContext
    participant Express API
    participant SQLite DB

    User->>React UI: Clicks Toggle Switch on "Smart TV"
    React UI->>SmartHomeContext: toggleDevice(roomId, deviceId)
    
    Note over SmartHomeContext: Optimistic Update Phase
    SmartHomeContext->>React UI: Instantly Toggle UI Switch to ON
    React UI-->>User: Visual feedback (feels instant)

    Note over SmartHomeContext: Network Request Phase
    SmartHomeContext->>Express API: PUT /api/devices/:id { isOn: true }
    Express API->>SQLite DB: UPDATE devices SET is_on=1
    
    alt Success
        SQLite DB-->>Express API: Success
        Express API-->>SmartHomeContext: 200 OK
        Note over SmartHomeContext: UI remains ON
    else Network/Server Error
        Express API-->>SmartHomeContext: 500 Server Error
        Note over SmartHomeContext: Revert Optimistic Update
        SmartHomeContext->>React UI: Revert UI Switch to OFF
        SmartHomeContext->>React UI: Show Error Toast
        React UI-->>User: Visual revert & "Failed to update" message
    end
```
