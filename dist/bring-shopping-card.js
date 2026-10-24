/* Bring-style shopping list card (custom:bring-shopping-card)
 *   Shows a Home Assistant `todo` list the way the Bring! app does: big tappable
 *   tiles with an icon per item, grouped by shop category, plus a "recently used"
 *   section to put things back on the list with one tap.
 *
 *   - `entity` (required, NO default): the todo entity, picked in the graphical editor.
 *   - Tap an open tile  -> item is ticked off (todo status "completed").
 *   - Tap a recent tile -> item is put back on the list (status "needs_action").
 *   - Long-press a tile -> delete the item for good (asks for confirmation).
 *   - Typing in the add field offers suggestions from the built-in product
 *     catalogue and from the list history; Enter / "+" adds the item. An item that is
 *     already open is only highlighted; one that is in the history is re-activated
 *     instead of creating a duplicate.
 *   - Icons: every item name is matched against a keyword catalogue (accent/umlaut
 *     folding, German compound words matched by their head word, plural endings,
 *     one/two-character typo tolerance). No AI, no network — plain string scoring.
 *   - Layout is meant for phones: 3 columns by default, `columns: 2` for the
 *     biggest possible text.
 *   - `language`: "auto" (follows HA) | "de" | "en".
 *   No `mode` option: the list is the card, there is nothing to expand (same as
 *   select-button-card).
 * Code comments English; user-facing strings in localization/{de,en}.js
 * (category labels and the product names offered as suggestions included).
 *
 * config:
 *   type: custom:bring-shopping-card
 *   entity: todo.xxx
 *   title: Einkaufsliste       # optional
 *   columns: 3                 # optional, 2 | 3 | 4
 *   group_by_category: true    # optional
 *   show_recent: true          # optional
 *   recent_limit: 24           # optional
 *   color: "#ee5a45"           # optional header colour (theme colour name or CSS colour)
 *   language: auto             # optional
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
const DE = { "bring-shopping-card": {
  title: "Einkaufsliste",
  placeholder: "Artikel hinzufügen …",
  add: "Hinzufügen",
  open_n: (n) => n === 1 ? "1 Artikel offen" : n + " Artikel offen",
  all_done: "Alles erledigt – nichts mehr einzukaufen.",
  recent: "Zuletzt verwendet",
  no_entity: "Bitte im Karten-Editor eine To-do-Liste auswählen.",
  not_found: (e) => "Entität " + e + " nicht gefunden – bitte im Karten-Editor auswählen.",
  unavailable: "Die Liste ist gerade nicht erreichbar.",
  sug_new: "Neu",
  sug_recent: "Zuletzt",
  delete_confirm: (n) => "„" + n + "“ endgültig aus der Liste löschen?",
  hint_hold: "Lange drücken zum Löschen",
  e_entity: "To-do-Liste",
  e_title: "Titel (optional)",
  e_columns: "Spalten (2 = größte Schrift)",
  e_group: "Nach Kategorien gruppieren",
  e_recent: "„Zuletzt verwendet“ anzeigen",
  e_recent_limit: "Anzahl „Zuletzt verwendet“",
  e_color: "Kopf-Farbe",
  e_language: "Sprache",
  e_auto: "Automatisch (HA)",
  e_de: "Deutsch",
  e_en: "Englisch",
  cats: {
    produce: "Obst & Gemüse",
    bakery: "Brot & Gebäck",
    dairy: "Milch & Eier",
    meat: "Fleisch & Fisch",
    frozen: "Tiefkühl",
    pantry: "Vorrat",
    spices: "Gewürze & Saucen",
    snacks: "Süßes & Snacks",
    drinks: "Getränke",
    household: "Haushalt",
    care: "Drogerie & Pflege",
    other: "Sonstiges"
  },
  products: {
    apfel: "Apfel",
    birne: "Birne",
    banane: "Banane",
    orange: "Orange",
    zitrone: "Zitrone",
    trauben: "Trauben",
    beeren: "Beeren",
    kirschen: "Kirschen",
    ananas: "Ananas",
    melone: "Melone",
    mango: "Mango",
    kiwi: "Kiwi",
    avocado: "Avocado",
    granatapfel: "Granatapfel",
    feigen: "Feigen",
    maracuja: "Maracuja",
    tomaten: "Tomaten",
    gurke: "Gurke",
    paprika: "Paprika",
    chili: "Chili",
    karotten: "Karotten",
    kartoffeln: "Kartoffeln",
    zwiebeln: "Zwiebeln",
    knoblauch: "Knoblauch",
    fruehlingszwiebeln: "Frühlingszwiebeln",
    lauch: "Lauch",
    salat: "Salat",
    spinat: "Spinat",
    kraeuter: "Kräuter",
    brokkoli: "Brokkoli",
    kohl: "Kohl",
    zucchini: "Zucchini",
    pilze: "Pilze",
    mais: "Mais",
    ingwer: "Ingwer",
    brot: "Brot",
    broetchen: "Brötchen",
    baguette: "Baguette",
    croissant: "Croissant",
    brezel: "Brezel",
    kuchen: "Kuchen",
    muffin: "Muffins",
    milch: "Milch",
    pflanzenmilch: "Pflanzenmilch",
    butter: "Butter",
    kaese: "Käse",
    mascarpone: "Mascarpone",
    joghurt: "Joghurt",
    quark: "Quark",
    sahne: "Sahne",
    eier: "Eier",
    fleisch: "Fleisch",
    haehnchen: "Hähnchen",
    wurst: "Wurst",
    fisch: "Fisch",
    tiefkuehl: "Tiefkühlgemüse",
    nuggets: "Nuggets",
    pizza: "Pizza",
    pommes: "Pommes",
    eis: "Eis",
    nudeln: "Nudeln",
    reis: "Reis",
    mehl: "Mehl",
    zucker: "Zucker",
    backen: "Backpulver",
    muesli: "Müsli",
    konserven: "Konserven",
    huelsenfruechte: "Bohnen & Linsen",
    oel: "Öl",
    essig: "Essig",
    honig: "Honig",
    aufstrich: "Marmelade",
    suppe: "Suppe",
    salz: "Salz",
    gewuerze: "Gewürze",
    sauce: "Sauce",
    ketchup: "Ketchup",
    mayo: "Mayonnaise",
    senf: "Senf",
    tomatenmark: "Tomatenmark",
    oliven: "Oliven",
    schokolade: "Schokolade",
    suessigkeiten: "Süßigkeiten",
    kekse: "Kekse",
    chips: "Chips",
    popcorn: "Popcorn",
    nuesse: "Nüsse",
    erdnuesse: "Erdnüsse",
    wasser: "Wasser",
    saft: "Saft",
    limo: "Limonade",
    bier: "Bier",
    wein: "Wein",
    spirituosen: "Spirituosen",
    kaffee: "Kaffee",
    tee: "Tee",
    toilettenpapier: "Toilettenpapier",
    muelltueten: "Müllbeutel",
    folie: "Gefrierbeutel",
    spuelmittel: "Spülmaschinentabs",
    waschmittel: "Waschmittel",
    reiniger: "Reiniger",
    schwamm: "Schwamm",
    batterien: "Batterien",
    leuchtmittel: "Glühbirne",
    kerzen: "Kerzen",
    paketband: "Paketband",
    blumen: "Blumenerde",
    tierfutter: "Tierfutter",
    zahnpasta: "Zahnpasta",
    shampoo: "Shampoo",
    seife: "Seife",
    deo: "Deo",
    creme: "Creme",
    rasierer: "Rasierer",
    damenhygiene: "Damenhygiene",
    windeln: "Windeln",
    medikamente: "Medikamente",
    pflaster: "Pflaster",
    kosmetik: "Kosmetik"
  }
} };
const EN = { "bring-shopping-card": {
  title: "Shopping list",
  placeholder: "Add item …",
  add: "Add",
  open_n: (n) => n === 1 ? "1 item left" : n + " items left",
  all_done: "All done – nothing left to buy.",
  recent: "Recently used",
  no_entity: "Pick a to-do list in the card editor.",
  not_found: (e) => "Entity " + e + " not found – pick it in the card editor.",
  unavailable: "The list is currently unavailable.",
  sug_new: "New",
  sug_recent: "Recent",
  delete_confirm: (n) => "Permanently delete “" + n + "” from the list?",
  hint_hold: "Long-press to delete",
  e_entity: "To-do list",
  e_title: "Title (optional)",
  e_columns: "Columns (2 = largest text)",
  e_group: "Group by category",
  e_recent: "Show “Recently used”",
  e_recent_limit: "Number of “Recently used”",
  e_color: "Header colour",
  e_language: "Language",
  e_auto: "Automatic (HA)",
  e_de: "German",
  e_en: "English",
  cats: {
    produce: "Fruit & vegetables",
    bakery: "Bread & pastries",
    dairy: "Dairy & eggs",
    meat: "Meat & fish",
    frozen: "Frozen",
    pantry: "Pantry",
    spices: "Spices & sauces",
    snacks: "Sweets & snacks",
    drinks: "Drinks",
    household: "Household",
    care: "Health & beauty",
    other: "Other"
  },
  products: {
    apfel: "Apple",
    birne: "Pear",
    banane: "Banana",
    orange: "Orange",
    zitrone: "Lemon",
    trauben: "Grapes",
    beeren: "Berries",
    kirschen: "Cherries",
    ananas: "Pineapple",
    melone: "Melon",
    mango: "Mango",
    kiwi: "Kiwi",
    avocado: "Avocado",
    granatapfel: "Pomegranate",
    feigen: "Figs",
    maracuja: "Passion fruit",
    tomaten: "Tomatoes",
    gurke: "Cucumber",
    paprika: "Bell pepper",
    chili: "Chili",
    karotten: "Carrots",
    kartoffeln: "Potatoes",
    zwiebeln: "Onions",
    knoblauch: "Garlic",
    fruehlingszwiebeln: "Spring onions",
    lauch: "Leek",
    salat: "Lettuce",
    spinat: "Spinach",
    kraeuter: "Herbs",
    brokkoli: "Broccoli",
    kohl: "Cabbage",
    zucchini: "Zucchini",
    pilze: "Mushrooms",
    mais: "Corn",
    ingwer: "Ginger",
    brot: "Bread",
    broetchen: "Bread rolls",
    baguette: "Baguette",
    croissant: "Croissant",
    brezel: "Pretzel",
    kuchen: "Cake",
    muffin: "Muffins",
    milch: "Milk",
    pflanzenmilch: "Plant milk",
    butter: "Butter",
    kaese: "Cheese",
    mascarpone: "Mascarpone",
    joghurt: "Yogurt",
    quark: "Quark",
    sahne: "Cream",
    eier: "Eggs",
    fleisch: "Meat",
    haehnchen: "Chicken",
    wurst: "Sausage",
    fisch: "Fish",
    tiefkuehl: "Frozen vegetables",
    nuggets: "Nuggets",
    pizza: "Pizza",
    pommes: "Fries",
    eis: "Ice cream",
    nudeln: "Pasta",
    reis: "Rice",
    mehl: "Flour",
    zucker: "Sugar",
    backen: "Baking powder",
    muesli: "Muesli",
    konserven: "Canned food",
    huelsenfruechte: "Beans & lentils",
    oel: "Oil",
    essig: "Vinegar",
    honig: "Honey",
    aufstrich: "Jam",
    suppe: "Soup",
    salz: "Salt",
    gewuerze: "Spices",
    sauce: "Sauce",
    ketchup: "Ketchup",
    mayo: "Mayonnaise",
    senf: "Mustard",
    tomatenmark: "Tomato paste",
    oliven: "Olives",
    schokolade: "Chocolate",
    suessigkeiten: "Sweets",
    kekse: "Cookies",
    chips: "Chips",
    popcorn: "Popcorn",
    nuesse: "Nuts",
    erdnuesse: "Peanuts",
    wasser: "Water",
    saft: "Juice",
    limo: "Soda",
    bier: "Beer",
    wein: "Wine",
    spirituosen: "Spirits",
    kaffee: "Coffee",
    tee: "Tea",
    toilettenpapier: "Toilet paper",
    muelltueten: "Trash bags",
    folie: "Freezer bags",
    spuelmittel: "Dishwasher tabs",
    waschmittel: "Laundry detergent",
    reiniger: "Cleaner",
    schwamm: "Sponge",
    batterien: "Batteries",
    leuchtmittel: "Light bulb",
    kerzen: "Candles",
    paketband: "Packing tape",
    blumen: "Potting soil",
    tierfutter: "Pet food",
    zahnpasta: "Toothpaste",
    shampoo: "Shampoo",
    seife: "Soap",
    deo: "Deodorant",
    creme: "Lotion",
    rasierer: "Razor",
    damenhygiene: "Feminine care",
    windeln: "Diapers",
    medikamente: "Medicine",
    pflaster: "Plasters",
    kosmetik: "Cosmetics"
  }
} };
const I18N = { de: DE["bring-shopping-card"], en: EN["bring-shopping-card"] };

/* ---- product catalogue (icon matching + suggestions) ------------------------
 * [id, mdi icon, category, keywords]. Keywords are German + English, space
 * separated; case, accents and umlauts are folded before comparing. A leading "+"
 * marks a short head word that may also match as the end of a compound
 * ("+öl" -> Sonnenblumenöl). Display names live in localization (`products`). */
