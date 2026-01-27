# **App Name**: FreezerFriend

## Core Features:

- Google Authentication: Secure user authentication using Google OAuth2 via Firebase Authentication, providing a seamless login experience.
- Food Item Management: Create, read, and paginate food items with details such as name, frozen date, weight, and photo.
- Image Upload and Storage: Upload and store food item images using Firebase Storage, with client-side compression and resizing for optimized performance.
- Paginated Data Fetching: Efficiently retrieve food items from Firestore using a cursor-based pagination system via Next.js API routes.
- Item Details: Display the item details such as name, frozen date, weight, and photo.
- View Toggle: Allow users to switch between grid and list views for displaying food items.

## Style Guidelines:

- Primary color: Light blue (#90CAF9) to evoke a sense of cleanliness and freshness associated with food storage.
- Background color: Very light gray (#F5F5F5), providing a neutral backdrop for food items to stand out.
- Accent color: Soft orange (#FFCC80), used sparingly for interactive elements like buttons to draw attention without overwhelming the user.
- Font pairing: 'Inter' (sans-serif) for body text and headlines, providing a modern and readable experience.
- Code font: 'Source Code Pro' for displaying code snippets.
- Minimalist design with a modular grid system for responsive display of food items.
- Loading skeletons in the grid to represent the loading UX state.
- Simple, intuitive icons for actions like adding or viewing food items, ensuring clarity and ease of use.