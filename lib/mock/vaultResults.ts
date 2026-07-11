import { VaultResult } from '@/lib/types/vault'

export const mockVaultResults: VaultResult[] = [
  {
    path: 'Resume/Resume - Master.md',
    title: 'Resume - Master',
    excerpt: 'Source of truth for all resume content. Student Supervisor at OSU Engagement Center, Blog REST API, Clinic Scheduling API...',
    type: 'resume',
    modifiedAt: '2026-06-24',
    content: `# Resume — Master

## Contact
Christian Colon | colonchristian224@gmail.com | Columbus, OH

## Education
**The Ohio State University** — B.S. Computer Science Engineering, May 2026
GPA: 3.23

## Experience
**Student Supervisor** — OSU Engagement Center (2024–Present)
- Managed scheduling and training for 12 student callers
- Developed call scripts and tracked weekly engagement metrics
- Promoted from caller after one semester

## Projects

### Blog REST API
*Java 21, Spring Boot 4, PostgreSQL, JWT*
- Production-ready REST API with full CRUD for posts, comments, and tags
- JWT authentication with refresh token rotation
- Deployed on Railway with CI via GitHub Actions

### Clinic Scheduling API
*C# 12, ASP.NET Core 8, Entity Framework Core 8, PostgreSQL, JWT*
- Complete REST API for managing clinic appointments across three roles (admin, provider, patient)
- Conflict detection prevents double-booking
- Full Swagger/OpenAPI documentation

## Skills
Java, C#, Spring Boot, ASP.NET Core, PostgreSQL, JWT, REST APIs, Git, TypeScript, Next.js, Python (basic)`,
  },
  {
    path: 'Job Search/Applications/Epic - Technical Solutions Engineer.md',
    title: 'Epic Systems: Technical Solutions Engineer',
    excerpt: 'Applied 2026-06-24. Status: Applied. On-site, Madison, WI. Resume: Epic TSE tailored version...',
    type: 'application',
    modifiedAt: '2026-06-24',
    content: `# Epic Systems: Technical Solutions Engineer

**Status:** Applied
**Applied:** 2026-06-24
**Location:** Madison, WI (on-site)
**Resume used:** Epic TSE tailored version
**URL:** https://www.epic.com/careers

## Role Summary
Technical Solutions Engineer — implement and configure Epic software for healthcare clients. Mix of technical work, client-facing communication, and travel (~50%).

## Why Applying
- Well-known for stability and benefits
- Healthcare domain is interesting, lots of real-world impact
- New grad friendly with strong structured onboarding program
- Madison, WI has a good cost of living

## Notes
Applied through Epic's website. Application included a video interview step.

Travel is a real consideration — ~50% is significant for a first job. Worth discussing in interview.

Salary is on the lower end (~$75k–$90k) but total comp with benefits is competitive.`,
  },
  {
    path: 'Job Search/Companies/Upstart.md',
    title: 'Upstart',
    excerpt: 'AI lending marketplace. Public (NASDAQ: UPST). Stack: Kotlin, Java, Ruby on Rails, Python; AWS; Kafka...',
    type: 'company',
    modifiedAt: '2026-06-24',
    content: `# Upstart

**Type:** Public (NASDAQ: UPST)
**Domain:** AI lending marketplace
**HQ:** San Mateo, CA (remote-friendly)
**Founded:** 2012

## Tech Stack
Kotlin, Java, Ruby on Rails, Python; AWS; Kafka; PostgreSQL; Spark

## Open Role
**Software Engineer, Lifecycle** — works on core loan lifecycle pipeline. Processes loan applications end-to-end.

Salary range: $142,000 – $196,600

Listed requirement: 3 years experience (stretch role).

## Why Interesting
- Strong Java/Kotlin backend alignment with my skills
- AI/ML driven product — interesting problem domain
- Top-of-market salary for a new grad if they bite

## Concerns
Listed 3 years experience — applied as a stretch. Resume was tailored to highlight Java and backend project depth.

## Research Notes
Stock was ~$70 in early 2026. Company has gone through some volatility but core product is strong.
Q4 2025 earnings showed profitability returning.`,
  },
  {
    path: 'Projects/Blog API.md',
    title: 'Blog REST API',
    excerpt: 'Java 21, Spring Boot 4, PostgreSQL, JWT. Production-ready REST API with full CRUD for blog posts...',
    type: 'project',
    modifiedAt: '2026-06-20',
    content: `# Blog REST API

**Stack:** Java 21, Spring Boot 4, PostgreSQL, JWT
**Status:** Complete
**Repo:** [github.com/Christian-716/blogapi](https://github.com/Christian-716/blogapi)

## Overview
Production-ready REST API built as a portfolio piece. Full CRUD for blog posts, comments, and tags with JWT-based auth.

## Features
- JWT authentication with refresh token rotation
- Role-based authorization: admin, author, reader
- Full CRUD: posts, comments, tags, categories
- Pagination and filtering on all list endpoints
- Deployed on Railway with GitHub Actions CI

## Technical Decisions
- **Spring Data JPA + Hibernate** for the ORM layer — covers 95% of query needs cleanly
- **PostgreSQL** over MySQL for JSON column support and advanced indexing
- **Flyway** for database migrations — reproducible schema across environments
- **BCrypt** for password hashing with configurable work factor

## Challenges
Spring Security 6 had a breaking API change from Spring Security 5 — the config style completely changed. Spent about a day working through the new SecurityFilterChain API before it clicked.

## What I'd Do Differently
Add Redis caching for the post list endpoints. Currently every request hits the DB. Would make a big difference at scale.`,
  },
  {
    path: 'Interview Prep/STAR Stories.md',
    title: 'STAR Stories',
    excerpt: 'Behavioral interview bank. 6 stories: Frisbee Miscommunication, Junior Year Breakdown, Creek Crew...',
    type: 'note',
    modifiedAt: '2026-06-23',
    content: `# STAR Stories

Behavioral interview bank. Use these for "tell me about a time when..." questions.

---

## Frisbee Miscommunication
**Situation:** Led an intramural frisbee team. Miscommunication about field location — half the team showed up at the wrong field.
**Task:** Get everyone to the right location before the game started.
**Action:** Called teammates individually, coordinated a carpool, notified the ref we'd be 10 minutes late.
**Result:** Team made it, won the game. Established a shared group chat with maps pinned for all future games.

*Use for:* Communication, leadership, quick problem-solving under pressure.

---

## Junior Year Breakdown
**Situation:** Overwhelmed by CS coursework, part-time job at OSU, and two club commitments simultaneously.
**Task:** Get back on track without dropping anything important.
**Action:** Audited all commitments by time cost, cut one club, set non-negotiable study blocks, talked to a TA early about an upcoming project.
**Result:** Finished the semester with my best GPA of college. The structure I built carried into senior year.

*Use for:* Time management, self-awareness, prioritization.

---

## Creek Crew
**Situation:** Volunteer stream cleanup. Equipment (trash grabbers, bags) broke halfway through. 20 volunteers were idle.
**Task:** Keep the cleanup going, keep morale up.
**Action:** Split group into manual teams, repurposed event tarps as collection bags, kept energy up by turning it into a competition.
**Result:** Finished on time. Event organizers asked me to lead again the following semester.

*Use for:* Adaptability, leadership, resourcefulness.

---

## Fishmonger Capstone
**Situation:** Senior capstone group project. One teammate was not contributing — missed two check-ins, deliverables were incomplete.
**Task:** Deliver the project on time without burning the relationship or being unfair to the team.
**Action:** Had a direct 1:1 conversation privately, asked if something was going on. Redistributed work with their agreement, documented contributions clearly.
**Result:** Project delivered on time with full marks. Teammate opened up about a family situation — the conversation helped.

*Use for:* Conflict resolution, team dynamics, difficult conversations.`,
  },
  {
    path: 'Interview Prep/Personal Story.md',
    title: 'Personal Story',
    excerpt: 'Military kid. Dad was Air Force 20+ years. Moved every 4 years. OSU CS Engineering, May 2026...',
    type: 'note',
    modifiedAt: '2026-06-23',
    content: `# Personal Story

## Background
Military kid. Dad was Air Force for 20+ years. Moved every 4 years — Virginia, Germany, Texas, then Ohio for high school.

Never had a "hometown" but learned to adapt fast. Being the new kid repeatedly taught me how to read a room, build rapport quickly, and not be precious about comfort zones.

## Why CS
Chose CS Engineering at OSU because I liked understanding how things work underneath. Not just using software — building it. The Engineering track (vs. pure CS) meant more systems-level thinking, which appealed to me.

## What I Build
I'm drawn to backend engineering. The complexity is hidden from users — they never see the database or the API — but if it breaks, everything breaks. I find that responsibility interesting rather than scary.

My two complete projects (Blog API in Java, Clinic API in C#) both reflect this. I wasn't trying to build full products — I was trying to understand what makes a real backend reliable.

## The Job Search
New grad in 2026. Applying broadly — fintech, healthtech, government consulting, enterprise software. Strong in Java and C#. Building out TypeScript/React via this project (Career Command Center).

Looking for somewhere I can go deep on backend systems, grow fast, and eventually own something meaningful.`,
  },
  {
    path: 'Projects/Clinic Scheduling API.md',
    title: 'Clinic Scheduling API',
    excerpt: 'C# 12, ASP.NET Core 8, Entity Framework Core 8, PostgreSQL, JWT. Complete. REST API for managing clinic appointments...',
    type: 'project',
    modifiedAt: '2026-06-20',
    content: `# Clinic Scheduling API

**Stack:** C# 12, ASP.NET Core 8, Entity Framework Core 8, PostgreSQL, JWT
**Status:** Complete
**Repo:** [github.com/Christian-716/clinic-scheduling-api](https://github.com/Christian-716/clinic-scheduling-api)

## Overview
Complete REST API for managing clinic appointments. Supports three roles: admin, provider (doctor), and patient. Built to demonstrate production-level C# backend skills.

## Features
- JWT authentication with role-based authorization (admin / provider / patient)
- Appointment CRUD with conflict detection (no double-booking a provider)
- Provider availability management — providers set their schedules
- Patient record management
- Full Swagger/OpenAPI documentation with example requests
- Database seeding for deterministic test runs

## Technical Decisions
- **EF Core with code-first migrations** — schema lives in code, easy to reproduce
- **Repository pattern** — keeps controllers thin, business logic isolated
- **ASP.NET Core built-in DI** throughout, no third-party container needed
- **PostgreSQL** for reliability and ACID compliance on appointment transactions

## Key Challenge
Appointment conflict detection. Checking for overlaps is tricky with variable-length appointments. The query needs to catch cases where a new appointment:
1. Starts inside an existing one
2. Ends inside an existing one
3. Completely contains an existing one

Ended up with a range overlap check: \`new.Start < existing.End && new.End > existing.Start\`

## What I'd Do Differently
Add a proper notification system (email/SMS on booking confirmation). The stub is there but it just logs to console. Would integrate with SendGrid or Twilio in a real deployment.`,
  },
]
