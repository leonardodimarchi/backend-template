# Backend Template

A template to build REST APIs.

# TODOs

This is where i'm going to place my ideas and things that i want to do or use in this project:

- [ ] Editor config
- [x] Path aliases
- [ ] Clean architecture
- [x] Value Objects where needed
    - [x] Factories at the entities (interface to receive non VO values)
- [ ] Good and scalable error handling
    - [ ] Try to handle common exceptions with a global-scoped exception filter and module errors (errors and business-errors) with controller-scoped exception filters. Both responsible for the i18n
- [ ] i18n (fully handled by the presentation layer)