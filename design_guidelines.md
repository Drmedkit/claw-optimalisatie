# FLIP Amsterdam Design Guidelines - Energy Label Service Platform

## Design Approach
**Utility-Focused Design System**: This is a professional service platform requiring efficiency, clarity, and trust. Following a refined design system approach with custom Amsterdam-themed elements.

## Core Design Principles
- **Professional Trust**: Clean, credible presentation for regulatory services
- **Guided Flow**: Clear step-by-step progression through calculator
- **Local Identity**: Amsterdam visual language throughout
- **Efficiency First**: Minimal friction, maximum clarity

## Color Palette

### Light Mode (Primary)
- **Primary Brand**: 84 75% 55% (Lime green - energetic, sustainable)
- **Background**: 40 15% 98% (Warm off-white #FAF9F7)
- **Surface**: 0 0% 100% (Pure white for cards)
- **Text Primary**: 0 0% 10% (Near black)
- **Text Secondary**: 0 0% 45% (Medium gray)
- **Border**: 0 0% 90% (Subtle borders)
- **Accent Hover**: 84 75% 65% (Lighter lime on interaction)

### Dark Mode (Optional Support)
- **Background**: 0 0% 4%
- **Surface**: 0 0% 10%
- **Primary**: Same lime green maintains visibility
- **Text**: 0 0% 98%

## Typography

**Font System**: Inter (already configured)
- **Headings**: Font-weight 600-700, tight tracking
- **Body**: Font-weight 400, comfortable line-height 1.6
- **UI Elements**: Font-weight 500 for buttons and labels

**Scale**:
- Hero H1: text-4xl lg:text-5xl (36-48px)
- Section H2: text-3xl (30px)
- Card H3: text-xl (20px)
- Body: text-base (16px)
- Small: text-sm (14px)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16, 20, 24 for consistency
- Section padding: py-16 md:py-24
- Card padding: p-6 md:p-8
- Component gaps: gap-4 or gap-6
- Button padding: px-6 py-3

**Container Strategy**:
- Max-width: max-w-7xl for full sections
- Content max-width: max-w-4xl for calculator
- Centered: mx-auto with responsive px-4 md:px-6

**Grid Patterns**:
- Calculator options: 2-column md:4-column for size selection
- Feature cards: 1-column md:2-column layouts
- Mobile-first: Always stack to single column on mobile

## Component Library

### Navigation
- Transparent overlay on hero with white text
- Center-aligned with brand name above nav links
- Font-light tracking-wide for links
- Active state: text-lime-300 or underline
- Hover: text-white transition

### Hero Section
- **Full viewport height** with Amsterdam canal imagery
- Dark overlay (bg-black/50) for text readability
- Centered content with max-w-4xl
- H1 + subtitle pattern
- Image: Professional Amsterdam canal with historic architecture

### Calculator Cards
- White background with border-2 border-lime-200
- Rounded-2xl for modern feel
- Lime-50 header backgrounds
- Shadow-2xl for depth
- Stepped progression (Step 1, 2, 3)
- Active state: border-lime-500 bg-lime-50 with shadow-lg
- Transition-all duration-300 for smooth interactions

### Buttons
- Primary: bg-lime-500 text-white hover:bg-lime-600
- Large sizing: h-12 md:h-14 px-8
- Rounded-xl for consistency with cards
- Font-semibold with tracking-wide
- Minimum touch target: 44px mobile

### Selection Cards
- Grid layouts with border-2 states
- Icons above text (Home, Camera icons from lucide-react)
- Selected: lime-500 border with lime-50 background
- Hover: border-lime-500 with subtle shadow
- Price display below option label

### Forms & Inputs
- 16px font-size to prevent iOS zoom
- Rounded-lg borders
- Focus: ring-2 ring-lime-500
- Labels: font-medium text-gray-700

## Visual Elements

### Icons
- **Library**: Lucide React (already implemented)
- **Usage**: Calculator, Home, Camera, Zap, Check icons
- Size: w-6 h-6 for buttons, w-8 h-8 for card headers
- Color: Inherit from parent or lime-500

### Images
- **Hero Image**: Amsterdam canal with historic tower (provided: amsterdam-canal-with-tower.jpg)
- **Style**: Professional photography, warm tones
- **Treatment**: Dark overlay for text contrast
- **Additional**: Social proof imagery, team photos if needed

### Animations
**Minimal & Purposeful**:
- Intersection Observer scroll reveals (translate-y-8 opacity-0 to visible)
- Transition duration: 700ms ease-out for scroll effects
- Hover transitions: 300ms for buttons and cards
- NO complex or distracting animations
- Pause on hover for any auto-scrolling elements

## Accessibility & UX

### Touch Targets
- Minimum 44x44px on mobile
- Generous padding on all interactive elements
- Clear visual feedback on interaction

### Contrast
- Maintain WCAG AA standards
- Lime green passes on white backgrounds
- Dark overlays ensure text readability on images

### Responsive Behavior
- Mobile: Single column, stacked layouts, larger touch targets
- Tablet: 2-column grids where appropriate
- Desktop: Multi-column layouts with max-width constraints
- Smooth scrolling for calculator navigation

## Page-Specific Guidelines

### Pricing Calculator Page
- Full-height hero with background image
- Calculator section: max-w-4xl centered card
- Progressive disclosure: Show steps as selections are made
- Price display: Large, prominent, updates in real-time
- CTA: "Nu bestellen" button navigates with state parameters

### Visual Hierarchy
1. Hero message (largest)
2. Calculator card (prominent, elevated)
3. Step headers (clear progression)
4. Options (equal weight within steps)
5. Price summary (bold, lime-500 color)

## Brand Voice Through Design
- **Professional yet Approachable**: Clean lines with warm colors
- **Amsterdam Identity**: Canal imagery, local references
- **Sustainable Focus**: Green accents reinforce energy efficiency theme
- **Service Excellence**: Polished UI communicates quality

## Implementation Notes
- Use existing shadcn/ui components (Button, Card) as foundation
- Maintain consistent lime green (#84cc16) throughout
- Background: #FAF9F7 for warmth vs stark white
- Intersection Observer for scroll animations
- Mobile-first responsive patterns
- No gratuitous animations - functionality over flair