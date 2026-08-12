# Frontend Implementation Plan: Fake News Detection Dashboard

This plan outlines the architecture, component structure, and design translation to build the frontend application according to the premium SaaS HR dashboard reference, integrating exclusively with the existing FastAPI backend.

## User Review Required

> [!IMPORTANT]
> - The UI will heavily utilize the existing theme variables (peach, beige, navy, orange) defined in `index.css` to construct the "light glassmorphism" aesthetic.
> - I will introduce a `DashboardLayout` component containing a fixed Sidebar and Header.
> - The `lucide-react` library will be used for all minimal icons.
> - Do you want the `History` and `Settings` pages to just show static empty/placeholder states for now since there are no backend APIs for them? (I will assume yes based on the requirements).

## Proposed Architecture & Structure

### 1. Global Styles & Theme (`src/index.css`)
- Enhance the `.glass-card` utility if necessary.
- Add specific `.dark-feature-card` utilities for the charcoal contrast card.
- Add micro-animations (fade-in, subtle hovers).

### 2. Layout Components (`src/components/layout/`)
- **`DashboardLayout.jsx`**: A wrapper component for all authenticated routes. Includes the Sidebar (left) and Header (top), with a spacious main content area.
- **`Sidebar.jsx`**: Vertical navigation. Translucent glass appearance, rounded active state, dark navy text, and lucide icons.
- **`Header.jsx`**: Simple top bar with page title and user/status indicator ("AI Verification").

### 3. Core UI Components (`src/components/ui/`)
- **`GlassCard.jsx`**: Reusable container applying the standard frosted glass styling.
- **`Button.jsx`**: Updated to support loading states, warm orange accent, and subtle hover lifts.
- **`PageHeader.jsx`**: Standardized large dark navy heading with comfortable spacing.

### 4. ML Analyzer Components (`src/components/analyzer/`)
- **`NewsAnalyzer.jsx`**: The main input form for headline and article text.
- **`PredictionCard.jsx`**: Displays the final FAKE/REAL result with semantic colors (coral/green) and a progress-bar-style `ConfidenceBar.jsx`.
- **`ExplanationCard.jsx`**: Displays the `reason` returned from the API in a clean white glass card.
- **`FeatureInfluence.jsx`**: Maps the `important_phrases` into elegant chips/tags and compact horizontal bars to show contribution magnitude and direction.
- **`ModelInfoCard.jsx`**: The dark charcoal feature card detailing the ML pipeline (TF-IDF -> Logistic Regression).

### 5. Pages (`src/pages/`)
- **`Dashboard.jsx`**: Main landing. Displays static system properties (ML Model, Vocabulary, Features) and acts as an entry point.
- **`Analyze.jsx`**: The core ML prediction page containing the `NewsAnalyzer` and result components in a 2-column layout.
- **`History.jsx`**: Placeholder empty state ("No analyses yet").
- **`HowItWorks.jsx`**: A visually rich, card-based explanation of the 5-step ML process.
- **`Settings.jsx`**: Simple placeholder.

### 6. API Integration (`src/services/api.js`)
- Add `analyzeNews(title, text)`, `getHealth()`, and `getModelInfo()` functions calling the FastAPI endpoints.
- Error handling logic to extract safe messages for the UI.

## Verification Plan

### Manual Verification
1. Open the application and navigate through all sidebar links.
2. Verify the aesthetic strictly matches the light glassmorphism HR dashboard reference (warm ambient background, soft shadows, rounded corners, no harsh borders).
3. Test the `Analyze` page by entering text and verifying the loading state, successful prediction rendering (Confidence, Reason, Important Phrases), and error handling for empty inputs.
4. Test responsiveness by resizing the window to ensure the layout collapses gracefully.
