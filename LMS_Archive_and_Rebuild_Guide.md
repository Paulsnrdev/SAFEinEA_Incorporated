# LMS Website Archive & Rebuild Guide
**Treasure Base Academy — SAFEinEA Incorporated**
**URL:** https://treasurebaseacademy.safeinea.ca/#/public-dashboard
**Date Archived:** 2026-06-19
**Archived by:** Automated technical analysis

---

> **IMPORTANT NOTICE:** This website uses **Absorb LMS** — a third-party commercial SaaS platform. All course content, user data, enrollments, and media assets are stored on Absorb's servers and are only accessible to authenticated users. The `robots.txt` blocks all public crawlers (`Disallow: /`), and every API endpoint requires authentication. This document covers:
> - Everything extractable without login (platform structure, features, UI, API map, routes)
> - What you MUST do manually while you still have access (see Section 12)
> - A complete technical blueprint to rebuild an equivalent system from scratch

---

## Table of Contents
1. [Website Overview](#1-website-overview)
2. [Sitemap](#2-sitemap)
3. [Platform Identification](#3-platform-identification)
4. [Application Routes & Pages](#4-application-routes--pages)
5. [Feature Inventory](#5-feature-inventory)
6. [Course Structure & Content Schema](#6-course-structure--content-schema)
7. [UI/UX Documentation](#7-uiux-documentation)
8. [API & Backend Architecture](#8-api--backend-architecture)
9. [Database Design Suggestions](#9-database-design-suggestions)
10. [ERD Description](#10-erd-description)
11. [System Architecture](#11-system-architecture)
12. [Manual Preservation Checklist — Do This NOW](#12-manual-preservation-checklist--do-this-now)
13. [Media & Asset Inventory](#13-media--asset-inventory)
14. [Rebuild Blueprint](#14-rebuild-blueprint)
15. [Technology Stack Recommendations](#15-technology-stack-recommendations)
16. [API Endpoint Specifications](#16-api-endpoint-specifications)
17. [Development Roadmap](#17-development-roadmap)
18. [Missing or Restricted Content](#18-missing-or-restricted-content)
19. [Additional Notes](#19-additional-notes)

---

## 1. Website Overview

| Field | Value |
|---|---|
| **Site Name** | Treasure Base Academy |
| **Domain** | treasurebaseacademy.safeinea.ca |
| **Parent Organization** | SAFEinEA Incorporated (Environmental Health & Safety Consulting, Canada) |
| **Platform** | Absorb LMS v5.133.0 |
| **Build Date** | 2026-06-04T15:39:33Z |
| **Build Number** | 2577110408 |
| **Release Branch** | release/5.133.0 |
| **Frontend Framework** | React 18 + Vite |
| **State Management** | Redux + RTK Query |
| **Routing Mode** | Hash Router (`/#/route`) |
| **Public Access** | Limited — public dashboard visible without login |
| **Authentication** | Username/Password, SSO (Microsoft Teams), Enrollment Keys |
| **Robots.txt** | `Disallow: /` (all crawlers blocked) |
| **Language** | English (primary), multilingual support built-in |

### Purpose
Treasure Base Academy is an online Learning Management System for SAFEinEA Incorporated, an Environmental Health & Safety consulting company based in Canada. The platform is used to deliver safety training, compliance courses, and professional development courses to learners, likely in the workplace safety and environmental health sectors.

---

## 2. Sitemap

```
https://treasurebaseacademy.safeinea.ca/
│
├── /#/public-dashboard          ← PUBLIC: Landing page (no login required)
│
├── /#/login                     ← Login page
├── /#/signup                    ← Self-enrollment / registration
├── /#/signup-form               ← Full signup form
├── /#/forgot-password           ← Password reset request
├── /#/reset-password            ← Password reset (via email link)
├── /#/activate-account          ← Account activation (via email link)
├── /#/sso-error                 ← SSO error page
│
├── AUTHENTICATED AREA
│   ├── /#/dashboard             ← Private learner dashboard
│   ├── /#/catalog               ← Browse all available courses
│   ├── /#/courses               ← My enrolled courses
│   ├── /#/search                ← Search results
│   ├── /#/resources             ← Resource library
│   ├── /#/news                  ← News/announcements
│   │   └── /#/news/:articleId   ← Individual news article
│   ├── /#/leaderboards          ← Leaderboard list
│   │   └── /#/leaderboards/:id  ← Specific leaderboard
│   ├── /#/messages/:messageId   ← Direct messages
│   ├── /#/subscriptions         ← Subscription management
│   │
│   ├── COURSE PAGES
│   │   ├── /#/course-player/:courseId             ← Course player
│   │   ├── /#/curricula/:courseId                 ← Learning path
│   │   ├── /#/curricula/:courseId/terms           ← T&C for learning path
│   │   ├── /#/course-bundles/:courseId            ← Course bundle
│   │   └── /#/online-courses/:courseId/course-evaluation ← Post-course survey
│   │
│   ├── PROFILE
│   │   ├── /#/profile/overview          ← Profile summary
│   │   ├── /#/profile/activity          ← Learning activity history
│   │   ├── /#/profile/edit              ← Edit profile details
│   │   ├── /#/profile/info              ← Profile information
│   │   ├── /#/profile/settings          ← Account settings
│   │   ├── /#/profile/photo             ← Upload profile photo
│   │   ├── /#/profile/inbox             ← Inbox/notifications
│   │   ├── /#/profile/purchase-history  ← Purchase history
│   │   └── /#/profile/card-details      ← Payment card details
│   │
│   ├── SHOPPING CART
│   │   ├── /#/cart                ← Cart review
│   │   ├── /#/cart/login          ← Cart login
│   │   ├── /#/cart/payment        ← Payment page
│   │   ├── /#/cart/billing        ← Billing address
│   │   ├── /#/cart/shipping       ← Shipping info
│   │   ├── /#/cart/signup         ← Create account at checkout
│   │   ├── /#/cart/account        ← Account selection at checkout
│   │   └── /#/cart/invoice/:cartId ← Invoice/receipt
│   │
│   └── ADMIN AREA (requires Admin role)
│       ├── /Admin                 ← Admin dashboard (legacy)
│       ├── /Admin/Templates       ← Email templates
│       └── /Admin/Users          ← User management
│           └── /#/learner-mgmt/courses/:deptId  ← Learner management
│               └── /#/learner-mgmt/login/:deptId
│
└── 404 Page Not Found
```

---

## 3. Platform Identification

The website is built on **Absorb LMS**, a commercial enterprise Learning Management System developed by Absorb Software Inc. (Calgary, Canada).

### Evidence
- API namespace: `/api/rest/v2/absorb-analytics/ui5`
- Component names: `absorb-analytics`, `AbsorbSkillsFeedbackPrompts`
- Bundle header comment: `Build Branch: release/5.133.0`
- API response header: `X-Absorb-API-Key` required for all endpoints
- Component file naming conventions match Absorb LMS open documentation

### Absorb LMS Key Facts
| Property | Value |
|---|---|
| Vendor | Absorb Software Inc., Calgary, Canada |
| Version discovered | 5.133.0 |
| API version | REST v2 |
| Frontend architecture | React + Vite (SPA with hash routing) |
| Authentication | API key header + session token |
| Mobile app | Mobile app support present (course download feature found) |

### What This Means for Preservation
Since this is a hosted SaaS platform:
- **You do NOT own the infrastructure** — when your subscription ends, all data is deleted
- **All course content, media, and user records** are stored on Absorb's servers
- **Export tools** are available in the Absorb Admin panel — use them immediately
- Rebuilding requires either migrating to another LMS or building custom software

---

## 4. Application Routes & Pages

### Public (Unauthenticated) Pages

| Route | Component | Description |
|---|---|---|
| `/#/public-dashboard` | `PublicDashboardWrapper` | Public landing page with featured/trending courses |
| `/#/login` | `login.container` | Username/password login form |
| `/#/signup` | Signup flow | Learner self-enrollment |
| `/#/signup-form` | `signup-form.container` | Full registration form |
| `/#/forgot-password` | `forgot-password.container` | Password reset request |
| `/#/reset-password` | `reset-password.container` | Set new password via email token |
| `/#/activate-account` | `activate-account.container` | Activate new account via email |
| `/#/sso-error` | `sso-error.container` | SSO/Teams error display |

### Authenticated Learner Pages

| Route | Component | Description |
|---|---|---|
| `/#/dashboard` | `PrivateDashboardWrapper` | Personalized learner dashboard |
| `/#/catalog` | `catalog.container` | Browse all courses |
| `/#/courses` | `course-list.container` | My enrolled courses |
| `/#/course-player/:courseId` | `course-player.component` | Course content player |
| `/#/curricula/:courseId` | Curriculum wrapper | Learning path view |
| `/#/course-bundles/:courseId` | Bundle wrapper | Course bundle |
| `/#/search` | `search-results-wrapper` | Global search |
| `/#/resources` | `resources.container` | Document/resource library |
| `/#/news` | `news.container` | News articles |
| `/#/leaderboards` | `leaderboard.container` | Leaderboard pages |
| `/#/subscriptions` | `subscriptions-catalog` | Subscription plans |
| `/#/profile/*` | `profile.layout` | All profile sub-pages |
| `/#/messages/:messageId` | `message.container` | Direct messaging |
| Cart routes | Cart containers | E-commerce checkout flow |

### Admin Pages

| Route | Component | Description |
|---|---|---|
| `/Admin` | Legacy Admin panel | Full administration |
| `/Admin/Templates` | Template manager | Email/notification templates |
| `/Admin/Users` | User manager | User administration |
| `/#/learner-mgmt/*` | `learner-management` | Department-level management |

---

## 5. Feature Inventory

Based on all extracted component names, API endpoints, and bundle analysis, the following features are present:

### Core Learning Features
- [x] **Course Catalog** — browse all available courses with categories, tags, filters
- [x] **Course Player** — full SCORM, xAPI (Tin Can), AICC, Video, Document playback
- [x] **Learning Paths / Curricula** — ordered sequences of courses
- [x] **Course Bundles** — grouped course packages
- [x] **Instructor-Led Training (ILT)** — classroom/webinar sessions with calendar
- [x] **External Training** — track training done outside the LMS
- [x] **Course Evaluation** — post-course surveys/ratings
- [x] **Course Resources** — downloadable files attached to courses
- [x] **Course Notes** — learner note-taking within courses
- [x] **Transcripts** — official training transcripts

### Assessment & Certification
- [x] **Quizzes** — with scoring, passing thresholds, multiple attempts
- [x] **Surveys / Polls** — standalone surveys and course polls
- [x] **Self-Assessment** — learner self-rating against competencies
- [x] **Competencies** — competency frameworks linked to courses
- [x] **Certificates** — auto-generated on course completion
- [x] **Badges** — gamification badges

### Progress & Analytics
- [x] **Progress Tracking** — per-course and per-lesson progress
- [x] **Activity Feed** — learner activity history
- [x] **Leaderboards** — point-based leaderboard rankings
- [x] **Radial Progress Bar** — visual progress indicator
- [x] **Absorb Analytics (UI5)** — built-in analytics platform

### Social & Collaboration
- [x] **Communities / Collaboration** — discussion boards, posts, comments
- [x] **Collaboration Posts** — threaded discussions
- [x] **Direct Messaging** — learner-to-learner and admin messaging
- [x] **Social Profiles** — learner profile pages with links
- [x] **Mentorship** — mentor-mentee matching and tracking
- [x] **News Articles** — platform-wide announcements

### E-Commerce
- [x] **Shopping Cart** — full checkout flow
- [x] **Payment Processing** — credit card integration
- [x] **Subscriptions** — recurring subscription plans
- [x] **Enrollment Keys** — token-based course access
- [x] **Purchase History** — invoice and receipt management
- [x] **Multiple Currencies** — international pricing
- [x] **Course Pricing** — per-course price tags

### Administration
- [x] **User Management** — create, edit, deactivate users
- [x] **Department Management** — hierarchical org structure
- [x] **Branding / White-labeling** — custom logos, colors, backgrounds
- [x] **Custom Profile Fields** — extend user profiles
- [x] **Email Templates** — customizable notification emails
- [x] **Resource Categories** — organize global resource library
- [x] **Tag Management** — course and content tagging system
- [x] **FAQ System** — frequently asked questions
- [x] **Reporting** — built-in LMS reports

### Integrations
- [x] **LinkedIn Learning** — LinkedIn Learning course catalog integration
- [x] **Microsoft Teams SSO** — single sign-on via Teams
- [x] **YouTube** — YouTube video embedding in courses
- [x] **Mobile App** — companion mobile app with offline download
- [x] **SCORM 1.2 / 2004** — industry-standard eLearning content
- [x] **xAPI (Tin Can API)** — modern learning record standard
- [x] **AICC** — legacy eLearning standard

### Course Types
| Type | Description |
|---|---|
| Online (SCORM/xAPI/AICC) | Self-paced eLearning packages |
| Video | Hosted or YouTube video lessons |
| Document | PDF, PowerPoint, Word documents as lessons |
| Survey | Standalone survey courses |
| ExternalTraining | Off-platform training records |
| Offline / ILT | Instructor-led classroom sessions |
| Curriculum | Learning path (ordered course sequence) |
| Course Bundle | Bundled course package |

### User Roles
| Role | Permissions |
|---|---|
| Learner | Enroll, complete courses, view own progress |
| Manager | View team progress, assign courses |
| Admin | Full system administration |

---

## 6. Course Structure & Content Schema

Based on API endpoint analysis and component inspection, each course has the following data structure:

### Course Object
```json
{
  "id": "string (GUID)",
  "title": "string",
  "description": "string (HTML)",
  "code": "string (course code)",
  "type": "Online | ILT | Curriculum | ExternalTraining | Survey | Video",
  "format": "string",
  "thumbnailUrl": "string (URL)",
  "duration": "number (minutes)",
  "credits": "number",
  "rating": "number (0-5)",
  "reviewCount": "number",
  "price": "number",
  "currency": "string (ISO)",
  "category": {
    "id": "string",
    "name": "string"
  },
  "tags": ["string"],
  "instructors": [{"id": "string", "name": "string"}],
  "language": "string",
  "passingScore": "number (0-100)",
  "maxAttempts": "number",
  "prerequisites": ["courseId"],
  "isEnrolled": "boolean",
  "isCompleted": "boolean",
  "completionDate": "ISO date string",
  "enrollmentDate": "ISO date string",
  "status": "NotStarted | InProgress | Completed | Passed | Failed",
  "certificate": {
    "id": "string",
    "templateId": "string",
    "expiryDate": "ISO date string"
  },
  "startDate": "ISO date string (ILT sessions)",
  "endDate": "ISO date string (ILT sessions)",
  "seats": "number (ILT capacity)",
  "lessons": ["LessonObject"],
  "resources": ["ResourceObject"],
  "evaluation": {"id": "string"},
  "termsAndConditions": "string (HTML)",
  "competencies": ["CompetencyObject"]
}
```

### Lesson Object
```json
{
  "id": "string",
  "courseId": "string",
  "title": "string",
  "type": "SCORM | xAPI | AICC | Video | Document | Survey",
  "order": "number",
  "isCompleted": "boolean",
  "progress": "number (0-100)",
  "duration": "number (minutes)",
  "contentUrl": "string",
  "thumbnailUrl": "string"
}
```

### Enrollment Object
```json
{
  "id": "string",
  "userId": "string",
  "courseId": "string",
  "enrolledDate": "ISO date string",
  "startDate": "ISO date string",
  "completedDate": "ISO date string",
  "status": "NotStarted | InProgress | Completed | Passed | Failed | Suspended",
  "progress": "number (0-100)",
  "score": "number (0-100)",
  "timeSpent": "number (seconds)",
  "certificateId": "string",
  "attemptNumber": "number"
}
```

### Curriculum (Learning Path) Object
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courses": [{
    "courseId": "string",
    "order": "number",
    "isRequired": "boolean",
    "isCompleted": "boolean"
  }],
  "progress": "number (0-100)"
}
```

---

## 7. UI/UX Documentation

### Design System

**Framework:** Material UI (MUI) components used throughout
**CSS Approach:** CSS Modules with Vite hash-based scoped class names
**Typography:** Google Fonts — `Libre Barcode 39 Text` (for barcode/certificate generation)
**Toast Notifications:** react-toastify
**Rich Text Editor:** TinyMCE or similar WYSIWYG

### Color Scheme (Inferred from CSS)

| Token | Value | Usage |
|---|---|---|
| Background (form) | `rgba(255, 255, 255, 0.9)` | Login form overlay |
| Success | `#07bc0c` | Toast success |
| Info | `#3498db` | Toast info |
| Warning | `#f1c40f` | Toast warning |
| Error | `#e74c3c` | Toast error |
| Error (dark) | `#e74c3c` | Error states |
| Toast background | `#ffffff` | Light notifications |
| Dark background | `#121212` | Dark notifications |

> **Note:** Brand-specific colors (primary, secondary, accent) are loaded dynamically from the Absorb API endpoint `/api/rest/v2/profiles/client-public` and injected as CSS custom properties via the `css-variable-theme-provider.component`. You must log into the Admin panel to view and export the exact hex values.

### Layout Architecture

#### Public Dashboard (`/#/public-dashboard`)
```
┌─────────────────────────────────────────┐
│  [Background Image/Color Banner]         │
│  (height: 386px ribbon placeholder)      │
├─────────────────────────────────────────┤
│  CONTAINER: Billboard                   │
│  (Full-width promotional tile)          │
├─────────────────────────────────────────┤
│  RIBBON: Featured Courses               │
│  [Course Card] [Course Card] [Course…]  │
│                             [View All]  │
├─────────────────────────────────────────┤
│  RIBBON: Course Catalog                 │
│  [Course Card] [Course Card] [Course…]  │
│                             [View All]  │
├─────────────────────────────────────────┤
│  RIBBON: Trending Courses               │
│  [Course Card] [Course Card] [Course…]  │
├─────────────────────────────────────────┤
│  RIBBON: LinkedIn Learning (optional)   │
├─────────────────────────────────────────┤
│  CUSTOM RIBBONS (admin-configured)      │
└─────────────────────────────────────────┘
```

**Tile wrapper padding:** `0 40px` desktop, `0 20px` mobile (≤480px)
**Ribbon placeholder height:** `386px`
**Tile top padding:** `20px`
**Dashboard alignment:** `TopCenter` (default background image alignment)

#### Course Card
Each course card displays:
- Thumbnail image
- Course title
- Course type badge
- Duration
- Rating (star rating)
- Price (if applicable)
- Progress bar (for enrolled courses)
- Enroll / Continue / Completed button
- Pin/bookmark button
- Overflow menu (unenroll, etc.)

#### Private Dashboard (`/#/dashboard`)
```
┌─────────────────────────────────────────┐
│  [Banner with background image]         │
│  ┌──────────────┐                       │
│  │ User Avatar  │  Welcome, [Name]      │
│  │              │  Progress summary     │
│  └──────────────┘                       │
├─────────────────────────────────────────┤
│  TILE: Resume Learning (last course)    │
├─────────────────────────────────────────┤
│  RIBBON: My Courses (Continue)          │
├─────────────────────────────────────────┤
│  RIBBON: Mandatory Courses              │
├─────────────────────────────────────────┤
│  RIBBON: Featured / Recommended         │
├─────────────────────────────────────────┤
│  TILE: Activity / Leaderboard           │
└─────────────────────────────────────────┘
```

#### Login Page
```
┌─────────────────────────────────────────┐
│  [Background image - full page]         │
│          ┌──────────────────┐           │
│          │  [Logo]          │           │
│          │  [Email field]   │ min-h:    │
│          │  [Password]      │ 640px     │
│          │  [Log In btn]    │           │
│          │  Forgot Password │           │
│          │  Sign Up link    │           │
│          └──────────────────┘           │
│          Form: rgba(255,255,255,0.9)    │
│          Position: right (flex-reverse) │
└─────────────────────────────────────────┘
```

#### Profile Page
```
┌─────────────────────────────────────────┐
│  [Profile Banner / Cover Image]         │
│  ┌────────┐  [Name]                     │
│  │ Avatar │  [Job Title]                │
│  └────────┘  [Social Links]            │
├─────────────────────────────────────────┤
│  Tabs: Overview | Activity | Edit | ... │
├─────────────────────────────────────────┤
│  Content Area (tab-dependent)           │
└─────────────────────────────────────────┘
```

### Responsive Breakpoints
| Breakpoint | Behavior |
|---|---|
| ≤ 480px | Mobile: reduced padding, full-width toasts, stacked layouts |
| > 480px | Desktop: full layout with sidebars and ribbons |

### Navigation Structure
- **Top header bar** (authenticated): Logo, Search, Messages, Notifications, Profile menu
- **Main navigation** (authenticated): Dashboard, Catalog, My Courses, Resources, News
- **Profile dropdown:** Profile, Settings, Logout
- **Public header:** Logo + Login/Sign Up buttons

### Key UI Components
| Component | Description |
|---|---|
| `banner.container` | Hero banner with background image and text overlay |
| `code-dashboard-tile` | Dashboard tile with enrollment key input |
| `course-card-with-data` | Full course card with enrollment state |
| `radial-progress-bar` | Circular progress indicator |
| `progress-bar` | Linear progress indicator |
| `overflow-menu-button` | Three-dot menu on course cards |
| `expandable-content` | Collapsible content sections |
| `image-carousel` | Slideshow for course images |
| `event-calendar` | ILT session calendar picker |
| `sidebar-list` / `sidebar-section` | Catalog filter sidebar |
| `tags-section` | Course tag display |
| `text-filter` | Search/filter text input |
| `shopping-cart-summary` | Cart sidebar summary |
| `session-status` | ILT session availability indicator |
| `labelled-data` | Key-value display component |

---

## 8. API & Backend Architecture

### API Base URL
```
https://treasurebaseacademy.safeinea.ca/api/rest/v2/
```

### Authentication
```http
X-Absorb-API-Key: <your-api-key>
```
- API key is obtained from the Absorb Admin panel
- All endpoints return `401 Unauthorized` without it
- Session authentication also supported (cookie-based for browser sessions)

### Complete API Endpoint Map

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rest/v2/authentication` | Log in, get session token |
| DELETE | `/api/rest/v2/authentication` | Log out |
| POST | `/api/rest/v2/authentication/impersonation` | Admin impersonate user |
| POST | `/api/rest/v2/authentication/department-impersonation` | Dept-level impersonation |
| POST | `/api/rest/v2/authentication/teams-session` | Microsoft Teams SSO |
| POST | `/api/rest/v2/password-reset-requests` | Request password reset |
| POST | `/api/rest/v2/activate-account/` | Activate new account |
| GET/POST | `/api/rest/v2/signup/learner/verify-enrollment-key` | Validate enrollment key |
| GET/POST | `/api/rest/v2/enrollment-keys/redemption-requests` | Redeem enrollment key |

#### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/my-dashboard` | Public and private dashboard config |
| GET | `/api/rest/v2/my-featured-courses/` | Featured course ribbon |
| GET | `/api/rest/v2/my-trending-courses/` | Trending course ribbon |
| GET | `/api/rest/v2/my-mandatory-courses/` | Mandatory course ribbon |
| GET | `/api/rest/v2/my-pinned-courses/` | Pinned/bookmarked courses |
| GET | `/api/rest/v2/my-latest-resumable-course/` | Last incomplete course |
| GET | `/api/rest/v2/my-resumable-courses/` | All in-progress courses |

#### Courses & Catalog
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/my-catalog` | Full course catalog |
| GET | `/api/rest/v2/my-catalog/tags` | Catalog tags |
| GET | `/api/rest/v2/my-catalog-categories` | Course categories |
| GET | `/api/rest/v2/my-catalog-calendar` | ILT session calendar |
| GET | `/api/rest/v2/my-catalog-recommendations/` | Recommended courses |
| GET | `/api/rest/v2/my-courses` | Enrolled courses list |
| GET | `/api/rest/v2/my-courses-categories` | Categories of enrolled courses |
| GET | `/api/rest/v2/my-courses-calendar` | Calendar of enrolled ILT |
| GET | `/api/rest/v2/my-courses-calendar/courses` | Calendar course detail |
| GET | `/api/rest/v2/my-course-enrollments/` | Enrollment records |
| GET | `/api/rest/v2/my-course-pins/` | Pinned courses |
| GET | `/api/rest/v2/curricula/` | Learning paths |
| GET | `/api/rest/v2/instructor-led-courses/` | ILT course sessions |
| GET | `/api/rest/v2/my-catalog-course-categories` | Course category filter |
| GET | `/api/rest/v2/course-filters/competency-definitions/` | Competency filter |
| GET | `/api/rest/v2/course-filters/instructors/` | Instructor filter |
| GET | `/api/rest/v2/my-linkedin-learning-courses` | LinkedIn Learning catalog |

#### Profile & Users
| Method | Endpoint | Description |
|---|---|---|
| GET/PATCH | `/api/rest/v2/my-profile` | Own profile |
| GET | `/api/rest/v2/my-profile/fields` | Custom profile fields |
| PATCH | `/api/rest/v2/my-profile/password` | Change password |
| GET/PATCH | `/api/rest/v2/my-profile/settings` | Notification settings |
| GET | `/api/rest/v2/profiles/client-public` | Public branding config |
| GET | `/api/rest/v2/profiles/client-private` | Authenticated config |
| GET/POST | `/api/rest/v2/profiles/social-profiles/` | Social profile links |

#### Content & Resources
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/my-global-resources` | Global resources library |
| GET | `/api/rest/v2/my-global-resources/tags` | Resource tags |
| GET | `/api/rest/v2/my-news-articles` | News articles |
| GET | `/api/rest/v2/my-activities` | Learner activity feed |
| GET | `/api/rest/v2/my-active-attempts` | Active quiz/test attempts |

#### Gamification & Social
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/my-badges/` | Badges earned |
| GET | `/api/rest/v2/my-leaderboards/` | Leaderboard data |
| GET | `/api/rest/v2/my-competencies/` | Competency progress |
| GET | `/api/rest/v2/my-polls/` | Available polls/surveys |

#### Messaging
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/messages` | Messages list |
| GET | `/api/rest/v2/my-messages/read` | Mark messages read |
| GET | `/api/rest/v2/conversations/user/{userId}` | Conversation thread |
| GET | `/api/rest/v2/conversations/user/{userId}/messages` | Thread messages |
| POST | `/api/rest/v2/conversations/user/{userId}/read/` | Mark thread read |
| GET | `/api/rest/v2/conversations-subscriptions` | Notification subscriptions |

#### E-Commerce
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rest/v2/my-subscriptions` | Active subscriptions |
| GET | `/api/rest/v2/available-currencies` | Available currencies |
| GET | `/api/rest/v2/countries` | Country list for billing |
| GET | `/api/rest/v2/provinces/` | Province/state list |

#### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET/PATCH | `/api/rest/v2/admin/branding/department-login-page-settings/` | Login page branding |
| GET/PATCH | `/api/rest/v2/admin/branding/department-login-page-advanced-settings/` | Advanced branding |
| GET | `/api/rest/v2/admin/departments/` | Department hierarchy |
| GET | `/api/rest/v2/admin/listings/resource-category` | Resource categories |
| GET | `/api/rest/v2/admin/listings/tag` | Tags |
| GET | `/api/rest/v2/admin/external-training/templates` | External training templates |
| GET/POST | `/api/rest/v2/admin/listings/leaderboard` | Leaderboard management |
| GET | `/api/rest/v2/features` | Feature flags (enabled features) |

#### Uploads
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rest/v2/learner-uploads` | Learner file uploads |
| POST | `/api/rest/v2/admin-uploads` | Admin file uploads |
| POST | `/api/rest/v2/legacy-learner-uploads` | Legacy upload support |
| POST | `/api/rest/v2/legacy-admin-uploads` | Legacy admin uploads |

#### Analytics
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rest/v2/absorb-analytics/ui5` | UI analytics event tracking |

---

## 9. Database Design Suggestions

The following schema would support an equivalent LMS rebuild:

### Users Table
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  username      VARCHAR(100) UNIQUE,
  avatar_url    TEXT,
  cover_url     TEXT,
  bio           TEXT,
  job_title     VARCHAR(200),
  department_id UUID REFERENCES departments(id),
  role          VARCHAR(50) DEFAULT 'learner', -- learner | manager | admin
  status        VARCHAR(50) DEFAULT 'active',  -- active | inactive | suspended
  language      VARCHAR(10) DEFAULT 'en',
  timezone      VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
```

### Departments Table
```sql
CREATE TABLE departments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  parent_id       UUID REFERENCES departments(id), -- hierarchical
  code            VARCHAR(50),
  manager_id      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  code            VARCHAR(100) UNIQUE,
  type            VARCHAR(50) NOT NULL, -- Online|ILT|Curriculum|ExternalTraining|Survey|Video
  format          VARCHAR(50),          -- SCORM|xAPI|AICC|Video|Document
  status          VARCHAR(50) DEFAULT 'active', -- active|inactive|archived
  thumbnail_url   TEXT,
  duration_mins   INTEGER,
  credits         DECIMAL(5,2),
  price           DECIMAL(10,2),
  currency_code   CHAR(3),
  passing_score   INTEGER DEFAULT 80,
  max_attempts    INTEGER,
  language        VARCHAR(10) DEFAULT 'en',
  category_id     UUID REFERENCES categories(id),
  author_id       UUID REFERENCES users(id),
  is_featured     BOOLEAN DEFAULT false,
  is_public       BOOLEAN DEFAULT false,
  scorm_package_url TEXT,
  video_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  published_at    TIMESTAMPTZ
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  parent_id   UUID REFERENCES categories(id),
  icon_url    TEXT,
  sort_order  INTEGER DEFAULT 0
);
```

### Tags Table
```sql
CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE course_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id    UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);
```

### Lessons Table
```sql
CREATE TABLE lessons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  type            VARCHAR(50), -- SCORM|xAPI|Video|Document|Survey|AICC
  sort_order      INTEGER NOT NULL DEFAULT 0,
  content_url     TEXT,
  thumbnail_url   TEXT,
  duration_mins   INTEGER,
  is_required     BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Curricula (Learning Paths) Table
```sql
CREATE TABLE curricula (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(500) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE curricula_courses (
  curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
  course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL,
  is_required   BOOLEAN DEFAULT true,
  PRIMARY KEY (curriculum_id, course_id)
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  course_id       UUID NOT NULL REFERENCES courses(id),
  enrolled_at     TIMESTAMPTZ DEFAULT NOW(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  due_date        TIMESTAMPTZ,
  status          VARCHAR(50) DEFAULT 'not_started',
  progress        DECIMAL(5,2) DEFAULT 0,
  score           DECIMAL(5,2),
  time_spent_secs INTEGER DEFAULT 0,
  attempt_number  INTEGER DEFAULT 1,
  enrolled_by     UUID REFERENCES users(id), -- admin who enrolled, or null for self
  UNIQUE(user_id, course_id, attempt_number)
);
```

### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id),
  lesson_id       UUID NOT NULL REFERENCES lessons(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(50) DEFAULT 'not_started',
  progress        DECIMAL(5,2) DEFAULT 0,
  score           DECIMAL(5,2),
  time_spent_secs INTEGER DEFAULT 0,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  scorm_data      JSONB,   -- stores SCORM suspend_data, bookmarks, etc.
  UNIQUE(enrollment_id, lesson_id)
);
```

### Certificates Table
```sql
CREATE TABLE certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  enrollment_id   UUID REFERENCES enrollments(id),
  course_id       UUID NOT NULL REFERENCES courses(id),
  template_id     UUID REFERENCES certificate_templates(id),
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  certificate_url TEXT,
  credential_id   VARCHAR(100) UNIQUE
);

CREATE TABLE certificate_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  html_template TEXT,
  course_id   UUID REFERENCES courses(id),
  background_url TEXT
);
```

### Quizzes & Assessments
```sql
CREATE TABLE quizzes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     UUID REFERENCES lessons(id),
  title         VARCHAR(500),
  passing_score INTEGER DEFAULT 80,
  max_attempts  INTEGER,
  time_limit_mins INTEGER,
  shuffle_questions BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  type        VARCHAR(50), -- multiple_choice|true_false|fill_blank|matching
  sort_order  INTEGER,
  points      INTEGER DEFAULT 1
);

CREATE TABLE quiz_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  is_correct      BOOLEAN DEFAULT false,
  sort_order      INTEGER
);

CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id         UUID NOT NULL REFERENCES quizzes(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  enrollment_id   UUID REFERENCES enrollments(id),
  score           DECIMAL(5,2),
  status          VARCHAR(50), -- passed|failed|in_progress
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  attempt_number  INTEGER DEFAULT 1
);
```

### Resources Table
```sql
CREATE TABLE resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  file_url      TEXT NOT NULL,
  file_type     VARCHAR(50), -- pdf|docx|xlsx|pptx|mp4|zip
  file_size_bytes BIGINT,
  category_id   UUID REFERENCES resource_categories(id),
  course_id     UUID REFERENCES courses(id),  -- null = global resource
  is_global     BOOLEAN DEFAULT false,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(200) NOT NULL
);
```

### Badges Table
```sql
CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  image_url   TEXT,
  criteria    TEXT,
  points      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
  user_id     UUID REFERENCES users(id),
  badge_id    UUID REFERENCES badges(id),
  awarded_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);
```

### Leaderboards Table
```sql
CREATE TABLE leaderboards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  type        VARCHAR(50), -- points|completions|time_spent
  period      VARCHAR(50), -- all_time|monthly|weekly
  is_active   BOOLEAN DEFAULT true
);

CREATE TABLE leaderboard_scores (
  leaderboard_id UUID REFERENCES leaderboards(id),
  user_id       UUID REFERENCES users(id),
  score         DECIMAL(10,2) DEFAULT 0,
  rank          INTEGER,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (leaderboard_id, user_id)
);
```

### Payments & E-Commerce
```sql
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  status        VARCHAR(50), -- pending|completed|refunded|failed
  total_amount  DECIMAL(10,2),
  currency_code CHAR(3),
  payment_method VARCHAR(50),
  payment_ref   VARCHAR(200),
  billing_address JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id),
  course_id   UUID REFERENCES courses(id),
  bundle_id   UUID REFERENCES course_bundles(id),
  quantity    INTEGER DEFAULT 1,
  unit_price  DECIMAL(10,2),
  discount    DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  plan_id         UUID REFERENCES subscription_plans(id),
  status          VARCHAR(50), -- active|cancelled|expired
  started_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  auto_renew      BOOLEAN DEFAULT true,
  payment_ref     VARCHAR(200)
);

CREATE TABLE enrollment_keys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(100) UNIQUE NOT NULL,
  course_id   UUID REFERENCES courses(id),
  uses_limit  INTEGER,
  uses_count  INTEGER DEFAULT 0,
  expires_at  TIMESTAMPTZ,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Notifications & News
```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        VARCHAR(100),
  title       VARCHAR(500),
  body        TEXT,
  link        TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news_articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(500) NOT NULL,
  body        TEXT,
  author_id   UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  thumbnail_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### External Training
```sql
CREATE TABLE external_training (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  course_name     VARCHAR(500) NOT NULL,
  provider        VARCHAR(200),
  completion_date DATE,
  credits         DECIMAL(5,2),
  certificate_url TEXT,
  notes           TEXT,
  approved_by     UUID REFERENCES users(id),
  status          VARCHAR(50) DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. ERD Description

```
USERS ──────────────── DEPARTMENTS (many-to-one, via department_id)
  │
  ├── ENROLLMENTS ──── COURSES ─── LESSONS
  │       │                  │
  │       │                  ├── COURSE_TAGS ──── TAGS
  │       │                  ├── CATEGORIES
  │       │                  ├── RESOURCES
  │       │                  └── CERTIFICATE_TEMPLATES
  │       │
  │       ├── LESSON_PROGRESS ── LESSONS
  │       └── CERTIFICATES ──── CERTIFICATE_TEMPLATES
  │
  ├── QUIZ_ATTEMPTS ── QUIZZES ─── QUIZ_QUESTIONS ─── QUIZ_ANSWERS
  │
  ├── USER_BADGES ──── BADGES
  │
  ├── LEADERBOARD_SCORES ── LEADERBOARDS
  │
  ├── ORDERS ─────────────── ORDER_ITEMS ─── COURSES / BUNDLES
  │
  ├── SUBSCRIPTIONS ── SUBSCRIPTION_PLANS
  │
  ├── NOTIFICATIONS
  │
  ├── NEWS_ARTICLES (authored by user)
  │
  ├── EXTERNAL_TRAINING
  │
  └── MESSAGES / CONVERSATIONS

CURRICULA ──── CURRICULA_COURSES ──── COURSES

COURSE_BUNDLES ──── BUNDLE_COURSES ──── COURSES

ENROLLMENT_KEYS ──── COURSES
```

### Key Relationships
- **Users** → **Courses**: Many-to-Many via `enrollments`
- **Courses** → **Lessons**: One-to-Many (ordered)
- **Enrollments** → **Lessons**: Many-to-Many via `lesson_progress`
- **Curricula** → **Courses**: Many-to-Many via `curricula_courses`
- **Users** → **Badges**: Many-to-Many via `user_badges`
- **Users** → **Leaderboards**: Many-to-Many via `leaderboard_scores`

---

## 11. System Architecture

### Current Architecture (Absorb LMS SaaS)
```
Browser (React SPA)
    │
    ▼
Absorb CDN (static assets: JS/CSS bundles)
    │
    ▼
Absorb API Server (REST v2)
    │
    ├── Absorb Course Content Server (SCORM packages, videos, documents)
    ├── Absorb Certificate Generator
    ├── Absorb Analytics Platform (UI5)
    └── Third-party integrations:
        ├── LinkedIn Learning API
        ├── Microsoft Teams SSO
        ├── YouTube embed
        └── Payment gateway
```

### Recommended Rebuild Architecture
```
                    ┌──────────────────────┐
                    │   CDN (Cloudflare)    │
                    │  Static assets, media │
                    └──────────┬───────────┘
                               │
              ┌────────────────▼───────────────┐
              │    Next.js Frontend (React)     │
              │    - Server-side rendering      │
              │    - API routes                 │
              │    - Static generation          │
              └────────────────┬───────────────┘
                               │
              ┌────────────────▼───────────────┐
              │    Backend API (Node.js/Go)     │
              │    REST + GraphQL               │
              └──────┬─────────────┬───────────┘
                     │             │
          ┌──────────▼──┐   ┌──────▼──────┐
          │ PostgreSQL  │   │  Redis Cache │
          │  (primary)  │   │  (sessions,  │
          └─────────────┘   │   queues)   │
                            └─────────────┘
```

---

## 12. Manual Preservation Checklist — Do This NOW

> **These steps require you to log into the LMS while you still have access. Do these before your subscription ends.**

### Step 1 — Access Admin Panel
1. Log in at `https://treasurebaseacademy.safeinea.ca/#/login`
2. Navigate to the Admin panel (`/Admin` or Admin menu)
3. Note your Absorb API key for reference

### Step 2 — Export User Data
- [ ] Go to **Admin → Reports → Users**
- [ ] Export all user records as CSV (includes: email, name, role, department, created date, last login)
- [ ] Export user custom profile fields

### Step 3 — Export Course Data
- [ ] Go to **Admin → Courses**
- [ ] For each course, note:
  - Course title and description
  - Course code
  - Category
  - Tags
  - Duration, credits, passing score
  - Price (if applicable)
- [ ] Download any SCORM/xAPI packages (`.zip` files)
- [ ] Download all video files or note YouTube URLs
- [ ] Download all document lessons (PDFs, PPTs, etc.)

### Step 4 — Export Enrollment & Progress Records
- [ ] Go to **Admin → Reports → Enrollments**
- [ ] Export all enrollment records as CSV
- [ ] Go to **Admin → Reports → Course Completions**
- [ ] Export all completion records (includes: user, course, completion date, score, certificate)

### Step 5 — Export Certificates
- [ ] Go to **Admin → Reports → Certificates**
- [ ] Export certificate records
- [ ] Download certificate template files

### Step 6 — Export Resources
- [ ] Go to **Admin → Resources** or the Resources library
- [ ] Download all resource files (PDFs, documents, etc.)

### Step 7 — Screenshot/Record UI Configuration
- [ ] Screenshot the public dashboard configuration (background image, ribbon order)
- [ ] Screenshot the login page branding (logo, background, colors)
- [ ] Screenshot the Admin branding settings (colors, fonts, logo files)
- [ ] Download all logo and branding image files
- [ ] Note all custom CSS/color hex values

### Step 8 — Export News & Announcements
- [ ] Go to **Admin → News**
- [ ] Copy/export all news article titles and body text

### Step 9 — Export Learning Paths / Curricula
- [ ] Go to **Admin → Curricula**
- [ ] Document each curriculum: name, description, course sequence, requirements

### Step 10 — Export Leaderboards & Badges
- [ ] Note all badge names, descriptions, criteria, and images
- [ ] Note all leaderboard configurations

### Step 11 — Export Subscription/Pricing Data
- [ ] Note all subscription plan names and prices
- [ ] Note all course prices and enrollment key codes

### Step 12 — Use Absorb's Official Export Tools
- Contact Absorb support to request a **full data export** before cancellation
- Ask for: user data, enrollment records, SCORM packages, media files, certificates, completion records
- Request the export in standard formats (CSV, JSON, SCORM ZIP)

### Step 13 — Use the Absorb REST API
While you still have your API key, use the following to export programmatically:
```bash
# Set your API key
API_KEY="your-api-key-here"
BASE="https://treasurebaseacademy.safeinea.ca/api/rest/v2"

# Export all courses
curl -H "X-Absorb-API-Key: $API_KEY" "$BASE/my-catalog" > courses.json

# Export enrollments
curl -H "X-Absorb-API-Key: $API_KEY" "$BASE/my-course-enrollments/" > enrollments.json

# Export profile
curl -H "X-Absorb-API-Key: $API_KEY" "$BASE/my-profile" > profile.json

# Export badges
curl -H "X-Absorb-API-Key: $API_KEY" "$BASE/my-badges/" > badges.json

# Export resources
curl -H "X-Absorb-API-Key: $API_KEY" "$BASE/my-global-resources" > resources.json
```

---

## 13. Media & Asset Inventory

### Static Assets (Publicly Accessible)
| File | URL | Size | Purpose |
|---|---|---|---|
| Main JS Bundle | `/learner/index-DSN7XgTA.js` | 5.9 MB | Application code |
| Main CSS Bundle | `/learner/index-yrTYYxAM.css` | 288 KB | All application styles |
| Public Dashboard CSS | `/learner/public-dashboard-wrapper-BgVQbkJ8.css` | 557 bytes | Dashboard layout |
| Favicon | `/favicon.ico?ui=learner` | Unknown | Site icon |

### Media Stored on Absorb Servers (Requires Auth)
All of the following are stored on Absorb's CDN and require authentication to access:

| Asset Type | Location | Notes |
|---|---|---|
| Course thumbnails | API course objects (`thumbnailUrl`) | JPEG/PNG images |
| Profile avatars | API profile objects | User-uploaded photos |
| Course background images | Dashboard config | Banner/hero images |
| SCORM packages | Course content server | ZIP files with HTML+JS |
| Video files | Course content server or YouTube | MP4 or YouTube embed |
| PDF documents | Course content server | Downloadable lessons |
| Certificate backgrounds | Certificate templates | PDF templates |
| Logo/branding images | Admin branding settings | Organization logo |
| Badge images | Admin badges section | Badge icons |

### JavaScript Chunk Files (Complete List of App Features)
The following chunks represent discrete application features, all served from `/learner/`:

```
activate-account.container
banner.container + banner-title + banner-back-button
cart-billing, cart-login, cart-receipt, cart-review, cart-shipping, cart-signup
catalog.container + catalog-switcher
collaboration-modal-banner, collaboration-post, collaborations.layout
communities.component
course-competencies.selectors
course-details-large.component
course-discovery-modal.component
course-evaluation.layout
course-list.container
course-player.component + online-course-wrapper + video-lesson-player
course-rating.component
course-resources.component
course-type-filter.component
css-variable-theme-provider.component
curricula-progress + curriculum-progress
edit-profile.component
enrollment-key.container
event-calendar.component (ILT session calendar)
faq.selectors
forgot-password.container
ilc-calendar.layout (Instructor-Led Course calendar)
image-carousel.component
instructor-led-course-wrapper.component
leaderboard.container
login.container
message.container
my-catalog.api + my-courses.api
news.container
notes.component
online-course-evaluation.container
polls.container
price.container
private-dashboard-wrapper.component
profile.layout + profile-photo.container + edit-profile + social-profile
progress-bar + radial-progress-bar
public-dashboard-wrapper.component
reset-password.container
resource-action-button + resources.container
search-results-wrapper.component
shopping-cart-summary.component
sidebar-list + sidebar-section
skills-learning-path-landing.component
sso-error.container
subscriptions.api + subscription-section.component
tags-section.component
transcript.container
unenroll-modal.component
wysiwyg-editor.utils
Youtube.component
```

---

## 14. Rebuild Blueprint

### Frontend Pages Required

| Page | Route | Key Components | Priority |
|---|---|---|---|
| Public Landing | `/` | Hero banner, featured courses ribbon, sign up CTA | P1 |
| Login | `/login` | Email/password form, SSO button, forgot password | P1 |
| Register | `/register` | Registration form, enrollment key field | P1 |
| Course Catalog | `/catalog` | Course grid, category filter, search, sort | P1 |
| Course Detail | `/courses/:id` | Description, curriculum, enroll button, reviews | P1 |
| Course Player | `/learn/:courseId` | SCORM/video iframe, progress tracker, sidebar | P1 |
| My Dashboard | `/dashboard` | Progress cards, continue learning, announcements | P1 |
| My Courses | `/my-courses` | Enrolled course cards with progress | P1 |
| Profile | `/profile` | Avatar, bio, progress stats, certificate list | P1 |
| Certificate View | `/certificates/:id` | Generated certificate with download | P1 |
| Forgot Password | `/forgot-password` | Email form | P1 |
| Admin Dashboard | `/admin` | Stats overview, quick actions | P2 |
| Admin Users | `/admin/users` | User list, create/edit/deactivate | P2 |
| Admin Courses | `/admin/courses` | Course list, create/edit/publish | P2 |
| Admin Course Editor | `/admin/courses/new` | Rich text editor, file upload, quiz builder | P2 |
| Admin Reports | `/admin/reports` | Enrollment, completion, revenue reports | P2 |
| Admin Certificates | `/admin/certificates` | Template editor, issued list | P2 |
| Learning Path | `/paths/:id` | Ordered course list, progress tracker | P2 |
| Resources | `/resources` | File library with category filter | P2 |
| News | `/news` | Article list and full article view | P3 |
| Leaderboard | `/leaderboard` | Ranked user list with points | P3 |
| Shopping Cart | `/cart` | Item list, pricing, checkout | P3 |
| Checkout | `/checkout` | Billing, payment, confirmation | P3 |
| Subscriptions | `/subscriptions` | Plan comparison, subscribe | P3 |
| Messages | `/messages` | Inbox, conversation threads | P3 |
| Search | `/search` | Global search results by type | P3 |
| Communities | `/communities` | Discussion boards | P4 |
| Surveys | `/surveys/:id` | Survey form player | P4 |
| Badges | `/profile/badges` | Badge collection display | P4 |
| Competencies | `/profile/competencies` | Skill tracking | P4 |
| ILT Sessions | `/sessions/:courseId` | Calendar, register for session | P4 |

### Backend API Endpoints Required

```yaml
Authentication:
  POST /api/auth/login
  POST /api/auth/logout
  POST /api/auth/register
  POST /api/auth/forgot-password
  POST /api/auth/reset-password
  POST /api/auth/refresh-token
  POST /api/auth/sso/callback

Users:
  GET    /api/users               (admin only)
  POST   /api/users               (admin: create user)
  GET    /api/users/:id
  PATCH  /api/users/:id
  DELETE /api/users/:id
  GET    /api/users/me            (current user profile)
  PATCH  /api/users/me
  PATCH  /api/users/me/password
  POST   /api/users/me/avatar

Courses:
  GET    /api/courses             (catalog with filters)
  POST   /api/courses             (admin only)
  GET    /api/courses/:id
  PATCH  /api/courses/:id        (admin only)
  DELETE /api/courses/:id        (admin only)
  POST   /api/courses/:id/publish (admin only)
  GET    /api/courses/:id/lessons
  POST   /api/courses/:id/lessons (admin only)
  GET    /api/courses/featured
  GET    /api/courses/trending
  GET    /api/courses/recommended

Enrollments:
  GET    /api/enrollments         (my enrollments)
  POST   /api/enrollments         (self-enroll)
  GET    /api/enrollments/:id
  DELETE /api/enrollments/:id    (unenroll)
  PATCH  /api/enrollments/:id/progress
  GET    /api/enrollments/:id/certificate

Lessons:
  GET    /api/lessons/:id
  PATCH  /api/lessons/:id        (admin only)
  POST   /api/lessons/:id/progress
  GET    /api/lessons/:id/content

Quizzes:
  GET    /api/quizzes/:id
  POST   /api/quizzes/:id/attempt
  PATCH  /api/quizzes/:id/attempt/:attemptId
  GET    /api/quizzes/:id/attempts

Certificates:
  GET    /api/certificates        (my certificates)
  GET    /api/certificates/:id
  GET    /api/certificates/:id/download

Resources:
  GET    /api/resources
  POST   /api/resources          (admin only)
  DELETE /api/resources/:id      (admin only)

Notifications:
  GET    /api/notifications
  PATCH  /api/notifications/:id/read
  PATCH  /api/notifications/read-all

Reports (admin):
  GET    /api/admin/reports/enrollments
  GET    /api/admin/reports/completions
  GET    /api/admin/reports/users
  GET    /api/admin/reports/revenue

Payments:
  POST   /api/orders
  GET    /api/orders
  GET    /api/orders/:id
  POST   /api/orders/:id/refund   (admin only)
  POST   /api/enrollment-keys/validate
  POST   /api/enrollment-keys/redeem
```

### User Roles & Permissions

| Action | Learner | Manager | Admin |
|---|---|---|---|
| Browse catalog | ✓ | ✓ | ✓ |
| Enroll in courses | ✓ | ✓ | ✓ |
| Complete courses | ✓ | ✓ | ✓ |
| View own progress | ✓ | ✓ | ✓ |
| View team progress | ✗ | ✓ | ✓ |
| Create courses | ✗ | ✗ | ✓ |
| Manage users | ✗ | ✗ | ✓ |
| View all reports | ✗ | ✗ | ✓ |
| Manage billing | ✗ | ✗ | ✓ |
| Manage branding | ✗ | ✗ | ✓ |

### Authentication & Authorization Requirements
- **JWT tokens** with refresh token rotation
- **Bcrypt** password hashing (min cost factor 12)
- **Role-based access control (RBAC)** on all API endpoints
- **SSO support**: SAML 2.0 or OAuth 2.0 for enterprise integrations
- **Email verification** on account creation
- **Password reset** via time-limited token in email
- **Rate limiting** on auth endpoints
- **CSRF protection** on all state-changing requests

### Course Management Functionality
- Rich text description editor (TipTap, Quill, or TinyMCE)
- File upload for SCORM packages (ZIP), PDFs, videos
- SCORM 1.2 / 2004 runtime integration
- Video player (native HTML5 + YouTube embed)
- Course publishing workflow (draft → review → published)
- Category and tag assignment
- Prerequisites configuration
- Certificate template assignment
- Pricing configuration

### Progress Tracking System
- Real-time progress updates via WebSocket or polling
- SCORM `cmi.core.lesson_status` + `cmi.core.score.raw` tracking
- xAPI statement submission to local LRS
- Completion rules: percentage, score threshold, manual
- Time-on-task tracking
- Attempt limiting per enrollment

### Certificate Generation
- PDF generation using **Puppeteer** or **PDFKit**
- HTML/CSS template with learner data merge fields
- Unique credential ID (UUID or sequential)
- QR code for verification (optional)
- Expiry dates with reminder emails

### Payment Integration
- **Stripe** for payment processing (recommended)
- Webhook handling for subscription events
- Proration for mid-cycle plan changes
- Coupon/discount code system
- Tax calculation by region

---

## 15. Technology Stack Recommendations

### Option A — Commercial LMS (Recommended for Speed)
Instead of rebuilding from scratch, migrate to another hosted LMS that supports data import:

| LMS | Best For | Absorb Data Import | Notes |
|---|---|---|---|
| **TalentLMS** | SMBs, EHS training | CSV users, SCORM | Most similar to Absorb UX |
| **Docebo** | Enterprise | Full migration support | More expensive |
| **Moodle (self-hosted)** | Full control, open source | Via plugins | Requires server management |
| **Canvas LMS** | Education-focused | SCORM, CSV | Popular in training sector |
| **Open edX** | Large-scale | Custom migration | Most customizable open-source |
| **LearnDash (WordPress)** | Small teams | CSV, SCORM | Cheapest option |

### Option B — Custom Build Stack

#### Frontend
```
Framework:      Next.js 14+ (React, SSR/SSG support)
State:          Zustand or Redux Toolkit
Styling:        Tailwind CSS + shadcn/ui components
Forms:          React Hook Form + Zod validation
Course player:  pipwerks SCORM API + scorm-again library
Rich text:      TipTap editor
Video:          video.js or Plyr
Charts:         Recharts or Chart.js
```

#### Backend
```
Runtime:        Node.js 20+ with TypeScript
Framework:      Fastify or Express
ORM:            Prisma (PostgreSQL)
Auth:           Passport.js + JWT (jsonwebtoken)
File uploads:   Multer + AWS S3 or Cloudflare R2
Email:          Nodemailer + MJML templates
Queue:          BullMQ (Redis-backed)
PDF:            Puppeteer (certificates)
Search:         PostgreSQL full-text or Algolia
```

#### Database & Infrastructure
```
Primary DB:     PostgreSQL 15+
Cache/Queue:    Redis 7+
File storage:   AWS S3 or Cloudflare R2 (SCORM packages, media)
Search:         PostgreSQL FTS (basic) or Meilisearch
CDN:            Cloudflare or AWS CloudFront
Hosting:        Railway, Render, or AWS ECS
CI/CD:          GitHub Actions
```

#### Key Libraries for LMS-Specific Features
```
SCORM runtime:  scorm-again (npm: scorm-again)
xAPI:           xAPI-js (npm: @xapi/xapi)
PDF certs:      Puppeteer or @react-pdf/renderer
QR codes:       qrcode (npm: qrcode)
Calendar:       react-big-calendar or FullCalendar
Video:          Plyr (npm: plyr)
File upload:    react-dropzone + tus-js-client (resumable)
```

---

## 16. API Endpoint Specifications

### Sample: Create Enrollment
```http
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "550e8400-e29b-41d4-a716-446655440000"
}

Response 201:
{
  "id": "enrollment-uuid",
  "userId": "user-uuid",
  "courseId": "course-uuid",
  "status": "not_started",
  "progress": 0,
  "enrolledAt": "2026-06-19T00:00:00Z"
}
```

### Sample: Update Lesson Progress (SCORM)
```http
PATCH /api/lessons/:lessonId/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "enrollmentId": "enrollment-uuid",
  "status": "completed",         // not_started|in_progress|completed|passed|failed
  "progress": 100,               // percentage
  "score": 87.5,                 // raw score
  "timeSpentSecs": 1800,
  "scormData": {                 // SCORM suspend_data for bookmarking
    "cmi.core.lesson_status": "completed",
    "cmi.core.score.raw": "87.5",
    "cmi.suspend_data": "...",
    "cmi.core.lesson_location": "slide_12"
  }
}

Response 200:
{
  "lessonProgress": { ... },
  "enrollment": {
    "progress": 75,             // overall course progress
    "status": "in_progress"
  }
}
```

### Sample: Get Course Catalog
```http
GET /api/courses?category=safety&tag=workplace&sort=trending&page=1&limit=20
Authorization: Bearer <token>

Response 200:
{
  "items": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "thumbnailUrl": "...",
      "duration": 120,
      "price": 0,
      "isEnrolled": false,
      "progress": null,
      ...
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

---

## 17. Development Roadmap

### Phase 1 — Foundation (Weeks 1-4)
- [ ] Project setup: monorepo, TypeScript, linting, CI/CD
- [ ] Database schema design and migrations (Prisma)
- [ ] Auth system: register, login, JWT, password reset
- [ ] User profile CRUD
- [ ] Course model CRUD (admin)
- [ ] Basic course catalog (learner view)
- [ ] File upload to cloud storage (S3/R2)

### Phase 2 — Core Learning (Weeks 5-8)
- [ ] Course player (SCORM 1.2 + 2004 + Video)
- [ ] Progress tracking and status updates
- [ ] Enrollment system (self-enroll + admin-enroll)
- [ ] Lesson navigation and completion
- [ ] Course completion and certificate generation (PDF)
- [ ] Basic dashboard for learners

### Phase 3 — Administration (Weeks 9-12)
- [ ] Admin dashboard with key stats
- [ ] User management (CRUD, role assignment, bulk import CSV)
- [ ] Course authoring tool (rich text + file upload + quiz builder)
- [ ] Enrollment management and reporting
- [ ] Email notifications (enrollment, completion, certificate)
- [ ] Learning paths (curricula) support

### Phase 4 — Engagement Features (Weeks 13-16)
- [ ] Course catalog search and filtering
- [ ] News/announcements module
- [ ] Resource library
- [ ] Quiz/assessment system (multiple choice, T/F, fill-in)
- [ ] Course ratings and reviews
- [ ] Badges and gamification (basic)
- [ ] Leaderboards

### Phase 5 — Commerce & Advanced (Weeks 17-20)
- [ ] Payment processing (Stripe)
- [ ] Enrollment keys
- [ ] Subscription plans
- [ ] Shopping cart and checkout
- [ ] External training tracking
- [ ] Transcript view and download
- [ ] Department/team management
- [ ] Manager reporting views

### Phase 6 — Polish & Scale (Weeks 21-24)
- [ ] Mobile responsive optimization
- [ ] Performance optimization (caching, lazy loading)
- [ ] Analytics and advanced reporting
- [ ] SSO integration (SAML/OAuth)
- [ ] LinkedIn Learning integration (API)
- [ ] Communities/collaboration (optional)
- [ ] Mentorship module (optional)

### Estimated Effort
| Phase | Effort | Team Size |
|---|---|---|
| Phase 1 | 4 weeks | 2 devs |
| Phase 2 | 4 weeks | 2-3 devs |
| Phase 3 | 4 weeks | 2-3 devs |
| Phase 4 | 4 weeks | 2-3 devs |
| Phase 5 | 4 weeks | 2-3 devs |
| Phase 6 | 4 weeks | 2-3 devs |
| **Total** | **~24 weeks** | **2-3 devs** |

---

## 18. Missing or Restricted Content

The following content requires authenticated access and **could not be extracted** by automated analysis:

| Content | Access Required | How to Preserve |
|---|---|---|
| All course titles and descriptions | Admin login | Export from Admin panel |
| All lesson/module names | Admin login | Export from Admin panel |
| SCORM/video course packages | Admin login | Download from course editor |
| All user accounts and profiles | Admin login | Export users CSV via Reports |
| All enrollment records | Admin login | Export via Admin Reports |
| Completion and progress records | Admin login | Export via Admin Reports |
| Certificates issued | Admin login | Export certificate records |
| Quiz questions and answers | Admin login | Screenshot or copy manually |
| Resource files (PDFs, etc.) | Admin login | Download from Resources section |
| Custom branding (logo, colors) | Admin login | Screenshot + download assets |
| News article content | Learner login | Copy text manually |
| Dashboard background image | Admin login | Download from branding settings |
| Email template HTML | Admin login | Copy from Admin → Templates |
| Enrollment key codes | Admin login | Export from Admin panel |
| Payment/subscription history | Admin login | Export from financial reports |
| Leaderboard configurations | Admin login | Screenshot or note settings |
| Badge names, images, criteria | Admin login | Screenshot or copy |

### Authentication Requirements for Restricted Content
1. **Learner role:** Can access course content, own progress, certificates, and news
2. **Admin role:** Required for all export/backup operations
3. **API key:** Available in Admin panel under API settings — use with all API endpoints above

---

## 19. Additional Notes

### Important Observations

1. **This is a fully commercial, third-party platform.** Treasure Base Academy is not a custom-built system — it is an instance of **Absorb LMS** running on Absorb's infrastructure. The subdomain `treasurebaseacademy.safeinea.ca` points to Absorb's hosting servers.

2. **Data Portability Risk.** When the Absorb subscription ends, all data (courses, users, enrollments, certificates) will be permanently deleted unless exported first. Contact Absorb support at the earliest opportunity.

3. **SCORM Package Ownership.** If courses were created using authoring tools (Articulate Storyline, Adobe Captivate, iSpring, etc.), the original `.story`, `.pptx`, or source files should also be backed up separately from the exported SCORM ZIPs.

4. **Absorb Documentation.** Detailed API documentation for the Absorb LMS REST v2 API is available at Absorb's developer portal (requires Absorb account). Use this to automate bulk data export.

5. **Certificate Verification.** If learners have certificates that need to remain verifiable after the platform closes, consider:
   - Exporting all certificate PDFs
   - Setting up a simple verification page on a new domain
   - Transitioning to a blockchain-based certificate system (e.g., Accredible, Badgr)

6. **Content Licensing.** Courses created internally are owned by SAFEinEA. LinkedIn Learning content is licensed per-subscriber and cannot be migrated. External/integrated content may have separate licensing.

7. **Compliance Considerations.** Training completion records for safety/EHS courses may need to be retained for regulatory compliance (e.g., OH&S regulations). Ensure completion records are exported and stored securely.

8. **Build Version.** The extracted build (`5.133.0`, dated `2026-06-04`) confirms this is an actively maintained, up-to-date Absorb installation — not an outdated version.

### Quick-Start Migration to TalentLMS (Recommended)

If you want the fastest path to a working replacement:

1. Sign up for TalentLMS (similar feature set to Absorb, cheaper)
2. Import users via CSV upload
3. Upload SCORM packages per course
4. Re-assign enrollments via bulk CSV import
5. Upload certificate records for historical verification
6. Configure branding to match current colors/logo
7. Redirect the subdomain to new LMS

### Contact Information
- **Absorb Support:** For official data export assistance, contact your account manager or support@absorblms.com
- **Absorb Knowledge Base:** https://support.absorblms.com
- **Absorb API Docs:** Available in the Absorb Admin panel under Settings > API

---

*End of LMS Archive & Rebuild Guide*
*Generated: 2026-06-19 | Treasure Base Academy — SAFEinEA Incorporated*
