# Cojiro

(formerly ZOoTR Sim)

Simulate and practice Ocarina of Time Randomizer seeds

Assuming the last commit is more than ~2 minutes old, the `main` branch of this repo has parity with the [cojiro.christianlegge.dev](https://cojiro.christianlegge.dev) deployment.

## Postgres setup

This project uses [PostgreSQL](https://www.postgresql.org) to store seed data, playthroughs, and user information. You'll need a running Postgres server to run Cojiro locally.

### Quick Option: Docker
If you have Docker installed, this is the fastest way to get started:
```bash
docker run -d \
  --name cojiro-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=cojiro \
  -p 5432:5432 \
  postgres:15
```

### Manual Installation

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create the database
createdb cojiro
```

**Windows:**
1. Download the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer (remember the password you set!)
3. Open SQL Shell (psql) or pgAdmin and create a database named `cojiro`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create the database
sudo -u postgres createdb cojiro
```

### Configure your `.env`

Update your `.env` file with the connection string. The format is:
```
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Example for local development:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/cojiro?schema=public
```

### Verify Connection

After setting up, verify your connection works:
```bash
npm run db:push
```

If you see "Your database is now in sync with your Prisma schema", you're all set!

## .env setup

Create a `.env` file in the project root with these required variables:

```.env
# Database connection (see Postgres setup above)
DATABASE_URL=postgresql://postgres:password@localhost:5432/cojiro?schema=public

# JWT secret for guest playthroughs (can be any random string)
JWT_SECRET=your-random-secret-here

# NextAuth configuration
NEXTAUTH_SECRET=another-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth providers (optional - only needed for user accounts)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

**Quick start:** Copy `.env.example` to `.env` and fill in the values. For local development, you only *need* `DATABASE_URL`, `JWT_SECRET`, and `NEXTAUTH_SECRET`. The OAuth providers are optional.

Generate OAuth credentials at:
- Discord: https://discord.com/developers/applications
- Google: https://console.cloud.google.com/apis/credentials
- Twitch: https://dev.twitch.tv/console/apps

## Generating Spoiler Logs

Cojiro needs OoT Randomizer spoiler logs to simulate seeds. Here's how to generate them:

### Option 1: Website (Easiest)
1. Visit [ootrandomizer.com](https://ootrandomizer.com/)
2. Configure your settings (or pick a preset)
3. **Important:** Enable `Create Spoiler Log` in the settings
4. Click "Generate Seed"
5. Download the `*_Spoilers.json` file
6. Upload it to Cojiro when starting a new playthrough

### Option 2: Desktop Application
1. Download the [OoT Randomizer GUI](https://github.com/OoTRandomizer/OoTRandomizer/releases)
2. Set your desired settings
3. Check "Create Spoiler Log"
4. Generate the seed
5. Find the spoiler log in your output folder (look for `*_Spoilers.json`)
6. Upload to Cojiro

### Requirements for Compatibility
- **Create Spoiler Log** must be enabled (required)
- **Shopsanity** should be set to "off" (recommended)
- **MQ Dungeons Mode** should be "vanilla" (recommended)
- **Triforce Hunt** should be disabled (recommended)
- **World Count** should be 1 (multiworld not supported yet)

The uploaded JSON file contains all item locations and hints needed for Cojiro to work.

## Running locally

Once you've set up Postgres and your `.env` file:

```bash
# Install dependencies
npm install
# or
yarn install

# Push the database schema
npm run db:push

# Start the development server
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### First Run Checklist
1. Postgres is running ✓
2. `.env` file created with correct `DATABASE_URL` ✓
3. `npm run db:push` completed successfully ✓
4. `npm run dev` starts without errors ✓

### Troubleshooting

**"Invalid environment variables" error:**
- Make sure your `.env` file exists and has all required variables
- Check that `DATABASE_URL` points to a running Postgres instance

**"Can't reach database" error:**
- Verify Postgres is running: `pg_isready` (macOS/Linux) or check Services (Windows)
- Check the password and port in your `DATABASE_URL`

**Port 3000 already in use:**
- Change the port: `PORT=3001 npm run dev`
- Or stop the process using port 3000
