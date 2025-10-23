# AI Expense Tracker - Web Version

🎙️ Voice-powered expense tracking web application with AI parsing using Google Gemini.

## Features

- 🎤 **Voice Input** - Speak your expenses naturally
- 🤖 **AI Parsing** - Automatic extraction of amount, category, and description
- 📊 **Analytics Dashboard** - Visual insights into your spending
- 💾 **Local Storage** - All data stored in your browser
- 📱 **Responsive Design** - Works on desktop and mobile

## Quick Start

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

### Voice Input
1. Click the **"Voice Input"** tab
2. Click the microphone button
3. Say something like: "I spent 50 dollars on lunch today"
4. The AI will automatically parse and fill in the details
5. Review and submit

### Manual Entry
1. Click the **"Manual Entry"** tab
2. Fill in the amount, category, description, and date
3. Click "Add Expense"

### View Expenses
- Click the **"Expenses"** tab to see all your transactions
- Delete expenses by clicking the trash icon

### Analytics
- Click the **"Dashboard"** tab to see:
  - Total spending
  - Monthly spending
  - Category breakdown (pie chart)
  - Recent spending trends (bar chart)

## Browser Compatibility

**Voice Recognition requires:**
- Google Chrome (recommended)
- Microsoft Edge
- Safari (limited support)

**Note:** Firefox does not support Web Speech API for voice recognition.

## Technologies Used

- **React** - UI framework
- **Gemini AI** - Expense parsing
- **Recharts** - Data visualization
- **Web Speech API** - Voice recognition
- **LocalStorage** - Data persistence

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

## Deploy

You can deploy to:
- **Netlify** - Drag and drop the `build` folder
- **Vercel** - Connect your GitHub repo
- **GitHub Pages** - Use `gh-pages` package

## API Key

The Gemini API key is embedded in the code for demo purposes. For production:
1. Move the API key to environment variables
2. Create `.env` file with `REACT_APP_GEMINI_API_KEY=your_key`
3. Update the service to use `process.env.REACT_APP_GEMINI_API_KEY`

## License

MIT License - Free for hackathon and personal use
