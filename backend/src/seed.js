require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Property = require('./models/Property');
const Favorite = require('./models/Favorite');
const Inquiry = require('./models/Inquiry');
const Visit = require('./models/Visit');
const Review = require('./models/Review');
const Report = require('./models/Report');

const seedData = async () => {
  try {
    console.log('--- Connecting to MongoDB for Seeding ---');
    await connectDB();

    console.log('--- Clearing Existing Data ---');
    await User.deleteMany();
    await Property.deleteMany();
    await Favorite.deleteMany();
    await Inquiry.deleteMany();
    await Visit.deleteMany();
    await Review.deleteMany();
    await Report.deleteMany();

    console.log('--- Creating Users ---');
    // Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'password123',
      phone: '9876543210',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    // Owners
    const owner1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'owner@example.com',
      password: 'password123',
      phone: '9840123456',
      role: 'owner',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    const owner2 = await User.create({
      name: 'Priya Sundaram',
      email: 'priya.s@example.com',
      password: 'password123',
      phone: '9840987654',
      role: 'owner',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    // Tenants
    const tenant1 = await User.create({
      name: 'Karthik Raja',
      email: 'tenant@example.com',
      password: 'password123',
      phone: '9790112233',
      role: 'tenant',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    const tenant2 = await User.create({
      name: 'Ananya Ramesh',
      email: 'ananya@example.com',
      password: 'password123',
      phone: '9790445566',
      role: 'tenant',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    console.log('--- Creating Properties across Chennai Locations ---');
    const propertiesData = [
      {
        ownerId: owner1._id,
        title: 'Modern Luxury PG for Men near OMR Tech Park',
        description: 'Fully furnished premium accommodation with high-speed Wi-Fi, air conditioning, daily housekeeping, 3-time nutritious home-style meals, and 24/7 security. Ideal for software engineers and college students in Sholinganallur and Navalur tech corridors.',
        propertyType: 'PG',
        roomType: 'Single',
        genderPreference: 'Male',
        monthlyRent: 11500,
        securityDeposit: 15000,
        address: 'Plot 45, Elcot SEZ Main Road, Sholinganallur',
        city: 'OMR',
        state: 'Tamil Nadu',
        pincode: '600119',
        latitude: 12.901,
        longitude: 80.2279,
        amenities: ['WiFi', 'AC', 'Food Included', 'Power Backup', 'Geyser', 'Washing Machine', 'CCTV', 'Gym'],
        furnishing: 'Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/omr-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/omr-2.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/omr-3.jpg',
          },
        ],
      },
      {
        ownerId: owner1._id,
        title: 'Serene Co-Living Double Sharing Space in Velachery',
        description: 'Spacious double sharing room in a peaceful residential layout close to Phoenix MarketCity and Velachery MRTS railway station. Comes with dedicated study desks, wardrobe, shared kitchen, refrigerator, and RO water purifier.',
        propertyType: 'Hostel',
        roomType: 'Double Sharing',
        genderPreference: 'Any',
        monthlyRent: 6500,
        securityDeposit: 10000,
        address: '12th Cross Street, Dhandeeswaram Nagar, Velachery',
        city: 'Velachery',
        state: 'Tamil Nadu',
        pincode: '600042',
        latitude: 12.9815,
        longitude: 80.218,
        amenities: ['WiFi', 'Washing Machine', 'Refrigerator', 'RO Water', 'Parking', 'Housekeeping'],
        furnishing: 'Semi-Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/vel-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/vel-2.jpg',
          },
        ],
      },
      {
        ownerId: owner2._id,
        title: 'Executive Women’s PG with Balcony in Anna Nagar',
        description: 'Safe and upscale girls PG in the heart of Anna Nagar West. 5 minutes walk from Anna Nagar Tower Metro Station. Includes biometric entry, 24/7 security guard, attached bathroom, high-speed fiber internet, and hygienic food.',
        propertyType: 'PG',
        roomType: 'Single',
        genderPreference: 'Female',
        monthlyRent: 13000,
        securityDeposit: 20000,
        address: '2nd Avenue, Near Anna Nagar Tower Park, Anna Nagar',
        city: 'Anna Nagar',
        state: 'Tamil Nadu',
        pincode: '600040',
        latitude: 13.085,
        longitude: 80.2101,
        amenities: ['WiFi', 'AC', 'Food Included', 'Security Guard', 'CCTV', 'Balcony', 'Geyser', 'Washing Machine'],
        furnishing: 'Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/anna-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/anna-2.jpg',
          },
        ],
      },
      {
        ownerId: owner2._id,
        title: 'Spacious 2BHK Shared Flat for Professionals in Guindy',
        description: 'Well-ventilated shared apartment near Guindy Kathipara flyover and Olympia Tech Park. Includes modular kitchen with gas connection, sofa, TV, spacious balcony, covered car parking, and 24-hr water supply.',
        propertyType: 'Apartment',
        roomType: 'Double Sharing',
        genderPreference: 'Any',
        monthlyRent: 8000,
        securityDeposit: 15000,
        address: 'GST Road, Near Guindy Industrial Estate, Guindy',
        city: 'Guindy',
        state: 'Tamil Nadu',
        pincode: '600032',
        latitude: 13.0067,
        longitude: 80.2026,
        amenities: ['WiFi', 'TV', 'Parking', 'Power Backup', 'Lift', 'Kitchen Access', 'Security Guard'],
        furnishing: 'Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab004?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/guindy-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/guindy-2.jpg',
          },
        ],
      },
      {
        ownerId: owner1._id,
        title: 'Budget-Friendly Student Accommodation near MCC Tambaram',
        description: 'Affordable triple sharing accommodation located right next to Madras Christian College and Tambaram Railway Station. Very quiet locality with study rooms, high-speed Wi-Fi, and easy access to local markets and buses.',
        propertyType: 'Hostel',
        roomType: 'Triple Sharing',
        genderPreference: 'Male',
        monthlyRent: 4500,
        securityDeposit: 6000,
        address: 'East Tambaram Main Road, Near MCC Campus, Tambaram',
        city: 'Tambaram',
        state: 'Tamil Nadu',
        pincode: '600059',
        latitude: 12.9249,
        longitude: 80.1299,
        amenities: ['WiFi', 'RO Water', 'Housekeeping', 'Power Backup'],
        furnishing: 'Semi-Furnished',
        status: 'Approved',
        isVerified: false,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/tam-1.jpg',
          },
        ],
      },
      {
        ownerId: owner2._id,
        title: 'Premium Studio Room with Sea Breeze in Adyar',
        description: 'Charming private studio room in a heritage villa in Adyar, close to IIT Madras and beachfront cafes. Includes private entrance, kitchenette, attached bathroom, air conditioning, and garden patio.',
        propertyType: 'House',
        roomType: 'Single',
        genderPreference: 'Any',
        monthlyRent: 16000,
        securityDeposit: 30000,
        address: 'Kasturibai Nagar 3rd Main Road, Adyar',
        city: 'Adyar',
        state: 'Tamil Nadu',
        pincode: '600020',
        latitude: 13.0012,
        longitude: 80.2565,
        amenities: ['WiFi', 'AC', 'Kitchen Access', 'Garden', 'Geyser', 'Washing Machine', 'Parking'],
        furnishing: 'Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/adyar-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/adyar-2.jpg',
          },
        ],
      },
      {
        ownerId: owner1._id,
        title: 'Cozy Shared Room in Sholinganallur Junction',
        description: 'Triple sharing room for IT professionals working at Infosys, Wipro, or TCS Sholinganallur. Daily housekeeping, high-speed broadband, inverter backup, and food included.',
        propertyType: 'PG',
        roomType: 'Triple Sharing',
        genderPreference: 'Male',
        monthlyRent: 5800,
        securityDeposit: 8000,
        address: 'Near Sholinganallur Signal, OMR Road',
        city: 'Sholinganallur',
        state: 'Tamil Nadu',
        pincode: '600119',
        latitude: 12.8995,
        longitude: 80.2285,
        amenities: ['WiFi', 'Food Included', 'Power Backup', 'RO Water', 'CCTV'],
        furnishing: 'Furnished',
        status: 'Approved',
        isVerified: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/sholing-1.jpg',
          },
        ],
      },
      {
        ownerId: owner2._id,
        title: 'Newly Listed Luxury PG in Velachery (Pending Moderation)',
        description: 'Brand new luxury accommodation featuring brand new queen beds, individual work desks, gym access, gaming area, and rooftop café.',
        propertyType: 'PG',
        roomType: 'Single',
        genderPreference: 'Any',
        monthlyRent: 14500,
        securityDeposit: 25000,
        address: 'Bypass Road, Velachery',
        city: 'Velachery',
        state: 'Tamil Nadu',
        pincode: '600042',
        latitude: 12.975,
        longitude: 80.22,
        amenities: ['WiFi', 'AC', 'Gym', 'Balcony', 'Power Backup', 'Lift'],
        furnishing: 'Furnished',
        status: 'Pending',
        isVerified: false,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
            storagePath: 'properties/seed/vel-pending.jpg',
          },
        ],
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`Created ${createdProperties.length} properties.`);

    console.log('--- Creating Sample Reviews ---');
    await Review.create({
      tenantId: tenant1._id,
      propertyId: createdProperties[0]._id,
      rating: 5,
      comment: 'Excellent place! Super clean, high-speed WiFi works seamlessly for remote work, and food is genuinely home-style. Highly recommended for OMR IT folks!',
    });

    await Review.create({
      tenantId: tenant2._id,
      propertyId: createdProperties[0]._id,
      rating: 4,
      comment: 'Great management and very responsive owner. AC cooling is fantastic.',
    });

    await Review.create({
      tenantId: tenant1._id,
      propertyId: createdProperties[1]._id,
      rating: 5,
      comment: 'Very convenient location close to MRTS and Phoenix mall. The rooms are airy and bright.',
    });

    await Review.create({
      tenantId: tenant2._id,
      propertyId: createdProperties[2]._id,
      rating: 5,
      comment: 'Super safe PG for women! Biometric entry gives total peace of mind and the caretaker is very helpful.',
    });

    console.log('--- Creating Sample Favorites ---');
    await Favorite.create({
      userId: tenant1._id,
      propertyId: createdProperties[0]._id,
    });

    await Favorite.create({
      userId: tenant1._id,
      propertyId: createdProperties[3]._id,
    });

    console.log('--- Creating Sample Inquiries ---');
    await Inquiry.create({
      tenantId: tenant1._id,
      ownerId: owner1._id,
      propertyId: createdProperties[0]._id,
      message: 'Hi Rajesh, is the single room available for immediate move-in from this coming Monday?',
      status: 'Responded',
      ownerResponse: 'Yes Karthik, the room is vacant and deep cleaned. You can move in anytime after completing verification.',
    });

    await Inquiry.create({
      tenantId: tenant2._id,
      ownerId: owner2._id,
      propertyId: createdProperties[2]._id,
      message: 'Hello Priya, are visitors allowed during weekends? Also is there two-wheeler parking available?',
      status: 'Pending',
    });

    console.log('--- Creating Sample Visits ---');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    await Visit.create({
      tenantId: tenant1._id,
      ownerId: owner1._id,
      propertyId: createdProperties[0]._id,
      visitDate: tomorrow,
      visitTime: '11:00 AM - 12:00 PM',
      status: 'Accepted',
      notes: 'Looking forward to viewing the single AC room and gym facility.',
    });

    await Visit.create({
      tenantId: tenant2._id,
      ownerId: owner2._id,
      propertyId: createdProperties[2]._id,
      visitDate: dayAfter,
      visitTime: '04:00 PM - 05:00 PM',
      status: 'Pending',
      notes: 'Planning to visit with my parents for PG tour.',
    });

    console.log('--- Creating Sample Reports ---');
    await Report.create({
      reportedBy: tenant1._id,
      propertyId: createdProperties[4]._id,
      reason: 'Incorrect Address Information',
      description: 'The pinned location seems to be 1km away from the actual college gate. Please review with the owner.',
      status: 'Pending',
    });

    console.log('=============================================');
    console.log('   ROOMMATEHUB DATABASE SEEDED SUCCESSFULLY! ');
    console.log('=============================================');
    console.log('Demo Credentials:');
    console.log('1. Admin:  admin@example.com   / password123');
    console.log('2. Owner:  owner@example.com   / password123');
    console.log('3. Tenant: tenant@example.com  / password123');
    console.log('=============================================');

    await disconnectDB();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
