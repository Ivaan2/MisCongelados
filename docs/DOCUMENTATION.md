# FreezerFriend Detailed Documentation

This document provides a deep dive into the project structure, components, and logic of the FreezerFriend application.

## Project Structure

The project follows a standard Next.js App Router structure.

```
.
├── src
│   ├── app
│   │   ├── login/page.tsx      # Login page
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main homepage
│   │
│   ├── components
│   │   ├── ui/                 # Reusable ShadCN UI components
│   │   ├── freezer/            # Components specific to freezer management
│   │   │   ├── add-item-dialog.tsx
│   │   │   ├── item-card.tsx
│   │   │   ├── item-details-dialog.tsx
│   │   │   ├── item-grid.tsx
│   │   │   ├── item-list.tsx
│   │   │   └── item-row.tsx
│   │   ├── auth-provider.tsx   # Manages user authentication state
│   │   ├── bottom-navbar.tsx   # The main navigation bar at the bottom
│   │   ├── header.tsx          # The top application header
│   │   └── ...
│   │
│   ├── hooks
│   │   ├── use-auth.ts         # Hook to access authentication context
│   │   └── use-toast.ts        # Hook for showing toast notifications
│   │
│   ├── lib
│   │   ├── firebase.ts         # Firebase configuration and initialization
│   │   ├── placeholder-images.ts # Manages placeholder image data
│   │   ├── types.ts            # Core TypeScript types (FoodItem, Freezer)
│   │   └── utils.ts            # Utility functions (e.g., `cn` for classnames)
│   │
│   └── ...
│
├── public/                   # Static assets
└── ...                       # Config files (next.config.js, tailwind.config.ts, etc.)
```

## Key Components

### `app/page.tsx`
This is the main entry point for the user interface. It acts as the container component that manages the primary state for the application, including:
- The list of available freezers (`freezers`).
- The currently selected freezer (`currentFreezerId`).
- The current view mode (`view`: 'grid' or 'list').
- The current search query (`searchQuery`).
- The visibility of the "Add Item" dialog (`isAddDialogOpen`).

### `components/bottom-navbar.tsx`
This is the primary interaction hub for the user. It contains:
- **User Menu**: An avatar button that opens a dropdown to show user info, a logout button, and a sub-menu to switch between freezers.
- **Search Input**: A filter for the item list.
- **View Toggle**: Buttons to switch between the grid and list views.
- **Add Item Button**: A camera icon button that opens the `AddItemDialog`.

### `components/freezer-content.tsx`
This component is responsible for rendering the list of items for the currently selected freezer.
- It fetches and filters the items based on the `currentFreezerId` and `searchQuery` props.
- It conditionally renders either the `<ItemGrid />` or `<ItemList />` component based on the `view` prop.
- It also displays a message when the freezer is empty or when no search results are found.

### `components/freezer/add-item-dialog.tsx`
A dialog form for adding new items.
- Uses `react-hook-form` and `zod` for form validation.
- Fields include name, description, freezer box, and an optional photo.
- On submit, it uploads the photo to Firebase Storage (if provided) and creates a new document in the `foodItems` collection in Firestore.

### `components/auth-provider.tsx`
A client-side component that wraps the application to provide authentication context.
- It listens for changes in Firebase Auth state.
- It protects routes and redirects users between the login page and the main app based on their authentication status.
- It provides the `user` object to the rest of the app via the `useAuth` hook.

## Data Flow

1.  **State Management**: The main state is held in `app/page.tsx` and passed down to child components via props.
2.  **Authentication**: `AuthProvider` listens to Firebase and provides the user's auth status. When a user signs in via the `/login` page, the provider automatically redirects them to the home page.
3.  **Item Display**: `FreezerContent` receives the current freezer ID and search query, filters the `mockItems` data, and renders the appropriate view.
4.  **Item Creation**: The "Add" button in `BottomNavbar` toggles state in `app/page.tsx`, which opens `AddItemDialog`. The dialog handles its own form state and, upon successful submission, writes directly to Firebase and then calls a callback (`onItemAdded`) to signal the parent to refresh its data.
5.  **Item Deletion**: Clicking the delete button in `ItemRow` or `ItemDetailsDialog` triggers a callback that filters the item out of the state in `FreezerContent`.

## Customization

### Changing the Color Palette
The color palette is defined using CSS variables in `src/app/globals.css`. You can change the HSL values for `--primary`, `--secondary`, `--accent`, etc., to quickly reskin the application.

```css
@layer base {
  :root {
    --background: 0 0% 96%;
    --primary: 210 90% 55%; /* Change this for a new primary color */
    --accent: 195 91% 85%;  /* Change this for a new accent color */
    /* ...etc. */
  }
}
```

### Changing Freezer Names
The list of available freezers is currently hard-coded in `src/app/page.tsx`. You can edit the `freezers` state array to change their names or add more.

```tsx
// in src/app/page.tsx
const [freezers, setFreezers] = useState<Freezer[]>([
  { id: 'freezer1', name: 'Kitchen Freezer' }, // Customize this name
  { id: 'freezer2', name: 'Garage Deep Freeze' } // Customize this name
]);
```

### Firebase Configuration
The Firebase connection details are managed in `src/lib/firebase.ts`. These should be populated from environment variables for security. Create a `.env.local` file in the root of your project and add your Firebase project's configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```
