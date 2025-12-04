# React Form Builder

A responsive and interactive Form Builder application built with React, Tailwind CSS, and Zustand. This application allows users to create custom forms with a wide variety of field types, configure them with advanced settings (including validation and conditional logic), and preview the final result.



## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: React Datepicker
- **Routing**: React Router DOM

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd FormBuilder
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Design Approach

- **Component-Based Architecture**: The application is structured into reusable components (e.g., `FieldConfigEditor`, `BuilderDatePicker`, individual field components in `src/components/fields`).
- **Separation of Concerns**:
  - **Builder**: Handles the configuration and layout of the form.
  - **Preview**: Handles the rendering and validation of the final form.
  - **Store**: `useFormStore` manages the global state of forms, fields, and configurations.
- **Semantic Styling**: Uses Tailwind CSS with CSS variables (e.g., `--primary`, `--background`) to support dynamic theming and dark mode seamlessly.
- **Validation Strategy**: Centralized validation logic in `src/utils/validation.js` ensures consistency between the builder and the preview.

## Project Structure

- `src/components/builder`: Components for the form builder interface (sidebar, field list, config editor).
- `src/components/fields`: Individual form field components used in the preview.
- `src/components/ui`: Reusable UI components (modals, buttons, etc.).
- `src/store`: Zustand store for state management.
- `src/utils`: Utility functions for validation, colors, and rules.
- `src/pages`: Main page views (Home, Builder, Preview).
