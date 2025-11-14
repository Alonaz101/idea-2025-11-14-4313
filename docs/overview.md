# Overview of Features

This repository implements the mood-based recipe recommendation application based on the requirements from Jira issues SCRUM-422, SCRUM-423, and SCRUM-424.

## SCRUM-422: MVP - Mood Input and Recipe Recommendation

- User authentication via JWT with signup and login.
- Mood input interface through a React frontend mood selector.
- Backend APIs:
  - `/api/auth/signup` and `/api/auth/login` for user management.
  - `/api/moods` to retrieve moods.
  - `/api/recommendations` to get recipe recommendations based on selected mood.
- MongoDB models for User, Mood, Recipe, and MoodRecipeMapping.
- Security measures: password hashing with bcrypt, token-based authentication.
- Basic frontend UI with React for mood selection and authentication.

## SCRUM-423: Post-MVP - Mood History, Social Sharing, Advanced Mood Detection (Planned)

- Mood history tracking and analytics API and UI.
- Social sharing and community microservices.
- Advanced mood detection via text or voice input.
- OAuth2 social login support.
- Performance improvements with DB sharding and Redis caching.
- Testing enhancements including user analytics and security audits.

## SCRUM-424: Future Expansion - AI-driven Recipe Generation, Voice Assistant Integration, and Multilanguage Support (Planned)

- AI/ML integration for personalized recipe generation.
- Voice assistant integration with Alexa and Google Assistant.
- Supporting multilanguage internationalization and localization.
- Monitoring and security considerations for AI and voice inputs.

---

This codebase currently covers the SCRUM-422 features fully with a working backend and frontend prototype. Further implementations as planned in SCRUM-423 and SCRUM-424 will follow in future development phases.