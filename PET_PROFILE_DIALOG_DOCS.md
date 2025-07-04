# Pet Profile Dialog Component

## Overview

The `PetProfileDialog` component is a modern, non-intrusive dialog that displays both pet profile information and allows users to send breeding match requests. It integrates with the backend Match entity to create proper breeding requests with user and pet relationships.

## Features

### 🐕 Pet Profile Tab
- **Pet Image**: Full-width hero image with overlay information
- **Basic Info**: Name, breed, age, location with animal type emoji
- **Status Badges**: Health verification, gender, and animal type
- **Owner Information**: Avatar, name, ratings, and reviews
- **Health & Physical**: Weight, height, health status, last vet visit
- **Breeding Information**: Experience, last breeding, genetic testing, registrations
- **Temperament**: Personality traits displayed as badges

### 📧 Request Match Tab
- **User Information**: Displays current user's details (from auth context)
- **Owner Information**: Shows pet owner's contact information
- **Pet Selection**: Smart dropdown that shows:
  - ✅ **Compatible pets** (same species, opposite gender) - highlighted in green
  - ❌ **Incompatible pets** (different species or same gender) - grayed out with reason
  - Compatibility requirements displayed in label
- **Breeding Validation**: Automatic validation before sending request:
  - Same animal species (dog-to-dog, cat-to-cat, etc.)
  - Opposite genders (male-to-female or female-to-male)
  - Complete gender information for both pets
- **Message Field**: Required message to the pet owner
- **Match Request**: Creates a proper Match entity in the backend (only if validation passes)

## Breeding Compatibility Rules

The component enforces these breeding rules before allowing match requests:

### ✅ **Valid Matches**
- Same species: Dog + Dog, Cat + Cat, etc.
- Opposite genders: Male + Female
- Complete gender data for both pets

### ❌ **Invalid Matches**  
- Different species: Dog + Cat ❌
- Same gender: Male + Male or Female + Female ❌
- Missing gender information ❌

### 🎯 **Visual Indicators**
- Compatible pets show with green checkmark ✅
- Incompatible pets are disabled with reason (Different species, Same gender, etc.)
- Warning message if no compatible pets found
- Requirements shown in dropdown label

## Backend Integration

The component creates Match requests using the backend Match entity structure:

```typescript
// Match request payload
{
  requesterPetId: string,    // Current user's selected pet
  recipientPetId: string,    // The pet they want to breed with
  message: string           // Message to the owner
}
```

The backend automatically:
- Sets the requester to the current authenticated user
- Sets the recipient to the pet's owner
- Creates relationships to both pets
- Sets status to PENDING
- Includes the user's message

## Design Features

- **Modern UI**: Gradient backgrounds, glassmorphism effects
- **Responsive**: Works on mobile and desktop
- **Non-intrusive**: Maximum 90% viewport height, centered modal
- **Smooth Animations**: Framer Motion animations for open/close
- **Accessible**: Keyboard navigation, proper ARIA attributes
- **Type Safe**: Full TypeScript integration with pet types
- **Real API Integration**: Uses actual match request API endpoints

## User Flow

1. User clicks "View Profile & Request Match" on any pet card
2. Dialog opens showing pet profile information
3. User switches to "Request Match" tab
4. System displays current user info (no manual entry needed)
5. System loads user's pets and evaluates compatibility
6. Compatible pets shown in green, incompatible pets grayed out with reasons
7. User selects a compatible pet from dropdown
8. User writes a message to the pet owner
9. System validates: same species + opposite gender + complete data
10. If validation passes, match request sent to backend
11. Backend creates Match entity with PENDING status
12. Pet owner receives notification of the match request

## Validation Process

Before sending any match request, the system validates:

```typescript
// Species compatibility check
selectedMyPet.animal === targetPet.animal

// Gender compatibility check  
normalizeGender(selectedMyPet.gender) !== normalizeGender(targetPet.gender)

// Data completeness check
selectedMyPet.gender && targetPet.gender
```

**Error Messages:**
- Species mismatch: "Breeding is only allowed between pets of the same species..."
- Gender mismatch: "Breeding requires pets of opposite genders..."  
- Missing data: "Pet gender information is missing..."

## API Integration

The component uses these API endpoints:

- `GET /pets/users/{username}` - Fetch current user's pets
- `POST /matches` - Create new match request

## Dependencies

- `framer-motion`: For smooth animations
- `@radix-ui/react-avatar`: For owner avatars
- `@radix-ui/react-select`: For pet selection dropdown
- `lucide-react`: For icons
- Custom UI components from `@/components/ui/`

## File Location

`src/components/PetProfileDialog.tsx`

## Connected Components

- `src/pages/Breeding.tsx` - Main integration point
- `src/utils/petUtils.ts` - Utility functions for animal/gender display
- `src/types/pet.ts` - TypeScript types for pet data structure
- `src/services/api.ts` - API integration for match requests

## Usage

```tsx
<PetProfileDialog
  open={showPetProfile}
  onClose={() => {
    setShowPetProfile(false);
    setSelectedPet(null);
  }}
  pet={selectedPet}
/>
```

The component is fully functional and integrates seamlessly with the backend Match entity system for proper breeding request management.
