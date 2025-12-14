import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  // SOUP BOWLS
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    description: "Our signature Jollof is made with pepper mix rich in herbs, spice and flavour smoked to perfection for your enjoyment.",
    price: 30,
    sizes: { "2L": 30, "3L": 40, "Full Cooler": 110, "Half Cooler": 70 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80",
  },
  {
    id: "jollof-spaghetti",
    name: "Jollof Spaghetti",
    description: "Jollof-style spaghetti with rich tomato sauce and spices. A unique twist on a classic.",
    price: 30,
    sizes: { "2L": 30, "3L": 40 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
  },
  {
    id: "seafood-rice",
    name: "Seafood Rice",
    description: "Made with specially curated and sourced seafood our seafood rice will blow your minds with flavor",
    price: 40,
    sizes: { "2L": 40, "3L": 55 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800&q=80",
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    description: "Our fried rice is made of fresh vegetables carefully infused into rice. It is crunchy and flavor filled you will love!",
    price: 35,
    sizes: { "2L": 35, "3L": 45, "Full Cooler": 180, "Half Cooler": 110 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
  },
  {
    id: "coconut-rice",
    name: "Coconut Rice",
    description: "Our special rice meal designed to remind you of the versatility of coconut. Smells as good as it tastes. You can never have enough!",
    price: 40,
    sizes: { "2L": 40, "3L": 55 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
  },
  {
    id: "asaro",
    name: "Asaro (Yam Porridge)",
    description: "Traditional yam porridge cooked with palm oil and spices. Comfort food at its best.",
    price: 35,
    sizes: { "2L": 35, "3L": 45 },
    category: "rice",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
  },
  
  // PROTEIN COOLERS
  {
    id: "fried-peppered-chicken",
    name: "Fried Peppered Chicken",
    description: "Crispy fried chicken tossed in spicy pepper sauce. Perfect for parties.",
    price: 180,
    sizes: { "Full Cooler": 180, "Half Cooler": 100 },
    category: "special",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
  },
  {
    id: "fried-peppered-beef",
    name: "Fried Peppered Beef",
    description: "Premium beef cuts fried and peppered to perfection. A luxurious treat.",
    price: 500,
    sizes: { "Full Cooler": 500, "Half Cooler": 300 },
    category: "special",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  },
  {
    id: "fried-peppered-turkey",
    name: "Fried Peppered Turkey",
    description: "Tender turkey pieces fried and peppered. Great for special occasions.",
    price: 200,
    sizes: { "Full Cooler": 200, "Half Cooler": 100 },
    category: "special",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
  },
  {
    id: "fried-peppered-hake-fish",
    name: "Fried Peppered Hake Fish",
    description: "Fresh hake fish fried crispy and tossed in pepper sauce.",
    price: 250,
    sizes: { "Full Cooler": 250, "Half Cooler": 150 },
    category: "special",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
  },
  // EXTRAS
  {
    id: "moimoi",
    name: "Moi-moi (Elewe)",
    description: "Sometimes refered to as beans pudding. A very good choice for breakfast… something light!",
    price: 3,
    category: "sides",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
  },
  {
    id: "salad",
    name: "Salad",
    description: "Fresh mixed salad tray. Perfect side dish for any meal.",
    price: 50,
    category: "sides",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    id: "gizdodo",
    name: "Gizdodo",
    description: "Gizzard and plantain cooked in peppered sauce. A Nigerian favorite.",
    price: 45,
    sizes: { "2L": 45, "3L": 60 },
    category: "sides",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Made with various indigenous vegetables and packed with different types of protein. One of the riches meals on our menu.",
    price: 60,
    sizes: { "2L": 60, "3L": 80 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  },
  {
    id: "ogbono",
    name: "Ogbono",
    description: "Made with carefully sourced mango fruit and packed with flavor and intentionality. Best paired with any swallow of choice",
    price: 55,
    sizes: { "2L": 55, "3L": 75 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
  },
  {
    id: "ayamase",
    name: "Ayamase Sauce",
    description: "A dish indigenous to Ghana but loved by all. Made with specially bleached oil, fresh green peppers and other ingredients. This pairs well with a properly cooked bowl of boiled rice",
    price: 55,
    sizes: { "2L": 55, "3L": 70 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  },
  {
    id: "ofada",
    name: "Ofada Sauce",
    description: "Made with a rich blend of red bell and pointed peppers and infused with a specially curated oil. It promises to leave your taste bud wanting more",
    price: 50,
    sizes: { "2L": 50, "3L": 70 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1585937421612-70e008356f33?w=800&q=80",
  },
  {
    id: "fish-stew",
    name: "Fish Stew",
    description: "Rich tomato-based stew with tender fish pieces. A classic Nigerian favorite.",
    price: 50,
    sizes: { "2L": 50, "3L": 65 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1585937421612-70e008356f33?w=800&q=80",
  },
  {
    id: "chicken-turkey-peppersoup",
    name: "Chicken/Turkey Peppersoup",
    description: "Aromatic and spicy soup with tender chicken or turkey. Perfect for any occasion.",
    price: 50,
    sizes: { "2L": 50, "3L": 70 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  },
  {
    id: "seafood-okra",
    name: "Seafood Okra",
    description: "Fresh okra soup loaded with assorted seafood. Rich and flavorful.",
    price: 55,
    sizes: { "2L": 55, "3L": 75 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800&q=80",
  },
  {
    id: "beef-stew",
    name: "Beef Stew",
    description: "Hearty tomato stew with tender beef chunks. A comfort food classic.",
    price: 50,
    sizes: { "2L": 50, "3L": 65 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  },
  {
    id: "orisirisi-atadindin",
    name: "Orisirisi Atadindin",
    description: "Mixed pepper sauce with assorted meats. Bold and spicy.",
    price: 55,
    sizes: { "2L": 55, "3L": 75 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  },
  {
    id: "cowleg-offals-peppersoup",
    name: "Cowleg/Offals Peppersoup",
    description: "Traditional peppersoup with cowleg and offals. Rich in flavor and nutrients.",
    price: 55,
    sizes: { "2L": 55, "3L": 75 },
    category: "soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  },
  
  // FOOD BOWLS

];

export const brandContent = {
  servicesBlurb: "We offer soup and meal bowls services based on preorder. Each meal or soup bowl can be customised to fit your desired taste. Made from premium African ingredients our meals are curated with accuracy and precision",
  
  reviewPrompt: "We appreciate your patronage however more than just this we would like to get an honest review from our customers to help us improve and continue to maintain a high level of customer satisfaction. Please leave us a review below",
  
  cateringInfo: `In addition to the featured delicacies we also have
ASUN (peppered goat meat)
Peppersoup (assorted, goat meat, cat fish, chicken and turkey)
Seafood rice
Fries rice
Coconut rice
Local rice
Moimoi
We offer indoor and outdoor catering services carefully curated to taste and guests pleasure
Please send an email to book a session to discuss tour catering needs
Once order is placed please give 4-5 working days for orders to be processed and shipped`,
  
  contactEmail: "cravingsdelight2025@gmail.com",
  instagramHandle: "@cravings_delighthull",
  
  paymentNote: "PLEASE TAKE NOTE OF EVERY LINE, VERY IMPORTANT\nWE ACCEPT PAYMENT VIA PAYPAL AND STRIPE",
  
  orderProcessing: "3-5 WORKING DAYS AFTER PAYMENT.",
  shippingNote: "Once order is placed please give 4-5 working days for orders to be processed and shipped",
  
  aboutStory: "Cravings delight was first born out of interest and hubby gradually we grew the brand to represent a taste of home and culture. Every meal from cravings reminds you of our very rich and versatile culture. Every meal is our promise of excellence kept!",
};