const CATS = {
  produce: "#4caf50", bakery: "#c98a4b", dairy: "#4fa3e0", meat: "#e0574f",
  frozen: "#2fb5c7", pantry: "#d9a441", spices: "#e07b39", snacks: "#d45d9a",
  drinks: "#3f7fd6", household: "#6c86b8", care: "#9b6bd1", other: "#8a8f98",
};
const CAT_ORDER = Object.keys(CATS);
const FALLBACK = { icon: "mdi:basket-outline", cat: "other" };

const P = [
  ["apfel", "mdi:food-apple", "produce", "apfel apple"],
  ["birne", "mdi:fruit-pear", "produce", "birne pear"],
  ["banane", "mdi:food-apple-outline", "produce", "banane banana"],
  ["orange", "mdi:fruit-citrus", "produce", "orange mandarine clementine satsuma tangerine"],
  ["zitrone", "mdi:fruit-citrus", "produce", "zitrone limette lemon lime"],
  ["trauben", "mdi:fruit-grapes", "produce", "traube weintraube grape grapes"],
  ["beeren", "mdi:fruit-cherries", "produce", "beere beeren erdbeere himbeere heidelbeere blaubeere brombeere johannisbeere berry strawberry raspberry blueberry blackberry"],
  ["kirschen", "mdi:fruit-cherries", "produce", "kirsche cherry cherries"],
  ["ananas", "mdi:fruit-pineapple", "produce", "ananas pineapple"],
  ["melone", "mdi:fruit-watermelon", "produce", "melone wassermelone honigmelone melon watermelon"],
  ["mango", "mdi:food-apple-outline", "produce", "mango papaya litschi kaki"],
  ["kiwi", "mdi:food-apple-outline", "produce", "kiwi"],
  ["avocado", "mdi:fruit-pear", "produce", "avocado"],
  ["granatapfel", "mdi:food-apple-outline", "produce", "granatapfel granatapfelkerne pomegranate"],
  ["feigen", "mdi:food-apple-outline", "produce", "feige feigen fig figs"],
  ["maracuja", "mdi:food-apple-outline", "produce", "maracuja passionsfrucht passion"],
  ["tomaten", "mdi:food-apple", "produce", "tomate tomaten cocktailtomaten tomato tomatoes"],
  ["gurke", "mdi:leaf", "produce", "gurke gurken cucumber"],
  ["paprika", "mdi:chili-mild", "produce", "paprika paprikaschote bell"],
  ["chili", "mdi:chili-hot", "produce", "chili chilis peperoni chilischote"],
  ["karotten", "mdi:carrot", "produce", "karotte karotten möhre möhren carrot carrots"],
  ["kartoffeln", "mdi:sack", "produce", "kartoffel kartoffeln süßkartoffel potato potatoes"],
  ["zwiebeln", "mdi:seed", "produce", "zwiebel zwiebeln schalotte onion onions shallot"],
  ["knoblauch", "mdi:seed-outline", "produce", "knoblauch garlic"],
  ["fruehlingszwiebeln", "mdi:sprout-outline", "produce", "frühlingszwiebel frühlingszwiebeln lauchzwiebel scallion"],
  ["lauch", "mdi:sprout-outline", "produce", "lauch porree leek"],
  ["salat", "mdi:sprout", "produce", "salat kopfsalat eisbergsalat rucola feldsalat lollo lettuce salad arugula"],
  ["spinat", "mdi:leaf", "produce", "spinat spinach mangold"],
  ["kraeuter", "mdi:sprout-outline", "produce", "kräuter basilikum petersilie schnittlauch dill minze koriander thymian rosmarin salbei herb herbs basil parsley chives mint cilantro thyme rosemary sage"],
  ["brokkoli", "mdi:leaf", "produce", "brokkoli broccoli blumenkohl cauliflower"],
  ["kohl", "mdi:leaf", "produce", "kohl kohlrabi rotkohl weißkohl wirsing rosenkohl cabbage"],
  ["zucchini", "mdi:leaf", "produce", "zucchini aubergine courgette eggplant"],
  ["pilze", "mdi:mushroom", "produce", "pilz pilze champignon champignons mushroom mushrooms"],
  ["mais", "mdi:corn", "produce", "mais maiskolben corn sweetcorn"],
  ["ingwer", "mdi:leaf", "produce", "ingwer ginger"],

  ["brot", "mdi:bread-slice", "bakery", "brot toast toastbrot vollkornbrot weißbrot bread"],
  ["broetchen", "mdi:bread-slice-outline", "bakery", "brötchen semmel schrippe roll rolls bun buns"],
  ["baguette", "mdi:baguette", "bakery", "baguette ciabatta fladenbrot"],
  ["croissant", "mdi:food-croissant", "bakery", "croissant hörnchen plunder"],
  ["brezel", "mdi:pretzel", "bakery", "brezel breze laugenbrezel laugenstange pretzel"],
  ["kuchen", "mdi:cake", "bakery", "kuchen torte cake"],
  ["muffin", "mdi:muffin", "bakery", "muffin muffins cupcake"],

  ["milch", "mdi:cow", "dairy", "milch vollmilch milk"],
  ["pflanzenmilch", "mdi:barley", "dairy", "hafermilch sojamilch mandelmilch haferdrink sojadrink pflanzenmilch kokosmilch oat soy almond coconut"],
  ["butter", "mdi:cube-outline", "dairy", "butter margarine"],
  ["kaese", "mdi:cheese", "dairy", "käse cheese gouda emmentaler parmesan mozzarella cheddar feta camembert gruyere frischkäse ricotta"],
  ["mascarpone", "mdi:cheese", "dairy", "mascarpone"],
  ["joghurt", "mdi:cup", "dairy", "joghurt jogurt yoghurt yogurt"],
  ["quark", "mdi:cup-outline", "dairy", "quark skyr"],
  ["sahne", "mdi:cup-water", "dairy", "sahne schlagsahne schmand cream"],
  ["eier", "mdi:egg", "dairy", "ei eier egg eggs"],

  ["fleisch", "mdi:food-steak", "meat", "fleisch steak rindfleisch schweinefleisch gulasch hackfleisch hack rind schwein schnitzel braten meat beef pork mince"],
  ["haehnchen", "mdi:food-drumstick", "meat", "hähnchen hühnchen huhn pute puten hähnchenbrust chicken turkey"],
  ["wurst", "mdi:sausage", "meat", "wurst bratwurst würstchen salami schinken lyoner leberwurst bacon speck wiener sausage ham"],
  ["fisch", "mdi:fish", "meat", "fisch lachs thunfisch forelle garnelen scampi seelachs shrimp fish salmon tuna"],

  ["tiefkuehl", "mdi:snowflake", "frozen", "tiefkühl tiefkühlgemüse tiefkühlkost tk frozen"],
  ["nuggets", "mdi:food-drumstick", "frozen", "nuggets"],
  ["pizza", "mdi:pizza", "frozen", "pizza flammkuchen"],
  ["pommes", "mdi:food-takeout-box-outline", "frozen", "pommes kroketten fries"],
  ["eis", "mdi:ice-cream", "frozen", "eis eiscreme speiseeis eiswürfel"],

  ["nudeln", "mdi:pasta", "pantry", "nudeln spaghetti penne fusilli tagliatelle makkaroni lasagne pasta noodles"],
  ["reis", "mdi:rice", "pantry", "reis basmati risotto rice"],
  ["mehl", "mdi:grain", "pantry", "mehl weizenmehl flour backmischung"],
  ["zucker", "mdi:spoon-sugar", "pantry", "zucker puderzucker vanillezucker sugar"],
  ["backen", "mdi:shaker-outline", "pantry", "backpulver hefe natron vanille yeast"],
  ["muesli", "mdi:barley", "pantry", "müsli muesli haferflocken cornflakes cereal oats granola"],
  ["konserven", "mdi:package-variant-closed", "pantry", "dose dosen konserve konserven canned tin"],
  ["huelsenfruechte", "mdi:seed", "pantry", "bohnen kidneybohnen linsen kichererbsen erbsen beans lentils chickpeas peas"],
  ["oel", "mdi:oil", "pantry", "+öl olivenöl sonnenblumenöl rapsöl pflanzenöl ölspray oil"],
  ["essig", "mdi:bottle-tonic-outline", "pantry", "essig apfelessig balsamico essigsäure vinegar"],
  ["honig", "mdi:bee", "pantry", "honig agavensirup ahornsirup sirup honey syrup"],
  ["aufstrich", "mdi:candy-outline", "pantry", "marmelade konfitüre nutella aufstrich jam spread erdnussbutter"],
  ["suppe", "mdi:pot-steam", "pantry", "suppe brühe bouillon fond soup broth"],

  ["salz", "mdi:shaker", "spices", "salz pfeffer salt pepper"],
  ["gewuerze", "mdi:shaker-outline", "spices", "gewürz gewürze paprikapulver curry chiliflocken oregano zimt muskat spice spices"],
  ["sauce", "mdi:bottle-soda-classic-outline", "spices", "sauce soße sosse soja sojasauce barbecue bbq dressing pesto sriracha tabasco dip hummus guacamole"],
  ["ketchup", "mdi:bottle-soda-classic", "spices", "ketchup"],
  ["mayo", "mdi:bottle-soda-classic-outline", "spices", "mayonnaise mayo remoulade"],
  ["senf", "mdi:bottle-soda-classic-outline", "spices", "senf mustard"],
  ["tomatenmark", "mdi:food-apple-outline", "spices", "tomatenmark passata"],
  ["oliven", "mdi:seed", "spices", "oliven kapern jalapenos pickles pickels essiggurke essiggurken sauerkraut olives capers"],

  ["schokolade", "mdi:candy", "snacks", "schokolade schoki schokodrops schokoriegel praline chocolate"],
  ["suessigkeiten", "mdi:candy-outline", "snacks", "süßigkeiten haribo gummibärchen bonbon lakritz candy gummy sweets"],
  ["kekse", "mdi:cookie", "snacks", "keks kekse plätzchen cookies biscuit biscuits oreo"],
  ["chips", "mdi:sack-outline", "snacks", "chips salzstangen flips knabbereien crisps snacks tortilla nachos"],
  ["popcorn", "mdi:popcorn", "snacks", "popcorn"],
  ["nuesse", "mdi:nut", "snacks", "nüsse nuss mandeln walnüsse haselnüsse cashew pistazien nuts almonds walnuts hazelnuts pistachios"],
  ["erdnuesse", "mdi:peanut", "snacks", "erdnuss erdnüsse erdnussflips peanut peanuts"],

  ["wasser", "mdi:water", "drinks", "wasser mineralwasser sprudel water"],
  ["saft", "mdi:bottle-soda-outline", "drinks", "saft apfelsaft orangensaft maracujasaft traubensaft juice smoothie schorle"],
  ["limo", "mdi:bottle-soda-classic", "drinks", "limonade limo cola spezi fanta sprite orangina eistee soda lemonade coke"],
  ["bier", "mdi:beer", "drinks", "bier pils radler helles weizen peroni beer"],
  ["wein", "mdi:bottle-wine", "drinks", "wein rotwein weißwein prosecco sekt champagner wine"],
  ["spirituosen", "mdi:liquor", "drinks", "schnaps gin vodka whisky rum likör spirituosen alkohol liquor spirits"],
  ["kaffee", "mdi:coffee", "drinks", "kaffee espresso kaffeebohnen nespresso kapseln kaffeekapseln coffee"],
  ["tee", "mdi:tea", "drinks", "+tee teebeutel tea"],

  ["toilettenpapier", "mdi:paper-roll", "household", "toilettenpapier klopapier zewa küchenrolle küchenpapier haushaltstücher taschentücher tempo toilet tissues"],
  ["muelltueten", "mdi:trash-can", "household", "müllbeutel müllsack mülltüte mülltüten müllsäcke trash garbage"],
  ["folie", "mdi:package-variant", "household", "gefrierbeutel frischhaltefolie alufolie backpapier folie freezer foil"],
  ["spuelmittel", "mdi:dishwasher", "household", "spülmittel geschirrspülmittel geschirrspülmaschinentabs geschirrspültabs spültabs tabs klarspüler dishwasher"],
  ["waschmittel", "mdi:washing-machine", "household", "waschmittel weichspüler waschpulver detergent laundry"],
  ["reiniger", "mdi:spray-bottle", "household", "reiniger putzmittel entkalker glasreiniger allzweckreiniger ceranfeldschaber cleaner descaler"],
  ["schwamm", "mdi:broom", "household", "schwamm schwämme putzlappen lappen spültuch sponge cloth"],
  ["batterien", "mdi:battery", "household", "batterie batterien akku battery batteries"],
  ["leuchtmittel", "mdi:lightbulb", "household", "glühbirne glühbirnen leuchtmittel lampe led bulb"],
  ["kerzen", "mdi:candle", "household", "kerze kerzen candle candles"],
  ["paketband", "mdi:package-variant", "household", "paketband klebeband paketklebeband tape"],
  ["blumen", "mdi:flower", "household", "blumen blumenerde erde pflanzen dünger flowers soil plant fertilizer"],
  ["tierfutter", "mdi:paw", "household", "katzenfutter hundefutter tierfutter futter katzenstreu pet"],

  ["zahnpasta", "mdi:toothbrush-paste", "care", "zahnpasta zahncreme zahnbürste zahnseide mundspülung toothpaste toothbrush"],
  ["shampoo", "mdi:shower", "care", "shampoo duschgel dusche conditioner trockenshampoo haarspray haargel hairspray"],
  ["seife", "mdi:hand-wash", "care", "seife handseife flüssigseife soap handwash"],
  ["deo", "mdi:spray", "care", "deo deodorant parfum parfüm perfume"],
  ["creme", "mdi:lotion", "care", "creme lotion bodylotion sonnencreme handcreme intimwaschlotion sunscreen"],
  ["rasierer", "mdi:razor-double-edge", "care", "rasierer rasierklingen rasierschaum razor shaving"],
  ["damenhygiene", "mdi:heart-outline", "care", "tampons binden slipeinlagen damenhygiene"],
  ["windeln", "mdi:diaper-outline", "care", "windeln babynahrung feuchttücher baby diapers wipes"],
  ["medikamente", "mdi:pill", "care", "tabletten medikamente ibuprofen paracetamol aspirin sodbrenntabletten luvos medicine pills"],
  ["pflaster", "mdi:bandage", "care", "pflaster verband bandage"],
  ["kosmetik", "mdi:lipstick", "care", "kosmetik kosmetikbeutel makeup schminke abschminken watte wattepads wattestäbchen cosmetics cotton"],
];

