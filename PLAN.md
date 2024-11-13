# Implementation Plan: Luna AI Health Insights

## Phase 1: Symptom Tracking (Core Feature)
### Database Updates
```typescript
// Update User Model (models/user.ts)
interface Symptom {
  date: Date;
  category: 'physical' | 'emotional' | 'other';
  type: string;
  severity: 1 | 2 | 3; // 1 = mild, 2 = moderate, 3 = severe
  notes?: string;
}

// Add to user schema
symptoms: [{
  date: { type: Date, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: Number, required: true },
  notes: String
}]
```

### UI Components
1. Quick Symptom Logger
```typescript
// components/symptom-tracker.tsx
interface SymptomOption {
  label: string;
  category: 'physical' | 'emotional' | 'other';
  icon: LucideIcon;
}

const COMMON_SYMPTOMS: SymptomOption[] = [
  { label: 'Cramps', category: 'physical', icon: Activity },
  { label: 'Headache', category: 'physical', icon: Thermometer },
  { label: 'Mood Changes', category: 'emotional', icon: Heart },
  { label: 'Fatigue', category: 'physical', icon: Battery },
  { label: 'Bloating', category: 'physical', icon: Circle },
  // Add more common symptoms
];
```

2. Symptom History View
```typescript
// components/symptom-history.tsx
interface SymptomHistoryProps {
  symptoms: Symptom[];
  onDelete: (symptomId: string) => void;
  onEdit: (symptom: Symptom) => void;
}
```

## Phase 2: Insights Display Component
### AI Integration
```typescript
// lib/gemini-client.ts
interface InsightRequest {
  symptoms: Symptom[];
  cycleData: {
    phase: string;
    day: number;
    regularity: string;
  };
  preferences: UserPreferences;
}

async function generateInsights(data: InsightRequest): Promise<AIInsights> {
  // Gemini API integration
  // Returns structured health recommendations
}
```

### UI Components
1. Daily Insights Card
```typescript
// components/insights-card.tsx
interface InsightsCardProps {
  insights: AIInsights;
  onAction: (actionType: string) => void;
}
```

2. Detailed Insights Modal
```typescript
// components/detailed-insights.tsx
interface DetailedInsightsProps {
  insights: AIInsights;
  symptoms: Symptom[];
  cycleData: CycleData;
}
```

## Phase 3: Cultural Context & Preferences
### Database Updates
```typescript
// Add to user schema
preferences: {
  cultural: {
    region: String,
    language: String,
    dietary: [String],
    practices: [String]
  },
  notifications: {
    frequency: String,
    channels: [String],
    types: [String]
  }
}
```

### UI Components
1. Preferences Form
```typescript
// components/preferences-form.tsx
interface PreferencesFormProps {
  currentPreferences: UserPreferences;
  onUpdate: (prefs: UserPreferences) => void;
}
```

## Phase 4: Health Check-ins
### Notification System
```typescript
// lib/notifications.ts
interface HealthCheckReminder {
  type: 'daily' | 'weekly' | 'phase-based';
  questions: CheckInQuestion[];
  lastCompleted?: Date;
}
```

### UI Components
1. Check-in Modal
```typescript
// components/health-checkin.tsx
interface HealthCheckInProps {
  questions: CheckInQuestion[];
  previousAnswers?: CheckInAnswers;
  onSubmit: (answers: CheckInAnswers) => void;
}
```

## Development Timeline

### Week 1: Core Symptom Tracking
- Day 1-2: Database schema updates & API endpoints
- Day 3-4: Basic symptom logging UI
- Day 5: Symptom history view
- Day 6-7: Testing & refinement

### Week 2: AI Insights Integration
- Day 1-2: Gemini API integration
- Day 3-4: Insights display components
- Day 5: AI response parsing & formatting
- Day 6-7: Testing & optimization

### Week 3: Cultural Context & Polish
- Day 1-2: Preferences system
- Day 3-4: Cultural adaptations
- Day 5: Health check-in system
- Day 6-7: Final testing & demo preparation

## API Endpoints

```typescript
// New API routes to add:
POST /api/symptoms
- Add new symptom entry

GET /api/symptoms
- Get user's symptom history

POST /api/preferences
- Update user preferences

POST /api/insights
- Generate AI insights

POST /api/checkin
- Submit health check-in
```

## Priority Features for MVP (Minimum Viable Product)

1. Essential Symptom Tracking
   - Basic symptom logging
   - Common symptoms list
   - Severity tracking

2. Basic AI Insights
   - Daily recommendations
   - Phase-based advice
   - Simple presentation

3. Minimal Preferences
   - Language preference
   - Dietary restrictions
   - Basic cultural context

4. Simple Check-ins
   - Daily mood tracking
   - Physical symptoms
   - Basic reminders

### Calendar

Showcase the bleeding week
- slider to show amount of blood

Shades of red - prediction && truth
Add other 3 phases diff colors
DB call for symptompts per day 
 -> pop up for info

 