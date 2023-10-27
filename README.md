[![Backend Template](https://readme-typing-svg.demolab.com?font=Poppins&size=26&duration=2500&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=Backend+Template)](https://git.io/typing-svg)

---

![License](https://img.shields.io/github/license/leonardodimarchi/backend-template)
![Build](https://img.shields.io/github/actions/workflow/status/leonardodimarchi/backend-template/build.yml)
![Unit Tests](https://img.shields.io/github/actions/workflow/status/leonardodimarchi/backend-template/unit-tests.yml?label=unit-tests)

A template to build REST APIs.

## Code Formatting and Linter

This project uses the following tools:

- **ESLint**: a linter to analyze the code statically and identify potential errors or enforce coding conventions.

- **Prettier**: code formatter that helps with the code formatting (after writing) in an opinionated and standardized way.

## TODOs

This is where i'm going to place my ideas and things that i want to do or use in this project:

- [x] Editor config
- [x] Prettier precommit hook
- [x] Shields at the README (tests and build)
- [x] Path aliases
- [x] Clean architecture
- [x] Value Objects where needed
  - [x] Factories at the entities (interface to receive non VO values)
- [ ] Good and scalable error handling
  - [ ] Try to handle common exceptions with a global-scoped exception filter and module errors (errors and business-errors) with controller-scoped exception filters. Both responsible for the i18n
- [x] i18n (fully handled by the presentation layer)
  - [x] Type safety
  - [x] DTO translations
- [ ] Serverless adapter example
- [ ] Add user reset password module
- [x] Add some module to interact with user (such as course or quizzes)
- [x] Auth module with passport
- [x] Validate request user permissions when calling a method (for example, an admin user cannot enroll at a course)
- [x] Add base user roles such as Admin, Student and Instructor
- [x] Environment service
- [x] Add JWT Secret
- [ ] Translate Auth error messages
- [ ] Translate role guard error messages
- [x] SWC