/* ---- fuzzy matching (no AI) ------------------------------------------------ */

/* Lower-case, strip accents, fold German umlauts/ß and their ae/oe/ue spellings
 * to the bare vowel, drop punctuation. Applied to catalogue and input alike. */
function fold(s) {
  return String(s == null ? "" : s)
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* Optimal-string-alignment distance: Levenshtein where one swap of two
 * neighbouring letters (Zweibeln/Zwiebeln) costs 1. */
function dist(a, b) {
  const d = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// Keyword index; the display names of both languages count as keywords too.
const INDEX = P.map(([id, icon, cat, kw]) => {
  const words = new Map();
  const add = (raw, head) => {
    const w = fold(raw);
    if (!w) return;
    w.split(" ").forEach((x) => { if (x && (head || !words.has(x))) words.set(x, !!head); });
  };
  kw.split(" ").forEach((k) => (k[0] === "+" ? add(k.slice(1), true) : add(k, false)));
  [DE, EN].forEach((M) => {
    const loc = M["bring-shopping-card"];
    if (loc && loc.products && loc.products[id]) add(loc.products[id], false);
  });
  return { id, icon, cat, kws: [...words].map(([w, head]) => ({ w, head })) };
});

/* Score one input token against one keyword. Higher = better; 0 = no match. */
function scoreToken(tok, kw) {
  const w = kw.w;
  if (tok === w) return 900;
  if (w.length >= 3 && tok.startsWith(w) && /^(e|en|n|s|es|er|ern|nen)$/.test(tok.slice(w.length))) {
    return 850;                                                               // plural / inflection
  }
  if ((w.length >= 4 || kw.head) && w.length >= 2 && tok.length > w.length && tok.endsWith(w)) {
    return 600 + w.length;                                                    // compound head: Apfel|saft
  }
  if (w.length >= 5 && tok.startsWith(w)) return 300 + w.length;             // compound start (weak)
  if (w.length >= 5 && tok.includes(w)) return 200 + w.length;
  if (w.length >= 5 && tok.length >= 5 && Math.abs(tok.length - w.length) <= 2) {
    const max = w.length >= 8 ? 2 : 1;
    const dd = Math.min(dist(tok, w), dist(tok.slice(0, w.length), w));
    if (dd <= max) return 500 - dd * 60;                                      // typo
  }
  return 0;
}

const _metaCache = new Map();
/* -> { icon, cat, id|null } for an item name. */
function matchItem(name) {
  const key = fold(name);
  if (_metaCache.has(key)) return _metaCache.get(key);
  const toks = key.split(" ").filter((t) => t && !/^\d+$/.test(t));
  let best = null, bestScore = 0;
  for (const p of INDEX) {
    for (const kw of p.kws) {
      for (const t of toks) {
        const s = scoreToken(t, kw);
        if (s > bestScore) { bestScore = s; best = p; }
      }
    }
  }
  const res = bestScore >= 200 ? { icon: best.icon, cat: best.cat, id: best.id } : { ...FALLBACK, id: null };
  _metaCache.set(key, res);
  return res;
}

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const STYLE = `
:host{display:block;--bsc-accent:#ee5a45}
ha-card{overflow:hidden;padding:0}
.root{-webkit-tap-highlight-color:transparent}
.band{
  background:var(--bsc-accent);color:#fff;padding:16px 16px 18px;
  display:flex;flex-direction:column;gap:12px;
}
.top{display:flex;align-items:center;gap:12px}
.top ha-icon{--mdc-icon-size:34px;flex:0 0 auto}
.ttl{flex:1;min-width:0}
.ttl h2{margin:0;font-size:1.6rem;font-weight:800;line-height:1.15;letter-spacing:.2px;overflow-wrap:anywhere}
.ttl .sub{font-size:1.05rem;opacity:.92;margin-top:2px}
form.add{display:flex;align-items:center;gap:8px;margin:0}
.add input{
  flex:1;min-width:0;box-sizing:border-box;height:56px;border:0;border-radius:28px;outline:0;
  padding:0 20px;font:inherit;font-size:1.3rem;font-weight:600;
  background:#fff;color:#222;
}
.add input::placeholder{color:#8a8a8a;font-weight:500}
.add button{
  flex:0 0 auto;width:56px;height:56px;border-radius:50%;border:2px solid #fff;
  background:rgba(255,255,255,.18);color:#fff;cursor:pointer;
  display:flex;align-items:center;justify-content:center;padding:0;
}
.add button ha-icon{--mdc-icon-size:32px}
.add button:active{background:rgba(255,255,255,.4)}
.sugs{display:none;padding:6px 10px 0;border-bottom:1px solid var(--divider-color)}
.sugs.on{display:block}
.sug{
  width:100%;display:flex;align-items:center;gap:14px;padding:10px 8px;
  background:none;border:0;border-radius:12px;cursor:pointer;text-align:left;
  font:inherit;color:var(--primary-text-color);
}
.sug:active{background:var(--secondary-background-color)}
.sug .sic{
  flex:0 0 auto;width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:color-mix(in srgb, var(--c) 20%, transparent);color:var(--c);
}
.sug .sic ha-icon{--mdc-icon-size:26px}
.sug .snm{flex:1;min-width:0;font-size:1.25rem;font-weight:600;overflow-wrap:anywhere}
.sug .tag{flex:0 0 auto;font-size:.85rem;color:var(--secondary-text-color)}
.body{padding:6px 12px 16px}
.cat{
  display:flex;align-items:center;gap:8px;margin:16px 4px 8px;
  font-size:.95rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--c);
}
.cat::after{content:"";flex:1;height:2px;border-radius:1px;background:color-mix(in srgb, var(--c) 28%, transparent)}
.grid{
  display:grid;grid-template-columns:repeat(var(--cols,3),minmax(0,1fr));gap:10px;
}
.grid.c2{--ic:72px;--ico:44px;--fs:1.35rem}
.grid.c3{--ic:58px;--ico:36px;--fs:1.12rem}
.grid.c4{--ic:46px;--ico:29px;--fs:.98rem}
.tile{
  position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;
  padding:12px 6px 10px;min-width:0;box-sizing:border-box;
  border:1.5px solid color-mix(in srgb, var(--c) 30%, transparent);border-radius:18px;cursor:pointer;
  background:color-mix(in srgb, var(--c) 10%, var(--card-background-color, #fff));
  color:var(--primary-text-color);font:inherit;
  -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;
  transition:transform .12s ease, background .15s ease;
}
.tile:active{transform:scale(.95)}
.tile .ic{
  width:var(--ic);height:var(--ic);border-radius:50%;flex:0 0 auto;
  display:flex;align-items:center;justify-content:center;
  background:color-mix(in srgb, var(--c) 24%, transparent);color:var(--c);
}
.tile .ic ha-icon{--mdc-icon-size:var(--ico)}
.tile .nm{
  font-size:var(--fs);font-weight:700;line-height:1.15;text-align:center;max-width:100%;
  hyphens:auto;-webkit-hyphens:auto;overflow-wrap:anywhere;
}
.tile.recent{background:transparent;border-style:dashed;border-color:var(--divider-color)}
.tile.recent .ic{background:var(--secondary-background-color);color:var(--secondary-text-color)}
.tile.recent .nm{color:var(--secondary-text-color);font-weight:600}
.tile.fresh{animation:pop .28s ease}
.tile.flash{animation:flash .7s ease 1}
@keyframes pop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes flash{0%,100%{box-shadow:0 0 0 0 transparent}30%{box-shadow:0 0 0 5px var(--c)}}
.empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:30px 12px 18px;text-align:center}
.empty ha-icon{--mdc-icon-size:64px;color:#4caf50}
.empty span{font-size:1.25rem;font-weight:600;color:var(--secondary-text-color)}
.note{padding:20px 16px;font-size:1.1rem;color:var(--warning-color, #ff9800);text-align:center}
.hold{margin:14px 4px 0;font-size:.85rem;color:var(--secondary-text-color);text-align:center}
`;

class BringShoppingCard extends HTMLElement {
  static getStubConfig() { return {}; } // deliberately no default list: pick it in the editor
  static getConfigElement() { return document.createElement("bring-shopping-card-editor"); }

  setConfig(c) {
    const prev = this._cfg && this._cfg.entity;
    this._cfg = Object.assign({ language: "auto" }, c || {});
    if (prev !== this._cfg.entity) { this._items = null; this._resub(); }
    if (this.shadowRoot) { this._applyConfig(); this._renderList(); }
  }
  getCardSize() { return 8; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }

  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) this._build();
    if (this._cfg && this._cfg.entity && this._subEnt !== this._cfg.entity && !this._polling) this._resub();
    // Fallback path (no live subscription): re-read the list whenever its state changes.
    const st = this._cfg && this._cfg.entity && h.states[this._cfg.entity];
    if (this._polling && st && st !== this._lastSt) this._fetch();
    this._lastSt = st;
    this._renderList();
  }

  connectedCallback() { if (this._hass) this._resub(); }
  disconnectedCallback() { this._unsubscribe(); }

  _lang() {
    const c = (this._cfg && this._cfg.language) || "auto";
    if (c === "de" || c === "en") return c;
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("en") ? "en" : "de";
  }
  _L() { return I18N[this._lang()] || I18N.de; }

  _colorCss(v) {
    if (!v) return "#ee5a45";
    return /^[a-z]+(-[a-z]+)*$/.test(v) ? `var(--${v}-color, ${v})` : v;
  }

  /* ---- data: live subscription to the todo entity ---- */
  _unsubscribe() {
    this._subEnt = null;
    if (this._unsub) { try { this._unsub(); } catch (e) { /* connection already gone */ } }
    this._unsub = null;
  }
  _resub() {
    this._unsubscribe();
    const ent = this._cfg && this._cfg.entity;
    if (!ent || !this._hass || !this.isConnected) return;
    this._subEnt = ent;
    this._polling = false;
    this._hass.connection.subscribeMessage((ev) => {
      this._items = (ev && ev.items) || [];
      this._renderList();
    }, { type: "todo/item/subscribe", entity_id: ent }).then((unsub) => {
      if (this._subEnt === ent && this.isConnected) this._unsub = unsub;
      else unsub();
    }).catch(() => { this._polling = true; this._fetch(); });
  }
  async _fetch() {
    const ent = this._cfg && this._cfg.entity;
    if (!ent || !this._hass) return;
    try {
      const r = await this._hass.callWS({ type: "todo/item/list", entity_id: ent });
      if (ent === this._cfg.entity) { this._items = (r && r.items) || []; this._renderList(); }
    } catch (e) { /* entity missing / unavailable: the notice covers it */ }
  }

  /* ---- actions ---- */
  _haptic() { this.dispatchEvent(new CustomEvent("haptic", { detail: "light", bubbles: true, composed: true })); }
  _svc(service, data) {
    return this._hass.callService("todo", service, Object.assign({ entity_id: this._cfg.entity }, data));
  }
  _setStatus(uid, status) {
    const it = (this._items || []).find((i) => i.uid === uid);
    if (!it || it.status === status) return;
    it.status = status;                       // optimistic; the subscription confirms it
    if (status === "needs_action") this._fresh = new Set([uid]);
    this._haptic();
    this._renderList();
    this._svc("update_item", { item: uid, status }).catch(() => this._fetch());
  }
  _remove(uid) {
    const it = (this._items || []).find((i) => i.uid === uid);
    if (!it) return;
    if (!window.confirm(this._L().delete_confirm(it.summary))) return;
    this._items = this._items.filter((i) => i.uid !== uid);
    this._renderList();
    this._svc("remove_item", { item: [uid] }).catch(() => this._fetch());
  }
  _add(raw) {
    if (!this._hass || !this._cfg.entity) return;
    let name = String(raw || "").replace(/\s+/g, " ").trim();
    if (!name) return;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const key = fold(name);
    const items = this._items || (this._items = []);
    const open = items.find((i) => i.status === "needs_action" && fold(i.summary) === key);
    this._clearInput();
    if (open) { this._flash(key); return; }
    const old = items.find((i) => i.status === "completed" && fold(i.summary) === key);
    if (old) { this._setStatus(old.uid, "needs_action"); return; }
    const tmp = "tmp-" + Date.now();
    items.push({ uid: tmp, summary: name, status: "needs_action" });
    this._fresh = new Set([tmp]);
    this._haptic();
    this._renderList();
    this._svc("add_item", { item: name }).catch(() => this._fetch());
  }
  _flash(key) {
    const el = this.shadowRoot.querySelector(`.tile[data-k="${key}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 800);
  }
  _clearInput() { this.$("inp").value = ""; this._renderSugs(); }

  /* ---- suggestions: history first, then the product catalogue ---- */
  _suggest(q) {
    const fq = fold(q);
    if (!fq) return [];
    const L = this._L();
    const openKeys = new Set((this._items || []).filter((i) => i.status === "needs_action").map((i) => fold(i.summary)));
    const pool = new Map();
    (this._items || []).filter((i) => i.status === "completed").forEach((i) => {
      const k = fold(i.summary);
      if (k && !openKeys.has(k) && !pool.has(k)) pool.set(k, { name: i.summary, recent: true });
    });
    INDEX.forEach((p) => {
      const nm = L.products[p.id];
      const k = fold(nm);
      if (nm && !openKeys.has(k) && !pool.has(k)) pool.set(k, { name: nm, recent: false });
    });
    const out = [];
    pool.forEach((v, k) => {
      let s = 0;
      if (k === fq) s = 0; // exact match is what Enter adds anyway
      else if (k.startsWith(fq)) s = 100;
      else if (k.split(" ").some((w) => w.startsWith(fq))) s = 80;
      else if (fq.length >= 3 && k.includes(fq)) s = 50;
      else if (fq.length >= 4 && dist(fq, k.slice(0, fq.length)) <= 1) s = 30;
      if (s) out.push({ ...v, s: s + (v.recent ? 5 : 0) - k.length * 0.1 });
    });
    return out.sort((a, b) => b.s - a.s).slice(0, 6);
  }
  _renderSugs() {
    const box = this.$("sugs");
    const list = this._suggest(this.$("inp").value);
    if (!list.length) { box.classList.remove("on"); box.innerHTML = ""; return; }
    const L = this._L();
    box.innerHTML = list.map((s) => {
      const m = matchItem(s.name);
      return `<button type="button" class="sug" data-name="${esc(s.name)}" style="--c:${CATS[m.cat]}">
 <span class="sic"><ha-icon icon="${m.icon}"></ha-icon></span>
 <span class="snm">${esc(s.name)}</span><span class="tag">${s.recent ? L.sug_recent : L.sug_new}</span></button>`;
    }).join("");
    box.classList.add("on");
  }

  /* ---- DOM ---- */
  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card><div class="root" id="root">
 <div class="band">
  <div class="top"><ha-icon icon="mdi:cart-heart"></ha-icon>
   <div class="ttl"><h2 id="ttl"></h2><div class="sub" id="sub"></div></div></div>
  <form class="add" id="form" autocomplete="off">
   <input id="inp" type="text" enterkeyhint="done" autocomplete="off" autocapitalize="sentences" />
   <button type="submit" id="addbtn"><ha-icon icon="mdi:plus"></ha-icon></button>
  </form>
 </div>
 <div class="sugs" id="sugs"></div>
 <div class="body" id="list"></div>
</div></ha-card>`;
    this.$ = (id) => r.getElementById(id);

    const inp = this.$("inp");
    inp.addEventListener("input", () => this._renderSugs());
    this.$("form").addEventListener("submit", (e) => { e.preventDefault(); this._add(inp.value); });
    this.$("sugs").addEventListener("click", (e) => {
      const b = e.target.closest(".sug");
      if (b) { this._add(b.dataset.name); inp.focus(); }
    });

    // Tap = tick off / put back; long-press = delete. `click` (not pointerup) so a
    // touch-scroll never counts as a tap.
    const list = this.$("list");
    let timer = null, held = false;
    const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
    list.addEventListener("pointerdown", (e) => {
      const t = e.target.closest(".tile");
      held = false; clear();
      if (!t) return;
      timer = setTimeout(() => { held = true; this._haptic(); this._remove(t.dataset.uid); }, 650);
    });
    ["pointerup", "pointerleave", "pointercancel", "pointermove"].forEach((ev) => list.addEventListener(ev, (e) => {
      if (ev === "pointermove" && Math.abs(e.movementX) + Math.abs(e.movementY) < 3) return;
      clear();
    }));
    list.addEventListener("contextmenu", (e) => e.preventDefault());
    list.addEventListener("click", (e) => {
      const t = e.target.closest(".tile");
      if (!t || held) { held = false; return; }
      this._setStatus(t.dataset.uid, t.classList.contains("recent") ? "needs_action" : "completed");
    });

    this._applyConfig();
  }

  _applyConfig() {
    const L = this._L();
    this.style.setProperty("--bsc-accent", this._colorCss(this._cfg.color));
    this.$("root").setAttribute("lang", this._lang());
    this.$("ttl").textContent = this._cfg.title || L.title;
    this.$("inp").placeholder = L.placeholder;
    this.$("addbtn").title = L.add;
  }

  _tile(it, kind) {
    const m = matchItem(it.summary);
    const fresh = this._fresh && this._fresh.has(it.uid) ? " fresh" : "";
    return `<button type="button" class="tile${kind === "recent" ? " recent" : ""}${fresh}" data-uid="${esc(it.uid)}" data-k="${esc(fold(it.summary))}" style="--c:${CATS[m.cat]}">
 <span class="ic"><ha-icon icon="${m.icon}"></ha-icon></span><span class="nm">${esc(it.summary)}</span></button>`;
  }

  _renderList() {
    if (!this.shadowRoot || !this._hass || !this._cfg) return;
    this._applyConfig();
    const L = this._L();
    const c = this._cfg;
    const box = this.$("list");
    const sub = this.$("sub");
    const note = (t) => { box._html = null; box.innerHTML = `<div class="note">${esc(t)}</div>`; sub.textContent = ""; };

    if (!c.entity) return note(L.no_entity);
    const st = this._hass.states[c.entity];
    if (!st) return note(L.not_found(c.entity));
    if (st.state === "unavailable" && !this._items) return note(L.unavailable);
    if (!this._items) { sub.textContent = ""; box._html = null; box.innerHTML = ""; return; }

    const cols = [2, 3, 4].includes(Number(c.columns)) ? Number(c.columns) : 3;
    const open = this._items.filter((i) => i.status === "needs_action");
    sub.textContent = L.open_n(open.length);
    let html = "";

    if (!open.length) {
      html += `<div class="empty"><ha-icon icon="mdi:check-circle-outline"></ha-icon><span>${esc(L.all_done)}</span></div>`;
    } else if (c.group_by_category === false) {
      html += `<div class="grid c${cols}" style="--cols:${cols};margin-top:10px">${open.map((i) => this._tile(i, "open")).join("")}</div>`;
    } else {
      const groups = {};
      open.forEach((i) => { (groups[matchItem(i.summary).cat] = groups[matchItem(i.summary).cat] || []).push(i); });
      CAT_ORDER.filter((k) => groups[k]).forEach((k) => {
        html += `<div class="cat" style="--c:${CATS[k]}">${esc(L.cats[k])}</div>
<div class="grid c${cols}" style="--cols:${cols}">${groups[k].map((i) => this._tile(i, "open")).join("")}</div>`;
      });
    }

    const limit = c.recent_limit == null || c.recent_limit === "" ? 24 : Math.max(0, Number(c.recent_limit) || 0);
    if (c.show_recent !== false && limit > 0) {
      const openKeys = new Set(open.map((i) => fold(i.summary)));
      const seen = new Set();
      const recent = this._items.filter((i) => {
        const k = fold(i.summary);
        if (i.status !== "completed" || !k || openKeys.has(k) || seen.has(k)) return false;
        seen.add(k);
        return true;
      }).sort((a, b) => a.summary.localeCompare(b.summary, this._lang())).slice(0, limit);
      if (recent.length) {
        html += `<div class="cat" style="--c:${CATS.other}">${esc(L.recent)}</div>
<div class="grid c${cols}" style="--cols:${cols}">${recent.map((i) => this._tile(i, "recent")).join("")}</div>`;
      }
    }
    if (this._items.length) html += `<div class="hold">${esc(L.hint_hold)}</div>`;

    if (box._html !== html) { box._html = html; box.innerHTML = html; } // hass fires on every HA state change
    this._fresh = null;
  }
}

/* ---- visual editor ---- */
class BringShoppingCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _L() {
    const c = (this._config && this._config.language) || "auto";
    if (c === "de" || c === "en") return I18N[c];
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("en") ? I18N.en : I18N.de;
  }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => {
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: ev.detail.value }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    const L = this._L();
    this._form.computeLabel = (s) => ({
      entity: L.e_entity, title: L.e_title, columns: L.e_columns, group_by_category: L.e_group,
      show_recent: L.e_recent, recent_limit: L.e_recent_limit, color: L.e_color, language: L.e_language,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "entity", required: true, selector: { entity: { domain: "todo" } } },
      { name: "title", selector: { text: {} } },
      { name: "columns", selector: { number: { min: 2, max: 4, step: 1, mode: "slider" } } },
      { name: "group_by_category", selector: { boolean: {} } },
      { name: "show_recent", selector: { boolean: {} } },
      { name: "recent_limit", selector: { number: { min: 0, max: 60, step: 1, mode: "box" } } },
      { name: "color", selector: { ui_color: {} } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
    ];
    this._form.data = Object.assign(
      { columns: 3, group_by_category: true, show_recent: true, recent_limit: 24, language: "auto" },
      this._config,
    );
  }
}
customElements.define("bring-shopping-card-editor", BringShoppingCardEditor);

customElements.define("bring-shopping-card", BringShoppingCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "bring-shopping-card",
  name: "Einkaufsliste (Bring-Stil)",
  description: "Todo list as a Bring!-style shopping list: big tiles with automatic item icons, category groups, recently used. DE/EN.",
  preview: false,
});
