# MisCongelados - APP

MisCongelados is a web application designed to help you keep your freezer organized. Never again wonder what's buried in the back of your freezer!

## Features

- **Item Tracking**: Easily add, view, and remove items from your freezer.
- **Detailed Information**: Store a name, description, freezer box location, and even a photo for each item.
- **Dual Views**: Switch between a visual grid view and a compact list view to see your items.
- **Search & Filter**: Quickly find what you're looking for with a real-time search filter.
- **Multi-Freezer Support**: Organize items across multiple freezers (e.g., "Kitchen Freezer" and "Garage Deep Freeze").
- **Authentication**: Securely sign in with your Google account.
- **Responsive Design**: Works beautifully on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Cloud Storage)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

The project is set up to run in a development environment.

1.  **Dependencies**: Dependencies are managed by `npm`.
2.  **Running the App**: To start the development server, run `npm run dev`.
3.  **Firebase Setup**: The application is configured to connect to a Firebase project. Ensure your environment variables for the Firebase configuration are set up in a `.env.local` file.

## Project Structure

For a detailed breakdown of the project structure, components, and logic, please see the [DOCUMENTATION.md](docs/DOCUMENTATION.md) file.

## Documentacion tecnica

- [Networking_Diagram](docs/Networking_Diagram.md)
- [SOFTWARE_DESIGN_DIAGRAM](docs/SOFTWARE_DESIGN_DIAGRAM.md)

## Deploy (Google App Hosting)

El despliegue recomendado es **Google App Hosting (Firebase App Hosting)** para maximizar la integración con Firebase (Auth, Firestore y, si se usa, Storage) y aprovechar SSR con escalado serverless.

Pasos a alto nivel:
1. Conecta el repositorio a App Hosting.
2. Mantén `apphosting.yaml` en la raíz y ajusta los parámetros de ejecución.
3. Configura variables y secretos del Admin SDK en el panel de App Hosting.
4. Activa despliegues automáticos desde la rama principal.

## Justificación técnica de las decisiones

- **Firestore (NoSQL, schemaless)**: permite guardar el estado de congeladores sin rigidez de esquema y evolucionar el modelo con facilidad.
- **Serverless + pago por uso**: reduce infraestructura, acelera time‑to‑market y mantiene costes bajos en un proyecto open‑source.
- **Objetivo de producto**: recordatorio de alimentos para evitar abrir el congelador y romper la cadena de frío.
- **Google OAuth2**: login sin fricción y datos asociados al UID. La UI parte de dos congeladores por defecto por usuario y la API evita acceso a congeladores ajenos.
