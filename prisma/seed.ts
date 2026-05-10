import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean up
  await prisma.invoiceItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.note.deleteMany()
  await prisma.checklistItem.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.stop.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.user.deleteMany()
  await prisma.city.deleteMany()
  await prisma.activityTemplate.deleteMany()
  await prisma.communityPost.deleteMany()

  // Users
  const hashedPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  const james = await prisma.user.create({
    data: {
      name: 'James Carter',
      email: 'james@traveloop.com',
      password: hashedPassword,
      phone: '+1-555-0101',
      city: 'New York',
      country: 'USA',
      role: 'user',
    },
  })

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@traveloop.com',
      password: adminPassword,
      phone: '+1-555-0000',
      city: 'San Francisco',
      country: 'USA',
      role: 'admin',
    },
  })

  // Cities
  const cities = await Promise.all([
    prisma.city.create({ data: { name: 'Paris', country: 'France', region: 'Europe', costIndex: 3.2, popularity: 95, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' } }),
    prisma.city.create({ data: { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 2.8, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' } }),
    prisma.city.create({ data: { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 3.5, popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' } }),
    prisma.city.create({ data: { name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 3.0, popularity: 85, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' } }),
    prisma.city.create({ data: { name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 1.5, popularity: 88, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' } }),
    prisma.city.create({ data: { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 2.6, popularity: 87, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400' } }),
    prisma.city.create({ data: { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 3.0, popularity: 83, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' } }),
    prisma.city.create({ data: { name: 'New York', country: 'USA', region: 'Americas', costIndex: 4.0, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' } }),
    prisma.city.create({ data: { name: 'Singapore', country: 'Singapore', region: 'Asia', costIndex: 3.8, popularity: 89, imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400' } }),
    prisma.city.create({ data: { name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 3.5, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' } }),
  ])

  // Activity Templates
  await Promise.all([
    prisma.activityTemplate.create({ data: { name: 'Eiffel Tower Visit', type: 'sightseeing', cost: 25, duration: '3 hours', description: 'Visit the iconic iron tower', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Louvre Museum', type: 'sightseeing', cost: 17, duration: '4 hours', description: 'World\'s largest art museum', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Seine River Cruise', type: 'sightseeing', cost: 15, duration: '1.5 hours', description: 'Scenic boat tour along the Seine', imageUrl: 'https://images.unsplash.com/photo-1431274172761-fcdab704a114?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Colosseum Tour', type: 'sightseeing', cost: 16, duration: '3 hours', description: 'Ancient Roman amphitheater', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Vatican Museums', type: 'sightseeing', cost: 20, duration: '4 hours', description: 'Sistine Chapel and more', imageUrl: 'https://images.unsplash.com/photo-1568797629192-789acf8e4df3?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Pasta Making Class', type: 'food', cost: 65, duration: '3 hours', description: 'Learn to make authentic Italian pasta', imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Tokyo Tower', type: 'sightseeing', cost: 12, duration: '2 hours', description: 'Iconic red and white tower', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Tsukiji Market Tour', type: 'food', cost: 30, duration: '2 hours', description: 'Fresh sushi and street food', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Mount Fuji Day Trip', type: 'adventure', cost: 80, duration: '10 hours', description: 'Day trip to Japan\'s famous volcano', imageUrl: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Bali Paragliding', type: 'adventure', cost: 90, duration: '2 hours', description: 'Soar over rice terraces', imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Ubud Monkey Forest', type: 'sightseeing', cost: 8, duration: '2 hours', description: 'Sacred forest sanctuary', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Balinese Cooking Class', type: 'food', cost: 45, duration: '4 hours', description: 'Traditional Balinese cuisine', imageUrl: 'https://images.unsplash.com/photo-1564518025836-5c0b40fd5c86?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Sagrada Familia', type: 'sightseeing', cost: 26, duration: '2 hours', description: 'Gaudi\'s masterpiece cathedral', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Amsterdam Canal Tour', type: 'sightseeing', cost: 18, duration: '1.5 hours', description: 'Historic canal boat tour', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Rijksmuseum', type: 'sightseeing', cost: 22, duration: '3 hours', description: 'Dutch art and history museum', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Dubai Desert Safari', type: 'adventure', cost: 120, duration: '6 hours', description: 'Dune bashing and camel riding', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Burj Khalifa', type: 'sightseeing', cost: 35, duration: '2 hours', description: 'World\'s tallest building', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'Singapore Gardens by the Bay', type: 'sightseeing', cost: 28, duration: '3 hours', description: 'Futuristic botanical garden', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'New York Central Park Walk', type: 'sightseeing', cost: 0, duration: '2 hours', description: 'Iconic urban park', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' } }),
    prisma.activityTemplate.create({ data: { name: 'NYC Food Tour', type: 'food', cost: 75, duration: '3 hours', description: 'Pizza, bagels, and more', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' } }),
  ])

  // Trip 1: Paris & Rome Adventure (ongoing)
  const trip1 = await prisma.trip.create({
    data: {
      name: 'Paris & Rome Adventure',
      description: 'Exploring the best of Europe - art, food, and culture in Paris and Rome',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-20'),
      isPublic: true,
      status: 'ongoing',
      userId: james.id,
    },
  })

  const stop1 = await prisma.stop.create({
    data: {
      tripId: trip1.id,
      city: 'Paris',
      country: 'France',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-10'),
      budget: 2000,
      order: 1,
      description: 'City of lights - Eiffel Tower, Louvre, and amazing food',
    },
  })

  await prisma.activity.createMany({
    data: [
      { stopId: stop1.id, name: 'Eiffel Tower Visit', type: 'sightseeing', cost: 25, duration: '3 hours', description: 'Visit the iconic iron tower' },
      { stopId: stop1.id, name: 'Louvre Museum', type: 'sightseeing', cost: 17, duration: '4 hours', description: 'World\'s largest art museum' },
      { stopId: stop1.id, name: 'Seine River Cruise', type: 'sightseeing', cost: 15, duration: '1.5 hours', description: 'Scenic boat tour along the Seine' },
    ],
  })

  const stop2 = await prisma.stop.create({
    data: {
      tripId: trip1.id,
      city: 'Rome',
      country: 'Italy',
      startDate: new Date('2025-05-11'),
      endDate: new Date('2025-05-20'),
      budget: 1800,
      order: 2,
      description: 'The Eternal City - Colosseum, Vatican, and incredible Italian cuisine',
    },
  })

  await prisma.activity.createMany({
    data: [
      { stopId: stop2.id, name: 'Colosseum Tour', type: 'sightseeing', cost: 16, duration: '3 hours', description: 'Ancient Roman amphitheater' },
      { stopId: stop2.id, name: 'Vatican Museums', type: 'sightseeing', cost: 20, duration: '4 hours', description: 'Sistine Chapel and more' },
      { stopId: stop2.id, name: 'Pasta Making Class', type: 'food', cost: 65, duration: '3 hours', description: 'Learn to make authentic Italian pasta' },
    ],
  })

  // Checklist for trip 1
  await prisma.checklistItem.createMany({
    data: [
      { tripId: trip1.id, label: 'Passport', category: 'Documents', packed: true },
      { tripId: trip1.id, label: 'Travel Insurance', category: 'Documents', packed: true },
      { tripId: trip1.id, label: 'Flight Tickets', category: 'Documents', packed: true },
      { tripId: trip1.id, label: 'Hotel Bookings', category: 'Documents', packed: false },
      { tripId: trip1.id, label: 'T-Shirts (5)', category: 'Clothing', packed: true },
      { tripId: trip1.id, label: 'Jeans (2)', category: 'Clothing', packed: false },
      { tripId: trip1.id, label: 'Formal Shirt', category: 'Clothing', packed: false },
      { tripId: trip1.id, label: 'Comfortable Shoes', category: 'Clothing', packed: false },
      { tripId: trip1.id, label: 'Laptop', category: 'Electronics', packed: true },
      { tripId: trip1.id, label: 'Phone Charger', category: 'Electronics', packed: false },
      { tripId: trip1.id, label: 'Universal Adapter', category: 'Electronics', packed: false },
      { tripId: trip1.id, label: 'Camera', category: 'Electronics', packed: false },
    ],
  })

  // Notes for trip 1
  await prisma.note.createMany({
    data: [
      { tripId: trip1.id, userId: james.id, title: 'Hotel check-in details - Rome stop', content: 'Check in after 2pm, room 302. Hotel Artemis near the Colosseum. Free breakfast included.', stopRef: stop2.id, createdAt: new Date('2025-04-28') },
      { tripId: trip1.id, userId: james.id, title: 'Paris restaurant recommendations', content: 'Café de Flore for breakfast, L\'As du Fallafel for lunch. Book Septime for dinner - need reservation 3 weeks in advance!', stopRef: stop1.id, createdAt: new Date('2025-04-25') },
      { tripId: trip1.id, userId: james.id, title: 'Currency & Budget notes', content: 'Exchange $500 at airport. Use Revolut card for daily expenses. Keep €200 cash for markets and small shops.', createdAt: new Date('2025-04-20') },
    ],
  })

  // Invoice for trip 1
  const invoice1 = await prisma.invoice.create({
    data: {
      tripId: trip1.id,
      status: 'pending',
      travelers: 'James, Arjun, Jerry, Cristina',
      generatedAt: new Date('2025-04-20'),
    },
  })

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: invoice1.id, description: 'Paris - CDG Round Trip Flights', category: 'Transport', qty: '4 travelers', unitCost: 450, amount: 1800 },
      { invoiceId: invoice1.id, description: 'Hotel Opéra Paris (9 nights)', category: 'Accommodation', qty: '9 nights', unitCost: 180, amount: 1620 },
      { invoiceId: invoice1.id, description: 'Rome FCO Round Trip Flights', category: 'Transport', qty: '4 travelers', unitCost: 380, amount: 1520 },
      { invoiceId: invoice1.id, description: 'Hotel Artemis Rome (9 nights)', category: 'Accommodation', qty: '9 nights', unitCost: 160, amount: 1440 },
      { invoiceId: invoice1.id, description: 'Activities & Sightseeing', category: 'Activities', qty: null, unitCost: 600, amount: 600 },
      { invoiceId: invoice1.id, description: 'Meals & Dining (estimate)', category: 'Food', qty: '20 days', unitCost: 80, amount: 1600 },
      { invoiceId: invoice1.id, description: 'Local Transport (Metro, Taxi)', category: 'Transport', qty: null, unitCost: 200, amount: 200 },
      { invoiceId: invoice1.id, description: 'Travel Insurance', category: 'Insurance', qty: '4 travelers', unitCost: 60, amount: 240 },
    ],
  })

  // Trip 2: Japan Highlights (upcoming)
  const trip2 = await prisma.trip.create({
    data: {
      name: 'Japan Highlights',
      description: 'Discover the ancient and modern wonders of Japan',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-18'),
      isPublic: true,
      status: 'upcoming',
      userId: james.id,
    },
  })

  const stop3 = await prisma.stop.create({
    data: {
      tripId: trip2.id,
      city: 'Tokyo',
      country: 'Japan',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-09'),
      budget: 2500,
      order: 1,
      description: 'The neon capital - temples, tech, and ramen',
    },
  })

  await prisma.activity.createMany({
    data: [
      { stopId: stop3.id, name: 'Tokyo Tower', type: 'sightseeing', cost: 12, duration: '2 hours' },
      { stopId: stop3.id, name: 'Tsukiji Market Tour', type: 'food', cost: 30, duration: '2 hours' },
      { stopId: stop3.id, name: 'Mount Fuji Day Trip', type: 'adventure', cost: 80, duration: '10 hours' },
    ],
  })

  const stop4 = await prisma.stop.create({
    data: {
      tripId: trip2.id,
      city: 'Kyoto',
      country: 'Japan',
      startDate: new Date('2025-08-10'),
      endDate: new Date('2025-08-18'),
      budget: 2000,
      order: 2,
      description: 'Ancient temples, geishas, and bamboo forests',
    },
  })

  await prisma.activity.createMany({
    data: [
      { stopId: stop4.id, name: 'Fushimi Inari Shrine', type: 'sightseeing', cost: 0, duration: '3 hours' },
      { stopId: stop4.id, name: 'Arashiyama Bamboo Grove', type: 'sightseeing', cost: 0, duration: '2 hours' },
      { stopId: stop4.id, name: 'Tea Ceremony Experience', type: 'food', cost: 40, duration: '1.5 hours' },
    ],
  })

  await prisma.checklistItem.createMany({
    data: [
      { tripId: trip2.id, label: 'Passport', category: 'Documents', packed: false },
      { tripId: trip2.id, label: 'Japan Rail Pass', category: 'Documents', packed: false },
      { tripId: trip2.id, label: 'Travel Insurance', category: 'Documents', packed: false },
      { tripId: trip2.id, label: 'Light Jacket', category: 'Clothing', packed: false },
      { tripId: trip2.id, label: 'Comfortable Walking Shoes', category: 'Clothing', packed: false },
      { tripId: trip2.id, label: 'Pocket WiFi Router', category: 'Electronics', packed: false },
      { tripId: trip2.id, label: 'Camera', category: 'Electronics', packed: false },
    ],
  })

  const invoice2 = await prisma.invoice.create({
    data: {
      tripId: trip2.id,
      status: 'pending',
      travelers: 'James, Sarah',
      generatedAt: new Date('2025-07-01'),
    },
  })

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: invoice2.id, description: 'Tokyo NRT Return Flights', category: 'Transport', qty: '2 travelers', unitCost: 950, amount: 1900 },
      { invoiceId: invoice2.id, description: 'Tokyo Hotel (8 nights)', category: 'Accommodation', qty: '8 nights', unitCost: 200, amount: 1600 },
      { invoiceId: invoice2.id, description: 'Kyoto Ryokan (8 nights)', category: 'Accommodation', qty: '8 nights', unitCost: 220, amount: 1760 },
      { invoiceId: invoice2.id, description: 'Japan Rail Pass (14 days)', category: 'Transport', qty: '2 travelers', unitCost: 400, amount: 800 },
      { invoiceId: invoice2.id, description: 'Activities & Experiences', category: 'Activities', qty: null, unitCost: 500, amount: 500 },
    ],
  })

  // Trip 3: Bali Retreat (completed)
  const trip3 = await prisma.trip.create({
    data: {
      name: 'Bali Retreat',
      description: 'A relaxing and spiritual retreat in the Island of the Gods',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-29'),
      isPublic: true,
      status: 'completed',
      userId: james.id,
    },
  })

  const stop5 = await prisma.stop.create({
    data: {
      tripId: trip3.id,
      city: 'Bali',
      country: 'Indonesia',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-29'),
      budget: 3000,
      order: 1,
      description: 'Rice terraces, temples, and spiritual healing',
    },
  })

  await prisma.activity.createMany({
    data: [
      { stopId: stop5.id, name: 'Bali Paragliding', type: 'adventure', cost: 90, duration: '2 hours' },
      { stopId: stop5.id, name: 'Ubud Monkey Forest', type: 'sightseeing', cost: 8, duration: '2 hours' },
      { stopId: stop5.id, name: 'Balinese Cooking Class', type: 'food', cost: 45, duration: '4 hours' },
    ],
  })

  await prisma.checklistItem.createMany({
    data: [
      { tripId: trip3.id, label: 'Passport', category: 'Documents', packed: true },
      { tripId: trip3.id, label: 'Visa on Arrival Docs', category: 'Documents', packed: true },
      { tripId: trip3.id, label: 'Swimwear', category: 'Clothing', packed: true },
      { tripId: trip3.id, label: 'Sunscreen SPF 50', category: 'Clothing', packed: true },
      { tripId: trip3.id, label: 'Phone Charger', category: 'Electronics', packed: true },
    ],
  })

  const invoice3 = await prisma.invoice.create({
    data: {
      tripId: trip3.id,
      status: 'paid',
      travelers: 'James, Maria',
      generatedAt: new Date('2025-01-10'),
    },
  })

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: invoice3.id, description: 'Bali DPS Return Flights', category: 'Transport', qty: '2 travelers', unitCost: 680, amount: 1360 },
      { invoiceId: invoice3.id, description: 'Villa Ubud (14 nights)', category: 'Accommodation', qty: '14 nights', unitCost: 95, amount: 1330 },
      { invoiceId: invoice3.id, description: 'Activities & Experiences', category: 'Activities', qty: null, unitCost: 280, amount: 280 },
      { invoiceId: invoice3.id, description: 'Meals & Local Food', category: 'Food', qty: '14 days', unitCost: 30, amount: 420 },
    ],
  })

  // Community Posts
  await prisma.communityPost.createMany({
    data: [
      {
        tripId: trip1.id,
        userId: james.id,
        title: 'My Paris & Rome Adventure - Tips & Tricks',
        description: 'Just completed an amazing European tour! Sharing my top tips for visiting Paris and Rome on a budget. The Louvre is best visited on Wednesday evenings when it\'s open late and less crowded.',
        tags: 'europe,paris,rome,budget-travel,art',
        createdAt: new Date('2025-05-18'),
      },
      {
        tripId: trip3.id,
        userId: james.id,
        title: 'Bali Retreat - Complete Guide',
        description: 'Spent 2 weeks in Bali and absolutely loved it. The cooking class in Ubud was the highlight! Rice terrace walks at sunrise are a must-do. Best kept secret: Sidemen Valley for authentic Balinese culture.',
        tags: 'bali,indonesia,asia,spiritual,food',
        createdAt: new Date('2025-01-30'),
      },
      {
        tripId: trip2.id,
        userId: james.id,
        title: 'Planning Japan Highlights - Help Wanted!',
        description: 'Heading to Japan in August and planning my itinerary. Any recommendations for must-see spots in Tokyo and Kyoto? Especially interested in authentic local experiences off the tourist path.',
        tags: 'japan,tokyo,kyoto,planning,advice',
        createdAt: new Date('2025-06-01'),
      },
      {
        tripId: null,
        userId: admin.id,
        title: 'Traveloop Community Launch!',
        description: 'Welcome to the Traveloop community! Share your travel stories, get inspiration, and connect with fellow travelers. We\'re excited to have you here. Start by creating your first trip!',
        tags: 'community,welcome,announcement',
        createdAt: new Date('2025-04-01'),
      },
    ],
  })

  console.log('✅ Seed complete!')
  console.log(`Users: james@traveloop.com (password123), admin@traveloop.com (admin123)`)
  console.log(`Trips: ${trip1.name} (ongoing), ${trip2.name} (upcoming), ${trip3.name} (completed)`)
  console.log(`Cities: ${cities.length}, Activities: 20, Community Posts: 4`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
