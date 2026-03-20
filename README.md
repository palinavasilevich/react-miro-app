# 🧩 Miro Clone

A Miro-inspired boards application for creating and managing interactive workspaces.  
The project focuses on scalable frontend architecture, reusable UI components, and clean separation of concerns.

---

## ✨ Overview

This application allows users to work with boards, visualize content, and interact with elements in a flexible and intuitive interface.

Built with a strong emphasis on **modularity and scalability**, the project uses Feature-Sliced Design (FSD) to organize code by business logic rather than technical layers.

---

## ⚙️ Features

- 📋 **Board content rendering**  
  Display cards, notes, and other board elements with support for different view modes (grid / list)

- ➕ **Create new boards**  
  Users can create boards via UI with proper state initialization and rendering

- 🔄 **User interactions**  
  Select, edit, and delete board elements

- 🧠 **UI state management**  
  Handle selection, view modes, and UI-driven state

- 🧩 **Component composition**  
  Flexible layout system using reusable UI blocks (header, sidebar, filters, list)

- 🔗 **API integration**  
  Ability to sync external data (e.g., GitHub issues → board cards)

- ⚡ **Async operations**  
  Full CRUD support with loading and state handling

---

## 🏗 Architecture

The project is built using **Feature-Sliced Design (FSD)**:

src/
├── app/          # app initialization, providers
├── features/   # user actions (create board, edit, etc.)
├── lib/        # helper functions, services, API utilities
├── shared/     # reusable components, UI blocks, and utilities

### Why this matters:

- 📦 Clear separation of responsibilities  
- 🔁 High reusability of components  
- 📈 Easy scalability for new features  
- 🧠 Better maintainability of large codebases  

---

## 🛠 Tech Stack

- React
- TypeScript
- Tailwind CSS 
- Zustand
- React Hook Form
- Zod
- TanStack React Query
