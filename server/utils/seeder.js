import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

// Seeder data directly matching rupee-based initialBooks list
const initialBooks = [
  {
    title: "The God of Small Things",
    author: "Arundhati Roy",
    category: "Fiction",
    price: 350,
    rating: 4.8,
    reviews: 312,
    publishedYear: 1997,
    description: "A richly layered story of forbidden love, caste politics, and childhood in Kerala. Winner of the Man Booker Prize, this novel captures the essence of Indian family dynamics and the 'Love Laws' that dictate who should be loved and how.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    stock: 18
  },
  {
    title: "Wings of Fire",
    author: "Dr. A.P.J. Abdul Kalam",
    category: "Biography",
    price: 299,
    rating: 4.9,
    reviews: 580,
    publishedYear: 1999,
    description: "The autobiography of India's beloved 'Missile Man' and former President. From humble beginnings in Rameswaram to leading India's space and missile programs, this inspirational journey of perseverance has touched millions of hearts.",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    stock: 25
  },
  {
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    category: "Fiction",
    price: 275,
    rating: 4.6,
    reviews: 198,
    publishedYear: 1956,
    description: "Set during the traumatic Partition of India in 1947, this powerful novel takes place in a fictional border village where Hindus, Muslims, and Sikhs have lived in harmony — until the trains from Pakistan arrive carrying dead bodies.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=400",
    stock: 14
  },
  {
    title: "The White Tiger",
    author: "Aravind Adiga",
    category: "Fiction",
    price: 399,
    rating: 4.5,
    reviews: 247,
    publishedYear: 2008,
    description: "A darkly humorous Booker Prize-winning novel told as a letter to the Chinese Premier. Balram Halwai narrates his journey from a village tea shop to becoming a successful entrepreneur in Bangalore — by any means necessary.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    stock: 20
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    price: 450,
    rating: 4.9,
    reviews: 672,
    publishedYear: 1960,
    description: "A timeless masterpiece of American literature. Through the eyes of young Scout Finch, this Pulitzer Prize-winning novel explores racial injustice, moral growth, and the loss of innocence in the Deep South during the Great Depression.",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
    stock: 16
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Sci-Fi",
    price: 325,
    rating: 4.7,
    reviews: 489,
    publishedYear: 1949,
    description: "A chilling dystopian novel about totalitarian government surveillance and the manipulation of truth. Winston Smith's rebellion against Big Brother in the superstate of Oceania remains one of the most powerful political allegories ever written.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    stock: 22
  },
  {
    title: "Deep Learning with Python",
    author: "François Chollet",
    category: "Technology",
    price: 1599,
    rating: 4.8,
    reviews: 156,
    publishedYear: 2021,
    description: "Written by the creator of Keras, this hands-on guide covers neural networks, computer vision, NLP, and generative deep learning. Ideal for developers wanting to master modern AI with practical examples and industry-tested approaches.",
    coverUrl: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&q=80&w=400",
    stock: 10
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: 1299,
    rating: 4.7,
    reviews: 385,
    publishedYear: 2008,
    description: "A handbook of agile software craftsmanship. Robert 'Uncle Bob' Martin presents a revolutionary paradigm for writing readable, maintainable code through real-world case studies and best practices in software engineering.",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
    stock: 12
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 499,
    rating: 4.9,
    reviews: 1240,
    publishedYear: 2018,
    description: "The definitive guide to building good habits and breaking bad ones. James Clear reveals practical strategies rooted in biology, psychology, and neuroscience to make tiny changes that deliver remarkable results over time.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    stock: 35
  },
  {
    title: "Ikigai: The Japanese Secret to a Long and Happy Life",
    author: "Héctor García & Francesc Miralles",
    category: "Self-Help",
    price: 375,
    rating: 4.6,
    reviews: 312,
    publishedYear: 2016,
    description: "Discover the Japanese concept of ikigai — your reason for being. Drawing wisdom from the centenarians of Okinawa, this book reveals the keys to finding purpose, staying active, and living a longer, more fulfilling life.",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    stock: 28
  },
  {
    title: "India After Gandhi",
    author: "Ramachandra Guha",
    category: "History",
    price: 699,
    rating: 4.7,
    reviews: 215,
    publishedYear: 2007,
    description: "The definitive history of the world's largest democracy from independence to the 21st century. Guha masterfully chronicles the political, social, and cultural evolution of modern India through vivid storytelling and meticulous research.",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
    stock: 15
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: 350,
    rating: 4.8,
    reviews: 890,
    publishedYear: 1988,
    description: "A magical fable about Santiago, an Andalusian shepherd boy who travels from Spain to the Egyptian desert in search of treasure buried near the Pyramids. What starts as a journey becomes a tale of self-discovery and the pursuit of one's Personal Legend.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=400",
    stock: 30
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Business",
    price: 599,
    rating: 4.6,
    reviews: 378,
    publishedYear: 2014,
    description: "PayPal co-founder Peter Thiel's contrarian blueprint for startups. This book challenges conventional thinking about competition and argues that the most successful businesses create entirely new markets rather than competing in existing ones.",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
    stock: 19
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Business",
    price: 399,
    rating: 4.5,
    reviews: 920,
    publishedYear: 1997,
    description: "The #1 personal finance book of all time. Through the story of two fathers — his own and his best friend's — Kiyosaki exposes the mindset differences between the rich and the middle class, advocating for financial literacy and entrepreneurship.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    stock: 32
  },
  {
    title: "The Immortals of Meluha",
    author: "Amish Tripathi",
    category: "Mythology",
    price: 350,
    rating: 4.4,
    reviews: 445,
    publishedYear: 2010,
    description: "The first book of the Shiva Trilogy reimagines Lord Shiva as a flesh-and-blood hero. Set in 1900 BCE in the land of Meluha, this gripping mythological fiction blends ancient Indian philosophy with edge-of-seat adventure.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    stock: 24
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Fiction",
    price: 299,
    rating: 4.8,
    reviews: 560,
    publishedYear: 1813,
    description: "The quintessential Regency romance. Elizabeth Bennet and Mr. Darcy's sparkling battle of wits, pride, and misunderstanding is one of English literature's greatest love stories, filled with Austen's characteristic irony and social commentary.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    stock: 20
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Existing database collections wiped...'.yellow);

    // Create users (plain text passwords will be encrypted by the userSchema hooks)
    const createdUsers = await User.create([
      {
        name: "Priya Sharma",
        email: "customer@bookstore.com",
        password: "password123",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
      },
      {
        name: "Arjun Admin",
        email: "admin@bookstore.com",
        password: "admin123",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
      }
    ]);

    const userObj = createdUsers[0];
    console.log('Mock Users seeded successfully...'.green);

    // Seed Books
    const createdBooks = await Book.insertMany(initialBooks);
    console.log(`${createdBooks.length} Books seeded successfully...`.green);

    // Seed sample orders linked to the newly created documents
    await Order.create([
      {
        userId: userObj._id,
        userName: userObj.name,
        date: new Date("2026-06-15T14:32:00.000Z"),
        items: [
          {
            bookId: createdBooks[0]._id,
            title: createdBooks[0].title,
            price: createdBooks[0].price,
            quantity: 1,
            coverUrl: createdBooks[0].coverUrl
          },
          {
            bookId: createdBooks[8]._id,
            title: createdBooks[8].title,
            price: createdBooks[8].price,
            quantity: 2,
            coverUrl: createdBooks[8].coverUrl
          }
        ],
        shippingDetails: {
          address: "42 MG Road, Koramangala",
          city: "Bengaluru",
          zipCode: "560034",
          phone: "+91 98765 43210"
        },
        totalAmount: createdBooks[0].price + (createdBooks[8].price * 2),
        status: "Delivered"
      },
      {
        userId: userObj._id,
        userName: userObj.name,
        date: new Date("2026-07-02T10:15:00.000Z"),
        items: [
          {
            bookId: createdBooks[6]._id,
            title: createdBooks[6].title,
            price: createdBooks[6].price,
            quantity: 1,
            coverUrl: createdBooks[6].coverUrl
          }
        ],
        shippingDetails: {
          address: "42 MG Road, Koramangala",
          city: "Bengaluru",
          zipCode: "560034",
          phone: "+91 98765 43210"
        },
        totalAmount: createdBooks[6].price,
        status: "Shipped"
      }
    ]);

    console.log('Mock Orders seeded successfully...'.green);
    console.log('Database seeding process complete!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedData();
