# Implementation Log: Auth & Staff Modules
**Developer:** Godsgift Ifeanyi
**Date:** January 6, 2026
**Status:** In Progress

---

## 1. Objective
The goal of this implementation is to secure the Point of Sale (POS) system by establishing a robust Authentication and Staff Management domain. This module ensures that:
* Only authorized personnel can access the system via a secure PIN mechanism.
* Administrators can manage the workforce (hire/fire/promote) via a centralized API.
* All staff actions can be traced back to a specific User ID (laying the groundwork for the Audit Trail).

---

## 2. Database Schema Analysis
**Entity:** `Employee`
**Table Name:** `employees`
**Persistence Layer:** PostgreSQL (via Aiven Cloud)

Based on the Domain-Driven Design (DDD) architecture, the Employee entity was analyzed to determine required data points.

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Generated | Unique identifier for the staff member. |
| `first_name` | String | Not Null | Staff's first name. |
| `last_name` | String | Not Null | Staff's last name. |
| `email` | String | Unique | Used for system notifications and recovery. |
| `pin_code` | String | Min Length 4 | The secret credential for login. |
| `role` | Enum | `admin`, `manager`, `cashier` | Determines access level (RBAC). |
| `active` | Boolean | Default: `true` | Soft-delete mechanism (we disable users rather than deleting history). |

---

## 3. API Contract Design
The following endpoints have been designed to fulfill the functional requirements.

### A. Create New Staff (Onboarding)
* **Endpoint:** `POST /api/v1/staff`
* **Access Level:** Admin Only
* **Description:** Onboards a new employee into the system.

**Request Body (JSON Spec):**
```json
{
  "first_name": "David",
  "last_name": "Gigi",
  "email": "david@pos-system.com",
  "role": "manager",
  "pin_code": "8821"
}

**Success Response (201 Created):**
```json
{
  "id": "a1b2c3d4-...",
  "first_name": "David",
  "last_name": "Gigi",
  "email": "david@pos-system.com",
  "role": "manager",
  "active": true,
  "created_at": "2026-01-06T10:00:00Z"
}

---

### B. Staff login (Authentication)
* **Endpoint:** `POST /api/v1/auth/login`
* **Access Level:** public
* **Description:** Validates credentials to grant system access.

**Request Body (JSON Spec):**
```json
{
  "email": "victor@pos-system.com",
  "pin_code": "8821"
}

**Success Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": "a1b2c3d4-...",
        "full_name": "Victor Ndukwe",
        "role": "manager"
    }
}

**Error Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}

---

### C. Get Staff Profile (Identification)
* **Endpoint:** `GET /api/v1/staff/:id`
* **Access Level:** Authenticated User
* **Description:** Retrieves details for a specific staff member (used for UI display).

---

### D. Update Staff Status (Management)
* **Endpoint:** `PATCH /api/v1/staff/:id`
* **Access Level:** Admin Only
* **Description:** Used to promote a user or deactivate them (fire).

**Request Body (JSON Spec):**
```json
{
  "role": "admin",
  "active": false
}

**Success Response (200 OK):**
```json
{
  "message": "Staff status updated successfully"
}

---

## 4. Deployment & Integration Strategy

* **Local Development:** `http://localhost:3001` (Port 3001 selected to avoid conflict).
* **Cloud Staging (Render):** Links to be provided upon successful PR merge.
* **CI/CD:** Code will be pushed to the feat/auth-staff-logic branch. Upon PR merge, the Render pipeline will automatically redeploy the new endpoints.