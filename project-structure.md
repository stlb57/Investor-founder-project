# SignalFund Project Structure

```
signalfund/
├── frontend/                 # Next.js application
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   ├── timeline/        # Timeline visualization
│   │   ├── scoring/         # Score displays
│   │   └── auth/            # Authentication
│   ├── pages/
│   │   ├── public/          # Landing pages
│   │   ├── auth/            # Login/signup
│   │   ├── investor/        # Investor dashboard
│   │   └── startup/         # Startup dashboard
│   └── lib/                 # Utilities, API clients
├── backend/                 # FastAPI application
│   ├── api/                 # API routes
│   ├── models/              # Database models
│   ├── ml/                  # ML scoring logic
│   ├── auth/                # Authentication
│   └── db/                  # Database setup
└── database/                # SQL schemas
```