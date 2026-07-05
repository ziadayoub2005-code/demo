export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  ingredients?: string[];
  ingredientsEn?: string[];
  options?: {
    label: string;
    labelEn: string;
    items: {
      name: string;
      nameEn: string;
      price?: number;
    }[];
  };
  price: number; 
  category: string;
  image?: string;
  attributes?: {
    id: number;
    name: string;
    values: {
      id: number;
      name: string;
      price_extra: number;
    }[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
}

export const categories: Category[] = [
  { id: "burgers", name: "البرغر", nameEn: "Burgers" },
  { id: "mega", name: "ميقا", nameEn: "Mega" },
  { id: "buckets", name: "سطل اللمة", nameEn: "Gathering Buckets" },
  { id: "boxes", name: "البوكسات", nameEn: "Boxes" },
  { id: "bites", name: "كرسبي بايتس", nameEn: "Crispy Bites" },
  { id: "pasta", name: "الباستا", nameEn: "Pasta" },
  { id: "sauces", name: "الصوصات", nameEn: "Sauces" },
  { id: "extras", name: "الاضافات", nameEn: "Extras" },
  { id: "drinks", name: "مشروبات", nameEn: "Drinks" },
  { id: "desserts", name: "حلا", nameEn: "Desserts" }
];

export const menuItems: MenuItem[] = [
  // --- BURGERS ---
  {
    id: "burger-truffle",
    name: "ترافل",
    nameEn: "Truffle",
    category: "burgers",
    price: 45,
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص ترافل", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Truffle Sauce", "Cheddar Cheese Slice"],
    image: "/images/export/ترافل برغر.png"
  },
  {
    id: "burger-mexican",
    name: "مكسيكان",
    nameEn: "Mexican",
    category: "burgers",
    price: 38,
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص مكسيكان سبايسي", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Spicy Mexican Sauce", "Cheddar Cheese Slice"],
    image: "/images/export/مكسيكان برغر.png"
  },
  {
    id: "burger-crispy-chicken",
    name: "كرسبي شكن",
    nameEn: "Crispy Chicken",
    category: "burgers",
    price: 36,
    ingredients: ["دجاج مقرمش", "خص طازج", "صوص كوكتال", "شريحة جبن شيدار"],
    ingredientsEn: ["Crispy Chicken", "Fresh Lettuce", "Cocktail Sauce", "Cheddar Cheese Slice"],
    image: "/images/export/كرسبي شكن برغر.png"
  },
  {
    id: "burger-classica",
    name: "كلاسيكا",
    nameEn: "Classica",
    category: "burgers",
    price: 35,
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص بيجي", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Biggy Sauce", "Cheddar Cheese Slice"],
    image: "/images/export/كلاسيكا برغر.png"
  },
  {
    id: "burger-black-white",
    name: "بلاك وايت",
    nameEn: "Black White",
    category: "burgers",
    price: 55,
    ingredients: ["شريحة لحم 120 غ", "خص طازج", "صوص بيجي", "شريحتين جبن شيدار"],
    ingredientsEn: ["120g Beef Patty", "Fresh Lettuce", "Biggy Sauce", "Two Cheddar Cheese Slices"],
    image: "/images/export (3)/بلاك وايت (Black White).png"
  },
  {
    id: "burger-crispy-shrimp",
    name: "جمبري كرسبي",
    nameEn: "Crispy Shrimp",
    category: "burgers",
    price: 40,
    ingredients: ["جمبري مقرمش", "أفوكادو", "خص طازج", "بصل مخلل", "صوص بيجي", "جبن شيدار"],
    ingredientsEn: ["Crispy Shrimp", "Avocado", "Fresh Lettuce", "Pickled Onions", "Biggy Sauce", "Cheddar Cheese"],
    image: "/images/export (3)/جمبري كرسبي (Crispy Shrimp).png"
  },
  {
    id: "burger-mega-crispy-chicken",
    name: "ميقا كرسبي شكن",
    nameEn: "Mega Crispy Chicken",
    category: "mega",
    price: 48,
    ingredients: ["دجاج كرسبي دبل", "خص طازج", "صوص كوكتال", "شريحتين جبن شيدار"],
    ingredientsEn: ["Double Crispy Chicken", "Fresh Lettuce", "Cocktail Sauce", "Two Cheddar Cheese Slices"],
    image: "/images/export (2)/Mega Crispy Chicken.png"
  },
  {
    id: "burger-mega-truffle",
    name: "ميقا ترافل",
    nameEn: "Mega Truffle",
    category: "mega",
    price: 65,
    ingredients: ["شريحتين لحم 180 غ", "خص طازج", "صوص ترافل", "شريحتين جبن شيدار"],
    ingredientsEn: ["Two 180g Beef Patties", "Fresh Lettuce", "Truffle Sauce", "Two Cheddar Cheese Slices"],
    image: "/images/export (2)/Mega Truffle.png"
  },
  {
    id: "burger-mega-black-white",
    name: "ميقا بلاك وايت",
    nameEn: "Mega Black White",
    category: "mega",
    price: 75,
    ingredients: ["شريحتين لحم 240 غ", "خص طازج", "صوص بيجي", "ثلاث شرايح جبن شيدار"],
    ingredientsEn: ["Two 240g Beef Patties", "Fresh Lettuce", "Biggy Sauce", "Three Cheddar Cheese Slices"],
    image: "/images/export (2)/Mega Black White.png"
  },

  // --- BUCKETS ---
  {
    id: "bucket-nuggets",
    name: "سطل نيوغتس فرايز",
    nameEn: "Nuggets Fries Bucket",
    category: "buckets",
    price: 50,
    description: "نيوغتس مقرمش مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار",
    descriptionEn: "Crispy nuggets with fries coated in Italian cheese sauce and cheddar sauce",
    image: "/images/export (2)/Nuggets Fries Bucket.png"
  },
  {
    id: "bucket-shrimp",
    name: "سطل الجمبري فرايز",
    nameEn: "Shrimp Fries Bucket",
    category: "buckets",
    price: 65,
    description: "جمبري مقرمش + بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار",
    descriptionEn: "Crispy shrimp + fries coated in Italian cheese sauce and cheddar sauce",
    image: "/images/export (2)/Shrimp Fries Bucket.png"
  },
  {
    id: "bucket-steak",
    name: "سطل ستيك فرايز",
    nameEn: "Steak Fries Bucket",
    category: "buckets",
    price: 70,
    description: "لحم مشوي+ بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار",
    descriptionEn: "Grilled steak + fries coated in Italian cheese sauce and cheddar sauce",
    image: "/images/export (1)/سطل ستيك فرايز.png"
  },
  {
    id: "bucket-chicken",
    name: "سطل شكن فرايز",
    nameEn: "Chicken Fries Bucket",
    category: "buckets",
    price: 55,
    description: "صدور دجاج مقرمش مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار",
    descriptionEn: "Crispy chicken breasts with fries coated in Italian cheese sauce and cheddar sauce",
    image: "/images/export (1)/سطل شكن فرايز.png"
  },

  // --- BOXES ---
  {
    id: "box-twin-classica",
    name: "توين كلاسيكا",
    nameEn: "Twin Classica",
    category: "boxes",
    price: 60,
    description: "اثنين لحم مع صوص جانبي",
    descriptionEn: "Two beef burgers with side sauce",
    image: "/images/export (1)/توين كلاسيكا.png"
  },
  {
    id: "box-twin-chicken",
    name: "توين كرسبي شكن",
    nameEn: "Twin Crispy Chicken",
    category: "boxes",
    price: 60,
    description: "اثنين برغر دجاج مقرمش مع صوص جانبي",
    descriptionEn: "Two crispy chicken burgers with side sauce",
    image: "/images/export (1)/توين كرسبي شكن.png"
  },
  {
    id: "box-twin-mix",
    name: "توين مكس",
    nameEn: "Twin Mix",
    category: "boxes",
    price: 60,
    description: "برغر دجاج مقرمش مع برغر لحم مشوي مع صوص جانبي",
    descriptionEn: "Crispy chicken burger with grilled beef burger and side sauce",
    image: "/images/export (1)/توين مكس.png"
  },
  {
    id: "box-mini-mix",
    name: "ميني مكس بوكس",
    nameEn: "Mini Mix Box",
    category: "boxes",
    price: 80,
    description: "ميني برجر باللحم + ميني برجر بالدجاج المقرمش تقدم مع صوص جانبي",
    descriptionEn: "Mini Beef Burgers + Mini Crispy Chicken Burgers with side sauce",
    image: "/images/export (3)/ميني مكس بوكس (Mini Mix Box).png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "6 قطع", nameEn: "6 pcs", price: 80 },
        { name: "12 قطعة", nameEn: "12 pcs", price: 150 },
        { name: "24 قطعة", nameEn: "24 pcs", price: 280 }
      ]
    }
  },
  {
    id: "box-mini-beef",
    name: "ميني بيف بوكس",
    nameEn: "Mini Beef Box",
    category: "boxes",
    price: 85,
    description: "ميني برجر باللحم تقدم مع صوص جانبي",
    descriptionEn: "Mini Beef Burgers with side sauce",
    image: "/images/export (3)/ميني بيف بوكس (Mini Beef Box).png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "6 قطع", nameEn: "6 pcs", price: 85 },
        { name: "12 قطعة", nameEn: "12 pcs", price: 160 },
        { name: "24 قطعة", nameEn: "24 pcs", price: 300 }
      ]
    }
  },
  {
    id: "box-mini-crunch",
    name: "ميني كرنش بوكس",
    nameEn: "Mini Crunch Box",
    category: "boxes",
    price: 85,
    description: "ميني برجر بالدجاج المقرمش تقدم مع صوص جانبي",
    descriptionEn: "Mini Crispy Chicken Burgers with side sauce",
    image: "/images/export (3)/ميني كرنش بوكس (Mini Crunch Box).png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "6 قطع", nameEn: "6 pcs", price: 85 },
        { name: "12 قطعة", nameEn: "12 pcs", price: 160 },
        { name: "24 قطعة", nameEn: "24 pcs", price: 300 }
      ]
    }
  },

  // --- CRISPY BITES ---
  {
    id: "bites-shrimp",
    name: "قطع جمبري مقرمش",
    nameEn: "Crispy Shrimp Bites",
    category: "bites",
    price: 35,
    description: "قطع جمبري مقرمش تقدم مع صوص جانبي",
    descriptionEn: "Crispy shrimp pieces served with side sauce",
    image: "/images/export (4)/Crispy Shrimp Bites.png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "6 قطع", nameEn: "6 pcs", price: 35 },
        { name: "9 قطع", nameEn: "9 pcs", price: 50 }
      ]
    }
  },
  {
    id: "bites-cheese",
    name: "قطع كرسبي شيز",
    nameEn: "Crispy Cheese Bites",
    category: "bites",
    price: 25,
    description: "قطع جبن مقرمش تقدم مع صوص جانبي",
    descriptionEn: "Crispy cheese pieces served with side sauce",
    image: "/images/export (4)/Crispy Cheese Bites.png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "3 قطع", nameEn: "3 pcs", price: 25 },
        { name: "5 قطع", nameEn: "5 pcs", price: 35 }
      ]
    }
  },
  {
    id: "bites-chicken",
    name: "قطع كرسبي شكن",
    nameEn: "Crispy Chicken Bites",
    category: "bites",
    price: 30,
    description: "قطع صدور دجاج مقرمش تقدم مع صوص جانبي",
    descriptionEn: "Crispy chicken breast pieces served with side sauce",
    image: "/images/export (4)/Crispy Chicken Bites.png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "3 قطع", nameEn: "3 pcs", price: 30 },
        { name: "5 قطع", nameEn: "5 pcs", price: 45 }
      ]
    }
  },
  {
    id: "bites-nuggets",
    name: "قطع كرسبي نيوغتس",
    nameEn: "Crispy Nuggets Bites",
    category: "bites",
    price: 25,
    description: "قطع نيوغتس مقرمش تقدم مع صوص جانبي",
    descriptionEn: "Crispy nuggets pieces served with side sauce",
    image: "/images/export (4)/Crispy Nuggets Bites.png",
    options: {
      label: "اختر العدد",
      labelEn: "Choose Quantity",
      items: [
        { name: "6 قطع", nameEn: "6 pcs", price: 25 },
        { name: "9 قطع", nameEn: "9 pcs", price: 35 }
      ]
    }
  },

  // --- PASTA ---
  {
    id: "pasta-alfredo",
    name: "باستا ألفريدو",
    nameEn: "Alfredo Pasta",
    category: "pasta",
    price: 45,
    ingredients: ["صلصة روزا الإيطالية", "قطع دجاج", "جبن البرميزون", "أوريغانو", "ريحان", "شرائح الفطر"],
    ingredientsEn: ["Italian Rosa Sauce", "Chicken Pieces", "Parmesan Cheese", "Oregano", "Basil", "Mushroom Slices"],
    image: "/images/export (5)/باستا ألفريدو.png"
  },
  {
    id: "pasta-truffle",
    name: "باستا دي تريفوليو",
    nameEn: "Di Tartufo Pasta",
    category: "pasta",
    price: 55,
    ingredients: ["صلصة الترافل الكريمية", "ريحان", "جبن البرميزون", "أوريغانو"],
    ingredientsEn: ["Creamy Truffle Sauce", "Basil", "Parmesan Cheese", "Oregano"],
    image: "/images/export (5)/باستا دي تارتوفو.png"
  },
  {
    id: "pasta-bolognese",
    name: "باستا بولوناز",
    nameEn: "Bolognese Pasta",
    category: "pasta",
    price: 48,
    ingredients: ["صلصة البولوناز الإيطالية", "لحم مفروم", "جبن البرميزون", "ريحان"],
    ingredientsEn: ["Italian Bolognese Sauce", "Minced Meat", "Parmesan Cheese", "Basil"],
    image: "/images/export (5)/باستا بولونيز.png"
  },
  {
    id: "pasta-arrabbiata",
    name: "باستا لارابياتا",
    nameEn: "Arrabbiata Pasta",
    category: "pasta",
    price: 40,
    ingredients: ["صلصة الطماطم الإيطالية", "ريحان", "جبن البرميزون"],
    ingredientsEn: ["Italian Tomato Sauce", "Basil", "Parmesan Cheese"],
    image: "/images/export (5)/باستا أرابياتا.png"
  },

  // --- SAUCES ---
  {
    id: "sauce-cocktail",
    name: "صوص كوكتال",
    nameEn: "Cocktail Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (6)/صوص كوكتال (Cocktail Sauce).png"
  },
  {
    id: "sauce-truffle",
    name: "صوص ترافل",
    nameEn: "Truffle Sauce",
    category: "sauces",
    price: 7,
    image: "/images/export (6)/صوص ترافل (Truffle Sauce).png"
  },
  {
    id: "sauce-bbq",
    name: "صوص بربيكيو",
    nameEn: "BBQ Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (6)/صوص بربيكيو (BBQ Sauce).png"
  },
  {
    id: "sauce-biggy",
    name: "صوص بيجي",
    nameEn: "Biggy Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (6)/صوص بيجي (Biggy Sauce).png"
  },
  {
    id: "sauce-spicy",
    name: "صوص سبايسي",
    nameEn: "Spicy Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (6)/صوص سبايسي (Spicy Sauce).png"
  },
  {
    id: "sauce-italian-cheese",
    name: "صوص الجبن الإيطالية",
    nameEn: "Italian Cheese Sauce",
    category: "sauces",
    price: 6,
    image: "/images/export (7)/صوص الجبن الإيطالية - Italian Cheese Sauce.png"
  },
  {
    id: "sauce-burger",
    name: "صوص برغر",
    nameEn: "Burger Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (7)/صوص برغر - Burger Sauce.png"
  },
  {
    id: "sauce-cheddar",
    name: "صوص شيدار",
    nameEn: "Cheddar Sauce",
    category: "sauces",
    price: 5,
    image: "/images/export (7)/صوص شيدار - Cheddar Sauce.png"
  },

  // --- EXTRAS ---
  {
    id: "extra-fries-small",
    name: "بطاطس صغير",
    nameEn: "Small Fries",
    category: "extras",
    price: 10,
    image: "/images/export (7)/بطاطس صغير - Small Fries.png"
  },
  {
    id: "extra-fries-large",
    name: "بطاطس كبير",
    nameEn: "Large Fries",
    category: "extras",
    price: 15,
    image: "/images/export (7)/بطاطس كبير - Large Fries.png"
  },

  // --- DRINKS ---
  { id: "drink-coca", name: "كوكاكولا", nameEn: "Coca Cola", category: "drinks", price: 6, image: "/images/export (8)/كوكاكولا.png" },
  { id: "drink-coke-zero", name: "كوكازيرو", nameEn: "Coca Zero", category: "drinks", price: 6, image: "/images/export (8)/كوكازيرو.png" },
  { id: "drink-sprite", name: "سبرايت", nameEn: "Sprite", category: "drinks", price: 6, image: "/images/export (8)/سبرايت.png" },
  { id: "drink-fanta", name: "فنتا", nameEn: "Fanta", category: "drinks", price: 6, image: "/images/export (8)/فنتا.png" },
  { id: "drink-pepsi", name: "بيبسي", nameEn: "Pepsi", category: "drinks", price: 6, image: "/images/export (9)/بيبسي Pepsi.png" },
  { id: "drink-water", name: "ماء 330ml", nameEn: "Water 330ml", category: "drinks", price: 3, image: "/images/export (9)/ماء 330ml Water 330ml.png" },

  // --- DESSERTS ---
  { id: "dessert-tiramisu", name: "تيراميسو", nameEn: "Tiramisu", category: "desserts", price: 28, image: "/images/export (9)/تيراميسو Tiramisu.png" },
  { id: "dessert-cookies-white", name: "كوكيز أبيض", nameEn: "White Cookies", category: "desserts", price: 15, image: "/images/export (9)/كوكيز أبيض White Cookies.png" },
  { id: "dessert-cookies-choco", name: "كوكيز شكلاطة", nameEn: "Chocolate Cookies", category: "desserts", price: 15, image: "/images/export (9)/كوكيز شكلاطة Chocolate Cookies.png" }
];
