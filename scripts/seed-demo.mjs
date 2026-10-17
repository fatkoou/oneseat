// Creates a few demo events (with seats) through the API.
// Usage, from the repo root with the backend running:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=your-password node scripts/seed-demo.mjs

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const SEAT_LAYOUT = {
  sections: [
    { name: 'Floor', rows: ['A', 'B', 'C', 'D', 'E', 'F'].map((label) => ({ label, seatCount: 10 })) },
    { name: 'Balcony', rows: ['A', 'B', 'C', 'D'].map((label) => ({ label, seatCount: 10 })) },
  ],
};

// Dates are relative to today, so the events stay upcoming.
// The last one is in the past on purpose, to see how past events look.
const DEMO_EVENTS = [
  {
    title: 'Late Jazz Sessions',
    description: 'An evening of small-group jazz in a room built for listening. Three sets, with short breaks in between.',
    location: 'Studio 5, Prishtina',
    daysFromNow: 9,
    time: '21:00',
  },
  {
    title: 'Autumn Strings',
    description: 'A string quartet plays works for the season.',
    location: 'Orange Hall, Prizren',
    daysFromNow: 17,
    time: '19:30',
  },
  {
    title: 'The Quiet Room',
    description: 'A one-act play for a small audience.',
    location: 'Little Theatre, Peja',
    daysFromNow: 21,
    time: '20:00',
  },
  {
    title: 'Open Mic Finals',
    description: 'The finalists of this season perform back to back.',
    location: 'Studio 5, Prishtina',
    daysFromNow: 29,
    time: '20:30',
  },
  {
    title: 'Short Documentaries',
    description: 'Five short documentaries, one screening.',
    location: 'Orange Hall, Prizren',
    daysFromNow: 38,
    time: '18:00',
  },
  {
    title: 'Winter Brass',
    description: 'A brass ensemble with a winter programme.',
    location: 'Little Theatre, Peja',
    daysFromNow: 52,
    time: '19:00',
  },
  {
    title: 'Open Air Cinema',
    description: 'A summer screening by the river.',
    location: 'Riverside Stage, Peja',
    daysFromNow: -12,
    time: '21:30',
  },
];

async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`${method} ${path} failed with ${response.status}: ${await response.text()}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function startsAtFor({ daysFromNow, time }) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

async function generateSeats(event, token) {
  try {
    const { created } = await api(`/events/${event.id}/seats/generate`, { method: 'POST', token, body: SEAT_LAYOUT });
    console.log(`  created ${created} seats`);
  } catch (error) {
    if (error.status !== 409) throw error;
    console.log('  already has seats, skipped');
  }
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD first.');
    process.exit(1);
  }

  const { access_token: token } = await api('/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  const existingEvents = await api('/events');

  for (const demo of DEMO_EVENTS) {
    console.log(demo.title);

    let event = existingEvents.find((existing) => existing.title === demo.title);
    if (event) {
      console.log('  event already exists');
    } else {
      const { title, description, location } = demo;
      event = await api('/events', {
        method: 'POST',
        token,
        body: { title, description, location, startsAt: startsAtFor(demo) },
      });
      console.log('  created event');
    }

    await generateSeats(event, token);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
