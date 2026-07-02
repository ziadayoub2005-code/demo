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
      price?: string;
    }[];
  };
  price?: string;
  category: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
}

export const categories: Category[] = [
  { id: "burgers", name: "البرغر", nameEn: "Burgers" },
  { id: "mega-burgers", name: "ميقا برغر", nameEn: "Mega Burgers" },
  { id: "buckets", name: "سطل اللمة", nameEn: "Gathering Buckets" },
  { id: "boxes", name: "البوكسات", nameEn: "Boxes" },
  { id: "bites", name: "كرسبي بايتس", nameEn: "Crispy Bites" },
  { id: "pasta", name: "الباستا", nameEn: "Pasta" },
  { id: "sauces", name: "الصوصات", nameEn: "Sauces" },
  { id: "sides", name: "الإضافات", nameEn: "Sides" },
  { id: "drinks", name: "المشروبات", nameEn: "Drinks" },
  { id: "desserts", name: "الحلا", nameEn: "Desserts" }
];

export const menuItems: MenuItem[] = [
  // --- MEGA BURGERS ---
  {
    id: "mega-crispy-chicken",
    name: "ميقا كرسبي شكن",
    nameEn: "Mega Crispy Chicken",
    description: "الحجم الكبير والمضاعف من الدجاج المقرمش مع شريحتين جبن وصوص كوكتال.",
    descriptionEn: "The double large size of crispy chicken with two cheese slices and cocktail sauce.",
    ingredients: ["دجاج كرسبي دبل", "خص طازج", "صوص كوكتال", "شريحتين جبن شيدار"],
    ingredientsEn: ["Double crispy chicken", "Fresh lettuce", "Cocktail sauce", "2 Cheddar cheese slices"],
    category: "mega-burgers",
    image: "/images/mega_crispy.png"
  },
  {
    id: "mega-truffle",
    name: "ميقا ترافل",
    nameEn: "Mega Truffle",
    description: "شريحتين من اللحم الفاخر بوزن 180 غرام مع صوص الترافل الفاخر والجبن المزدوج.",
    descriptionEn: "Two premium beef patties (180g) with luxurious truffle sauce and double cheese.",
    ingredients: ["شريحتين لحم 180 غ", "خص طازج", "صوص ترافل", "شريحتين جبن شيدار"],
    ingredientsEn: ["2 Beef patties 180g", "Fresh lettuce", "Truffle sauce", "2 Cheddar cheese slices"],
    category: "mega-burgers",
    image: "/images/mega_truffle.png"
  },
  {
    id: "mega-black-white",
    name: "ميقا بلاك وايت",
    nameEn: "Mega Black White",
    description: "برغر الميقا الأضخم بشريحتين لحم 240 غرام مع ثلاث شرائح جبنة شيدر غنية.",
    descriptionEn: "The largest mega burger with two 240g beef patties and three rich cheddar cheese slices.",
    ingredients: ["شريحتين لحم 240 غ", "خص طازج", "صوص بيجي", "ثلاث شرائح جبن شيدار"],
    ingredientsEn: ["2 Beef patties 240g", "Fresh lettuce", "Biggie sauce", "3 Cheddar cheese slices"],
    category: "mega-burgers",
    image: "/images/mega_black_white.png"
  },

  // --- BURGERS ---
  {
    id: "burger-truffle",
    name: "ترافل",
    nameEn: "Truffle Burger",
    category: "burgers",
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص ترافل", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Truffle Sauce", "Cheddar Cheese Slice"],
    description: "شريحة لحم فاخرة 90 غرام مع صوص الترافل الغني والجبن السويسري اللذيذ.",
    descriptionEn: "Premium 90g beef patty with rich truffle sauce and delicious melted cheddar cheese.",
    image: "/images/burger_truffle_chalk.png"
  },
  {
    id: "burger-mexican",
    name: "مكسيكان",
    nameEn: "Mexican Burger",
    category: "burgers",
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص مكسيكان سبايسي", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Spicy Mexican Sauce", "Cheddar Cheese Slice"],
    description: "شريحة لحم 90 غرام مع صوص مكسيكان حار ولذيذ لعشاق النكهات السبايسي.",
    descriptionEn: "Spicy 90g beef patty with hot Mexican sauce, fresh lettuce, and cheddar cheese.",
    image: "/images/burger_mexican_chalk.png"
  },
  {
    id: "burger-crispy-chicken",
    name: "كرسبي شكن",
    nameEn: "Crispy Chicken",
    category: "burgers",
    ingredients: ["دجاج مقرمش", "خص طازج", "صوص كوكتال", "شريحة جبن شيدار"],
    ingredientsEn: ["Crispy Chicken", "Fresh Lettuce", "Cocktail Sauce", "Cheddar Cheese Slice"],
    description: "صدر دجاج مقرمش وذهبي مع صوص الكوكتيل المميز والجبن الشيدر.",
    descriptionEn: "Crispy golden chicken breast with special cocktail sauce and cheddar cheese.",
    image: "/crispy-chicken.png"
  },
  {
    id: "burger-classica",
    name: "كلاسيكا",
    nameEn: "Classica Burger",
    category: "burgers",
    ingredients: ["شريحة لحم 90 غ", "خص طازج", "صوص بيجي", "شريحة جبن شيدار"],
    ingredientsEn: ["90g Beef Patty", "Fresh Lettuce", "Biggy Sauce", "Cheddar Cheese Slice"],
    description: "برغر اللحم الكلاسيكي المحضر بالطريقة التقليدية مع صوص بيجي اللذيذ.",
    descriptionEn: "Classic beef burger prepared traditionally with tasty Biggy sauce.",
    image: "/classica-burger.png"
  },
  {
    id: "burger-black-white",
    name: "بلاك وايت",
    nameEn: "Black White Burger",
    category: "burgers",
    ingredients: ["شريحة لحم 120 غ", "خص طازج", "صوص بيجي", "شريحتين جبن شيدار"],
    ingredientsEn: ["120g Beef Patty", "Fresh Lettuce", "Biggy Sauce", "Two Cheddar Cheese Slices"],
    description: "برغر مميز بشريحة لحم سميكة 120 غرام مع شريحتين من جبن الشيدر الغني.",
    descriptionEn: "Special burger with a thick 120g beef patty and double cheddar cheese.",
    image: "/images/burger_black_white_chalk.png"
  },
  {
    id: "burger-crispy-shrimp",
    name: "جمبري كرسبي",
    nameEn: "Crispy Shrimp Burger",
    category: "burgers",
    ingredients: ["جمبري مقرمش", "أفوكادو", "خص طازج", "بصل مخلل", "صوص بيجي", "جبن شيدار"],
    ingredientsEn: ["Crispy Shrimp", "Avocado", "Fresh Lettuce", "Pickled Onion", "Biggy Sauce", "Cheddar Cheese"],
    description: "جمبري مقرمش ومبهر مع قطع الأفوكادو الطازجة، البصل المخلل، وجبن الشيدر السائل.",
    descriptionEn: "Crispy seasoned shrimp with fresh avocado slices, pickled onions, and cheddar cheese.",
    image: "/crispy-shrimp.png"
  },


  // --- GATHERING BUCKETS ---
  {
    id: "bucket-nuggets",
    name: "سطل نيوغتس فرايز",
    nameEn: "Nuggets Fries Bucket",
    category: "buckets",
    description: "نيوغتس مقرمش مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار.",
    descriptionEn: "Crispy nuggets and French fries smothered in Italian cheese sauce and cheddar cheese sauce.",
    image: "/bucket-nuggets.png"
  },
  {
    id: "bucket-shrimp",
    name: "سطل الجمبري فرايز",
    nameEn: "Shrimp Fries Bucket",
    category: "buckets",
    description: "جمبري مقرمش مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار.",
    descriptionEn: "Crispy shrimp and French fries smothered in Italian cheese sauce and cheddar cheese sauce.",
    image: "/bucket-shrimp.png"
  },
  {
    id: "bucket-steak",
    name: "سطل ستيك فرايز",
    nameEn: "Steak Fries Bucket",
    category: "buckets",
    description: "لحم مشوي مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار.",
    descriptionEn: "Grilled steak slices and French fries smothered in Italian cheese sauce and cheddar cheese sauce.",
    image: "/bucket-steak.png"
  },
  {
    id: "bucket-chicken",
    name: "سطل شكن فرايز",
    nameEn: "Chicken Fries Bucket",
    category: "buckets",
    description: "صدور دجاج مقرمش مع بطاطس مطلي بصوص الجبن الإيطالية وصوص الشيدار.",
    descriptionEn: "Crispy chicken breast chunks and French fries smothered in Italian cheese sauce and cheddar cheese sauce.",
    image: "/bucket-chicken.png"
  },

  // --- BOXES ---
  {
    id: "box-twin-classica",
    name: "توين كلاسيكا",
    nameEn: "Twin Classica Box",
    category: "boxes",
    description: "اثنين لحم مع صوص جانبي.",
    descriptionEn: "Two classic beef burgers served with a side sauce of your choice.",
    image: "/box-twin-classica.png"
  },
  {
    id: "box-twin-crispy",
    name: "توين كرسبي شكن",
    nameEn: "Twin Crispy Chicken Box",
    category: "boxes",
    description: "اثنين برغر دجاج مقرمش مع صوص جانبي.",
    descriptionEn: "Two crispy chicken burgers served with a side sauce of your choice.",
    image: "/box-twin-crispy.png"
  },
  {
    id: "box-twin-mix",
    name: "توين مكس",
    nameEn: "Twin Mix Box",
    category: "boxes",
    description: "برغر دجاج مقرمش مع برغر لحم مشوي مع صوص جانبي.",
    descriptionEn: "One crispy chicken burger and one grilled beef burger served with a side sauce.",
    image: "/box-twin-mix.png"
  },
  {
    id: "box-mini-mix",
    name: "ميني مكس بوكس",
    nameEn: "Mini Mix Box",
    category: "boxes",
    description: "بوكس ميني برغر مشكل من اللحم والدجاج المقرمش تقدم مع صوص جانبي.",
    descriptionEn: "Assorted box of mini beef and crispy chicken burgers served with a side sauce.",
    image: "/box-mini-mix.png",
    options: {
      label: "اختر حجم البوكس",
      labelEn: "Select Box Size",
      items: [
        { name: "6 ميني برغر (3 لحم + 3 دجاج مقرمش)", nameEn: "6 Pieces (3 Beef + 3 Chicken)" },
        { name: "12 ميني برغر (6 لحم + 6 دجاج مقرمش)", nameEn: "12 Pieces (6 Beef + 6 Chicken)" },
        { name: "24 ميني برغر (12 لحم + 12 دجاج مقرمش)", nameEn: "24 Pieces (12 Beef + 12 Chicken)" }
      ]
    }
  },
  {
    id: "box-mini-beef",
    name: "ميني بيف بوكس",
    nameEn: "Mini Beef Box",
    category: "boxes",
    description: "بوكس ميني برجر باللحم تقدم مع صوص جانبي.",
    descriptionEn: "Box of mini beef burgers served with a side sauce.",
    image: "/box-mini-beef.png",
    options: {
      label: "اختر حجم البوكس",
      labelEn: "Select Box Size",
      items: [
        { name: "6 ميني برغر لحم", nameEn: "6 Pieces Mini Beef Burgers" },
        { name: "12 ميني برغر لحم", nameEn: "12 Pieces Mini Beef Burgers" },
        { name: "24 ميني برغر لحم", nameEn: "24 Pieces Mini Beef Burgers" }
      ]
    }
  },
  {
    id: "box-mini-crunch",
    name: "ميني كرنش بوكس",
    nameEn: "Mini Crunch Box",
    category: "boxes",
    description: "بوكس ميني برجر بالدجاج المقرمش تقدم مع صوص جانبي.",
    descriptionEn: "Box of mini crispy chicken burgers served with a side sauce.",
    image: "/box-mini-crunch.png",
    options: {
      label: "اختر حجم البوكس",
      labelEn: "Select Box Size",
      items: [
        { name: "6 ميني برغر دجاج مقرمش", nameEn: "6 Pieces Mini Chicken Burgers" },
        { name: "12 ميني برغر دجاج مقرمش", nameEn: "12 Pieces Mini Chicken Burgers" },
        { name: "24 ميني برغر دجاج مقرمش", nameEn: "24 Pieces Mini Chicken Burgers" }
      ]
    }
  },

  // --- CRISPY BITES ---
  {
    id: "bites-shrimp",
    name: "قطع جمبري مقرمش",
    nameEn: "Crispy Shrimp Bites",
    category: "bites",
    description: "قطع جمبري مقرمش تقدم مع صوص جانبي.",
    descriptionEn: "Crispy shrimp bites served with a side sauce.",
    image: "/bites-shrimp.png",
    options: {
      label: "عدد القطع",
      labelEn: "Number of Pieces",
      items: [
        { name: "6 قطع", nameEn: "6 Pieces" },
        { name: "9 قطع", nameEn: "9 Pieces" },
        { name: "12 قطعة", nameEn: "12 Pieces" }
      ]
    }
  },
  {
    id: "bites-cheese",
    name: "قطع كرسبي شيز",
    nameEn: "Crispy Cheese Bites",
    category: "bites",
    description: "قطع جبن مقرمشة تقدم مع صوص جانبي.",
    descriptionEn: "Crispy cheese bites served with a side sauce.",
    image: "/bites-cheese.png",
    options: {
      label: "عدد القطع",
      labelEn: "Number of Pieces",
      items: [
        { name: "3 قطع", nameEn: "3 Pieces" },
        { name: "6 قطع", nameEn: "6 Pieces" },
        { name: "9 قطع", nameEn: "9 Pieces" }
      ]
    }
  },
  {
    id: "bites-chicken",
    name: "قطع كرسبي شكن",
    nameEn: "Crispy Chicken Bites",
    category: "bites",
    description: "قطع صدور دجاج مقرمشة تقدم مع صوص جانبي.",
    descriptionEn: "Crispy chicken breast chunks served with a side sauce.",
    image: "/images/bites_chicken.png",
    options: {
      label: "عدد القطع",
      labelEn: "Number of Pieces",
      items: [
        { name: "3 قطع", nameEn: "3 Pieces" },
        { name: "6 قطع", nameEn: "6 Pieces" },
        { name: "9 قطع", nameEn: "9 Pieces" }
      ]
    }
  },
  {
    id: "bites-nuggets",
    name: "قطع كرسبي نيوغتس",
    nameEn: "Crispy Nuggets",
    category: "bites",
    description: "قطع نيوغتس دجاج مقرمشة تقدم مع صوص جانبي.",
    descriptionEn: "Crispy chicken nuggets served with a side sauce.",
    image: "/images/bites_nuggets.png",
    options: {
      label: "عدد القطع",
      labelEn: "Number of Pieces",
      items: [
        { name: "6 قطع", nameEn: "6 Pieces" },
        { name: "9 قطع", nameEn: "9 Pieces" },
        { name: "12 قطعة", nameEn: "12 Pieces" }
      ]
    }
  },

  // --- PASTA ---
  {
    id: "pasta-alfredo",
    name: "باستا ألفريدو",
    nameEn: "Pasta Alfredo",
    category: "pasta",
    ingredients: ["صلصة روزا الإيطالية", "قطع دجاج", "جبن بارميزان", "أوريغانو", "ريحان", "شرائح فطر"],
    ingredientsEn: ["Italian Rosa Sauce", "Chicken Chunks", "Parmesan Cheese", "Oregano", "Basil", "Mushroom Slices"],
    description: "باستا إيطالية فاخرة بصلصة روزا الغنية، الدجاج المشوي وشرائح الفطر الطازجة.",
    descriptionEn: "Luxury Italian pasta with rich Rosa sauce, grilled chicken, and fresh mushroom slices.",
    image: "/images/pasta_alfredo.png"
  },
  {
    id: "pasta-trifoglio",
    name: "باستا دي تريفوليو",
    nameEn: "Pasta di Trifoglio",
    category: "pasta",
    ingredients: ["صلصة الترافل الكريمية", "ريحان", "جبن بارميزان", "أوريغانو"],
    ingredientsEn: ["Creamy Truffle Sauce", "Basil", "Parmesan Cheese", "Oregano"],
    description: "باستا بصلصة الترافل الكريمية الفاخرة مع جبنة البارميزان وأوراق الريحان الطازجة.",
    descriptionEn: "Pasta in premium creamy truffle sauce topped with parmesan cheese and fresh basil.",
    image: "/images/pasta_trifoglio.png"
  },
  {
    id: "pasta-bolognese",
    name: "باستا بولوناز",
    nameEn: "Pasta Bolognese",
    category: "pasta",
    ingredients: ["صلصة البولوناز الإيطالية", "لحم مفروم", "جبن بارميزان", "ريحان"],
    ingredientsEn: ["Italian Bolognese Sauce", "Minced Beef", "Parmesan Cheese", "Basil"],
    description: "الباستا الكلاسيكية بصلصة الطماطم واللحم المفروم والبهارات الإيطالية وجبن البارميزان.",
    descriptionEn: "Classic pasta in rich tomato and minced beef Bolognese sauce, topped with parmesan.",
    image: "/images/pasta_bolognese.png"
  },
  {
    id: "pasta-arrabbiata",
    name: "باستا لارابياتا",
    nameEn: "Pasta l'Arrabbiata",
    category: "pasta",
    ingredients: ["صلصة الطماطم الإيطالية", "ريحان", "جبن بارميزان"],
    ingredientsEn: ["Italian Tomato Sauce", "Basil", "Parmesan Cheese"],
    description: "باستا بصلصة الطماطم الحارة مع الثوم والزيت والريحان والجبن المبشور.",
    descriptionEn: "Spicy Italian pasta in hot tomato sauce with garlic, fresh basil, and parmesan.",
    image: "/images/pasta_arrabbiata.png"
  },

  // --- SAUCES ---
  { id: "sauce-cocktail", name: "صوص كوكتال", nameEn: "Cocktail Sauce", category: "sauces", image: "/images/sauce_cocktail.png" },
  { id: "sauce-spicy", name: "صوص سبايسي", nameEn: "Spicy Sauce", category: "sauces", image: "/images/sauce_spicy.png" },
  { id: "sauce-truffle", name: "صوص ترافل", nameEn: "Truffle Sauce", category: "sauces", image: "/images/sauce_truffle.png" },
  { id: "sauce-italian", name: "صوص الجبن الإيطالية", nameEn: "Italian Cheese Sauce", category: "sauces", image: "/images/sauce_italian.png" },
  { id: "sauce-bbq", name: "صوص بربيكيو", nameEn: "BBQ Sauce", category: "sauces", image: "/images/sauce_bbq.png" },
  { id: "sauce-burger", name: "صوص برغر", nameEn: "Burger Sauce", category: "sauces", image: "/images/sauce_burger.png" },
  { id: "sauce-biggie", name: "صوص بيجي", nameEn: "Biggie Sauce", category: "sauces", image: "/images/sauce_biggie.png" },
  { id: "sauce-cheddar", name: "صوص شيدار", nameEn: "Cheddar Sauce", category: "sauces", image: "/images/sauce_cheddar.png" },

  // --- SIDES ---
  { id: "side-fries-small", name: "بطاطس صغير", nameEn: "Small French Fries", category: "sides", image: "/images/side_fries_small.png" },
  { id: "side-fries-large", name: "بطاطس كبير", nameEn: "Large French Fries", category: "sides", image: "/images/side_fries_large.png" },

  // --- DRINKS ---
  { id: "drink-coke-zero", name: "كوكا زيرو", nameEn: "Coca Zero", category: "drinks", image: "/images/drink_coca_zero.png" },
  { id: "drink-sprite", name: "سبرايت", nameEn: "Sprite", category: "drinks", image: "/images/drink_sprite.png" },
  { id: "drink-fanta", name: "فانتا", nameEn: "Fanta", category: "drinks", image: "/images/drink_fanta.png" },
  { id: "drink-coca", name: "كوكاكولا", nameEn: "Coca Cola", category: "drinks", image: "/images/drink_coca.png" },
  { id: "drink-pepsi", name: "بيبسي", nameEn: "Pepsi", category: "drinks", image: "/images/drink_pepsi.png" },
  { id: "drink-water", name: "ماء 330ml", nameEn: "Water 330ml", category: "drinks", image: "/images/drink_water.png" },

  // --- DESSERTS ---
  { id: "dessert-tiramisu", name: "تيراميسو", nameEn: "Tiramisu", category: "desserts", image: "/images/dessert_tiramisu.png" },
  { id: "dessert-cookies-white", name: "كوكيز أبيض", nameEn: "White Chocolate Cookies", category: "desserts", image: "/images/dessert_cookies_white.png" },
  { id: "dessert-cookies-choco", name: "كوكيز شوكولاتة", nameEn: "Chocolate Cookies", category: "desserts", image: "/images/dessert_cookies_choco.png" }
];

