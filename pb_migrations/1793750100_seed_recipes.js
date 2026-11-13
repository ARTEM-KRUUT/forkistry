/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// СГЕНЕРИРОВАНО scripts/seed.js — не редактировать вручную, менять src/data/mockRecipes.js.
// Демонстрационные авторы и рецепты. Пароли авторов случайные: войти под ними нельзя.

const DATA = {
  "users": [
    {
      "id": "seeduser0000001",
      "email": "marina@example.com",
      "name": "Марина Котова",
      "bio": "Готовлю для большой семьи, люблю супы и выпечку по бабушкиным рецептам",
      "avatarUrl": ""
    },
    {
      "id": "seeduser0000002",
      "email": "olga@example.com",
      "name": "Ольга Смирнова",
      "bio": "Домашняя кухня без сложной техники: духовка, сковорода и немного терпения",
      "avatarUrl": ""
    },
    {
      "id": "seeduser0000003",
      "email": "denis@example.com",
      "name": "Денис Лебедев",
      "bio": "Паста, супы и всё, что можно приготовить за полчаса после работы",
      "avatarUrl": ""
    },
    {
      "id": "seeduser0000004",
      "email": "anna@example.com",
      "name": "Анна Волкова",
      "bio": "Завтраки и лёгкие блюда, считаю калории, но не отказываю себе во вкусном",
      "avatarUrl": ""
    }
  ],
  "recipes": [
    {
      "id": "seedrecipe00001",
      "title": "Курица с картофелем в духовке",
      "photoUrl": "/seed/chicken.webp",
      "category": "Горячее",
      "equipment": [],
      "equipmentAny": [
        "Духовка",
        "Аэрогриль"
      ],
      "difficulty": "easy",
      "timeMinutes": 70,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "chicken-thigh",
          "name": "Куриные бёдра",
          "qty": 600,
          "unit": "g",
          "grams": 600,
          "amountText": "600 г",
          "scalable": true
        },
        {
          "productId": "potato",
          "name": "Картофель",
          "qty": 500,
          "unit": "g",
          "grams": 500,
          "amountText": "500 г",
          "scalable": true
        },
        {
          "productId": "garlic",
          "name": "Чеснок",
          "qty": 3,
          "unit": "clove",
          "grams": 15,
          "amountText": "3 зубчика",
          "scalable": true
        },
        {
          "productId": "rosemary",
          "name": "Розмарин, веточки",
          "qty": 2,
          "unit": "pcs",
          "grams": 4,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "olive-oil",
          "name": "Оливковое масло",
          "qty": 2,
          "unit": "tbsp",
          "grams": 34,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "lemon-juice",
          "name": "Сок лимона",
          "qty": 1,
          "unit": "tbsp",
          "grams": 15,
          "amountText": "1 ст. л.",
          "scalable": true
        },
        {
          "productId": "paprika",
          "name": "Паприка сладкая",
          "qty": 1,
          "unit": "tsp",
          "grams": 3,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Разогрейте духовку до 200 °C или аэрогриль до 190 °C. Картофель вымойте и нарежьте крупными дольками — молодой можно не чистить.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Смешайте масло, лимонный сок, раздавленный чеснок, паприку, соль и перец. Обсушите бёдра бумажным полотенцем и натрите половиной смеси, в остальной перемешайте картофель.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Выложите картофель в форму (или корзину аэрогриля) одним слоем, сверху — бёдра кожей вверх, между ними положите веточки розмарина.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Запекайте до золотистой корочки. В аэрогриле обычно хватает 30–35 минут — проверяйте раньше.",
          "timerSeconds": 2400,
          "photoUrl": ""
        },
        {
          "text": "Перемешайте картофель с выделившимся соком и запекайте ещё немного. У кости мясо не должно быть розовым, сок — прозрачный.",
          "timerSeconds": 600,
          "photoUrl": ""
        },
        {
          "text": "Достаньте форму и дайте блюду постоять 5 минут, чтобы сок распределился по мясу.",
          "timerSeconds": 300,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000002",
      "kcal": 920,
      "protein": 57.7,
      "fat": 56.7,
      "carbs": 44.7,
      "likes": 286,
      "dislikes": 14,
      "favoritesCount": 340,
      "created": "2026-10-02 10:00:00.000Z"
    },
    {
      "id": "seedrecipe00002",
      "title": "Шакшука с томатами и зеленью",
      "photoUrl": "/seed/shakshuka.webp",
      "category": "Завтраки",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 25,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "egg",
          "name": "Яйцо куриное",
          "qty": 4,
          "unit": "pcs",
          "grams": 220,
          "amountText": "4 шт.",
          "scalable": true
        },
        {
          "productId": "canned-tomato",
          "name": "Томаты в собственном соку",
          "qty": 400,
          "unit": "g",
          "grams": 400,
          "amountText": "400 г",
          "scalable": true
        },
        {
          "productId": "bell-pepper",
          "name": "Перец болгарский",
          "qty": 1,
          "unit": "pcs",
          "grams": 150,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "onion",
          "name": "Лук репчатый",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "garlic",
          "name": "Чеснок",
          "qty": 2,
          "unit": "clove",
          "grams": 10,
          "amountText": "2 зубчика",
          "scalable": true
        },
        {
          "productId": "olive-oil",
          "name": "Оливковое масло",
          "qty": 1,
          "unit": "tbsp",
          "grams": 17,
          "amountText": "1 ст. л.",
          "scalable": true
        },
        {
          "productId": "cumin",
          "name": "Зира",
          "qty": 0.5,
          "unit": "tsp",
          "grams": 1,
          "amountText": "0,5 ч. л.",
          "scalable": true
        },
        {
          "productId": "paprika",
          "name": "Паприка сладкая",
          "qty": 1,
          "unit": "tsp",
          "grams": 3,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "greens",
          "name": "Зелень (петрушка, кинза)",
          "qty": 15,
          "unit": "g",
          "grams": 15,
          "amountText": "15 г",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Лук и перец нарежьте полосками и обжарьте на масле на среднем огне до мягкости.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Добавьте измельчённый чеснок, зиру и паприку и прогрейте полминуты, чтобы специи раскрыли аромат.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Влейте томаты, разомните их лопаткой, посолите, поперчите и тушите, пока соус не загустеет.",
          "timerSeconds": 600,
          "photoUrl": ""
        },
        {
          "text": "Сделайте ложкой четыре углубления и разбейте в них яйца. Накройте крышкой и готовьте, пока белок не схватится, а желток останется жидким.",
          "timerSeconds": 360,
          "photoUrl": ""
        },
        {
          "text": "Посыпьте зеленью и подавайте прямо в сковороде с хлебом.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000004",
      "kcal": 349,
      "protein": 18.6,
      "fat": 21,
      "carbs": 18.6,
      "likes": 194,
      "dislikes": 6,
      "favoritesCount": 210,
      "created": "2026-10-20 08:00:00.000Z"
    },
    {
      "id": "seedrecipe00003",
      "title": "Паста карбонара",
      "photoUrl": "/seed/carbonara.webp",
      "category": "Паста",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "medium",
      "timeMinutes": 25,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "spaghetti",
          "name": "Спагетти",
          "qty": 200,
          "unit": "g",
          "grams": 200,
          "amountText": "200 г",
          "scalable": true
        },
        {
          "productId": "bacon",
          "name": "Гуанчале или бекон",
          "qty": 100,
          "unit": "g",
          "grams": 100,
          "amountText": "100 г",
          "scalable": true
        },
        {
          "productId": "egg-yolk",
          "name": "Желток куриный",
          "qty": 3,
          "unit": "pcs",
          "grams": 51,
          "amountText": "3 шт.",
          "scalable": true
        },
        {
          "productId": "parmesan",
          "name": "Пекорино или пармезан",
          "qty": 50,
          "unit": "g",
          "grams": 50,
          "amountText": "50 г",
          "scalable": true
        },
        {
          "productId": "black-pepper",
          "name": "Перец чёрный молотый",
          "qty": 0.5,
          "unit": "tsp",
          "grams": 1,
          "amountText": "0,5 ч. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль для воды",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Вскипятите воду, посолите и отварите спагетти на минуту меньше, чем написано на упаковке.",
          "timerSeconds": 540,
          "photoUrl": ""
        },
        {
          "text": "Пока варится паста, нарежьте гуанчале брусочками и обжаривайте на сухой сковороде на слабом огне, пока жир не вытопится, а мясо не станет хрустящим.",
          "timerSeconds": 480,
          "photoUrl": ""
        },
        {
          "text": "Натрите сыр как можно мельче и разотрите с желтками и молотым перцем в густую пасту. Разбавьте 2 ст. л. горячей воды от пасты.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Переложите спагетти в сковороду с гуанчале, перемешайте, снимите с огня и подождите минуту — если сковорода слишком горячая, желтки свернутся.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Влейте яичную смесь и быстро перемешивайте, подливая воду от пасты по ложке, пока соус не станет гладким и кремовым. Сразу подавайте, посыпав сыром и перцем.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000003",
      "kcal": 783,
      "protein": 35,
      "fat": 38,
      "carbs": 72.9,
      "likes": 510,
      "dislikes": 10,
      "favoritesCount": 520,
      "created": "2026-09-15 18:00:00.000Z"
    },
    {
      "id": "seedrecipe00004",
      "title": "Борщ с говядиной",
      "photoUrl": "/seed/borsch.webp",
      "category": "Супы",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "medium",
      "timeMinutes": 150,
      "servings": 6,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "beef",
          "name": "Говядина на кости",
          "qty": 600,
          "unit": "g",
          "grams": 600,
          "amountText": "600 г",
          "scalable": true
        },
        {
          "productId": "beet",
          "name": "Свёкла",
          "qty": 2,
          "unit": "pcs",
          "grams": 500,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "cabbage",
          "name": "Капуста белокочанная",
          "qty": 300,
          "unit": "g",
          "grams": 300,
          "amountText": "300 г",
          "scalable": true
        },
        {
          "productId": "potato",
          "name": "Картофель",
          "qty": 3,
          "unit": "pcs",
          "grams": 300,
          "amountText": "3 шт.",
          "scalable": true
        },
        {
          "productId": "carrot",
          "name": "Морковь",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "onion",
          "name": "Лук репчатый",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "tomato-paste",
          "name": "Томатная паста",
          "qty": 2,
          "unit": "tbsp",
          "grams": 60,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "vinegar",
          "name": "Уксус 9%",
          "qty": 1,
          "unit": "tbsp",
          "grams": 15,
          "amountText": "1 ст. л.",
          "scalable": true
        },
        {
          "productId": "sunflower-oil",
          "name": "Подсолнечное масло",
          "qty": 2,
          "unit": "tbsp",
          "grams": 34,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "garlic",
          "name": "Чеснок",
          "qty": 2,
          "unit": "clove",
          "grams": 10,
          "amountText": "2 зубчика",
          "scalable": true
        },
        {
          "productId": "bay-leaf",
          "name": "Лавровый лист",
          "qty": 2,
          "unit": "pcs",
          "grams": 0.4,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "water",
          "name": "Вода",
          "qty": 3,
          "unit": "l",
          "grams": 3000,
          "amountText": "3 л",
          "scalable": true
        },
        {
          "productId": "sour-cream",
          "name": "Сметана для подачи",
          "qty": 6,
          "unit": "tbsp",
          "grams": 150,
          "amountText": "6 ст. л.",
          "scalable": true
        },
        {
          "productId": "greens",
          "name": "Зелень (укроп, петрушка)",
          "qty": 20,
          "unit": "g",
          "grams": 20,
          "amountText": "20 г",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Говядину залейте холодной водой и доведите до кипения. Снимите пену и варите под крышкой на слабом огне, пока мясо не станет мягким.",
          "timerSeconds": 5400,
          "photoUrl": ""
        },
        {
          "text": "Свёклу натрите на крупной тёрке и тушите на масле с уксусом и томатной пастой — так она сохранит яркий цвет.",
          "timerSeconds": 900,
          "photoUrl": ""
        },
        {
          "text": "На другой сковороде обжарьте нарезанный лук и тёртую морковь до мягкости.",
          "timerSeconds": 480,
          "photoUrl": ""
        },
        {
          "text": "Достаньте мясо, отделите от кости и нарежьте. В бульон положите картофель кубиками, а через 10 минут — нашинкованную капусту.",
          "timerSeconds": 900,
          "photoUrl": ""
        },
        {
          "text": "Добавьте свёклу, зажарку, мясо и лавровый лист, посолите, поперчите и варите на слабом огне.",
          "timerSeconds": 600,
          "photoUrl": ""
        },
        {
          "text": "Выключите огонь, добавьте раздавленный чеснок и зелень и дайте борщу настояться под крышкой. Подавайте со сметаной.",
          "timerSeconds": 1200,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000001",
      "kcal": 389,
      "protein": 23.8,
      "fat": 22.2,
      "carbs": 23.2,
      "likes": 380,
      "dislikes": 20,
      "favoritesCount": 120,
      "created": "2026-08-28 12:00:00.000Z"
    },
    {
      "id": "seedrecipe00005",
      "title": "Сырники со сметаной и ягодами",
      "photoUrl": "/seed/syrniki.webp",
      "category": "Завтраки",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 30,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "cottage-cheese",
          "name": "Творог 5%",
          "qty": 400,
          "unit": "g",
          "grams": 400,
          "amountText": "400 г",
          "scalable": true
        },
        {
          "productId": "egg",
          "name": "Яйцо куриное",
          "qty": 1,
          "unit": "pcs",
          "grams": 55,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "flour",
          "name": "Мука пшеничная",
          "qty": 4,
          "unit": "tbsp",
          "grams": 100,
          "amountText": "4 ст. л.",
          "scalable": true
        },
        {
          "productId": "sugar",
          "name": "Сахар",
          "qty": 2,
          "unit": "tbsp",
          "grams": 50,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "vanilla-sugar",
          "name": "Ванильный сахар",
          "qty": 1,
          "unit": "tsp",
          "grams": 8,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль",
          "qty": 1,
          "unit": "pinch",
          "grams": 0.5,
          "amountText": "1 щепотка",
          "scalable": true
        },
        {
          "productId": "sunflower-oil",
          "name": "Подсолнечное масло",
          "qty": 2,
          "unit": "tbsp",
          "grams": 34,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "sour-cream",
          "name": "Сметана 15%",
          "qty": 4,
          "unit": "tbsp",
          "grams": 100,
          "amountText": "4 ст. л.",
          "scalable": true
        },
        {
          "productId": "berries",
          "name": "Ягоды замороженные",
          "qty": 80,
          "unit": "g",
          "grams": 80,
          "amountText": "80 г",
          "scalable": true
        }
      ],
      "steps": [
        {
          "text": "Если творог влажный, отожмите его через марлю, а комочки разомните вилкой или протрите через сито.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Добавьте яйцо, оба вида сахара и соль, перемешайте. Всыпьте 3 ст. л. муки — тесто должно получиться мягким и чуть липким.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Мокрыми руками скатайте шарики, обваляйте в оставшейся муке и прижмите в шайбы толщиной около 1,5 см.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Обжарьте на разогретом масле на среднем огне до золотистой корочки.",
          "timerSeconds": 180,
          "photoUrl": ""
        },
        {
          "text": "Переверните, убавьте огонь, накройте крышкой и жарьте, чтобы сырники пропеклись внутри.",
          "timerSeconds": 240,
          "photoUrl": ""
        },
        {
          "text": "Подавайте тёплыми со сметаной и ягодами.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000001",
      "kcal": 819,
      "protein": 44.7,
      "fat": 38.2,
      "carbs": 73.1,
      "likes": 240,
      "dislikes": 10,
      "favoritesCount": 180,
      "created": "2026-10-25 07:30:00.000Z"
    },
    {
      "id": "seedrecipe00006",
      "title": "Шарлотка с яблоками",
      "photoUrl": "https://www.chefmarket.ru/blog/wp-content/uploads/2018/01/sharlotka-s-yablokami.jpg",
      "category": "Выпечка",
      "equipment": [
        "Духовка",
        "Миксер"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 60,
      "servings": 0,
      "yieldText": "1 пирог, форма 24 см",
      "ingredients": [
        {
          "productId": "egg",
          "name": "Яйцо куриное",
          "qty": 4,
          "unit": "pcs",
          "grams": 220,
          "amountText": "4 шт.",
          "scalable": true
        },
        {
          "productId": "sugar",
          "name": "Сахар",
          "qty": 180,
          "unit": "g",
          "grams": 180,
          "amountText": "180 г",
          "scalable": true
        },
        {
          "productId": "flour",
          "name": "Мука пшеничная",
          "qty": 160,
          "unit": "g",
          "grams": 160,
          "amountText": "160 г",
          "scalable": true
        },
        {
          "productId": "apple",
          "name": "Яблоки",
          "qty": 3,
          "unit": "pcs",
          "grams": 540,
          "amountText": "3 шт.",
          "scalable": true
        },
        {
          "productId": "cinnamon",
          "name": "Корица",
          "qty": 0.5,
          "unit": "tsp",
          "grams": 1.5,
          "amountText": "0,5 ч. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль",
          "qty": 1,
          "unit": "pinch",
          "grams": 0.5,
          "amountText": "1 щепотка",
          "scalable": true
        },
        {
          "productId": "butter",
          "name": "Сливочное масло для формы",
          "qty": 10,
          "unit": "g",
          "grams": 10,
          "amountText": "10 г",
          "scalable": true
        }
      ],
      "steps": [
        {
          "text": "Разогрейте духовку до 180 °C. Смажьте форму маслом и присыпьте мукой.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Яблоки очистите от семян, нарежьте тонкими дольками и посыпьте корицей.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Взбейте яйца с солью и сахаром миксером на высокой скорости в густую светлую пену — масса должна увеличиться в 3–4 раза. От этого зависит пышность: разрыхлитель в классической шарлотке не нужен.",
          "timerSeconds": 480,
          "photoUrl": ""
        },
        {
          "text": "Просейте муку и аккуратно вмешайте её лопаткой движениями снизу вверх, чтобы пена не осела.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Выложите яблоки в форму, залейте тестом и выпекайте. Первые 30 минут духовку не открывайте, готовность проверьте деревянной шпажкой — она должна выйти сухой.",
          "timerSeconds": 2400,
          "photoUrl": ""
        },
        {
          "text": "Остудите пирог в форме, затем достаньте и посыпьте сахарной пудрой, если хочется.",
          "timerSeconds": 600,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000002",
      "kcal": 173,
      "protein": 4.2,
      "fat": 3.3,
      "carbs": 31.2,
      "likes": 150,
      "dislikes": 8,
      "favoritesCount": 95,
      "created": "2026-10-10 16:00:00.000Z"
    },
    {
      "id": "seedrecipe00007",
      "title": "Куриный суп с лапшой",
      "photoUrl": "https://static.1000.menu/files/user-v2/5e/e3/385805/foto/f_13-10-2022-10-25-30.1665656730.jpg",
      "category": "Супы",
      "equipment": [
        "Мультиварка"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 60,
      "servings": 4,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "chicken-breast",
          "name": "Куриное филе",
          "qty": 400,
          "unit": "g",
          "grams": 400,
          "amountText": "400 г",
          "scalable": true
        },
        {
          "productId": "noodles",
          "name": "Яичная лапша",
          "qty": 100,
          "unit": "g",
          "grams": 100,
          "amountText": "100 г",
          "scalable": true
        },
        {
          "productId": "potato",
          "name": "Картофель",
          "qty": 3,
          "unit": "pcs",
          "grams": 300,
          "amountText": "3 шт.",
          "scalable": true
        },
        {
          "productId": "carrot",
          "name": "Морковь",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "onion",
          "name": "Лук репчатый",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "sunflower-oil",
          "name": "Подсолнечное масло",
          "qty": 1,
          "unit": "tbsp",
          "grams": 17,
          "amountText": "1 ст. л.",
          "scalable": true
        },
        {
          "productId": "bay-leaf",
          "name": "Лавровый лист",
          "qty": 1,
          "unit": "pcs",
          "grams": 0.2,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "water",
          "name": "Вода",
          "qty": 2,
          "unit": "l",
          "grams": 2000,
          "amountText": "2 л",
          "scalable": true
        },
        {
          "productId": "greens",
          "name": "Зелень (укроп, петрушка)",
          "qty": 15,
          "unit": "g",
          "grams": 15,
          "amountText": "15 г",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Курицу нарежьте небольшими кусками, картофель — кубиками, морковь — кружками, лук — мелко.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Налейте в чашу масло и обжарьте лук с морковью в режиме «Жарка», помешивая.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Добавьте курицу, картофель и лавровый лист, залейте горячей водой и посолите. Включите режим «Суп».",
          "timerSeconds": 2400,
          "photoUrl": ""
        },
        {
          "text": "Откройте крышку, всыпьте лапшу, перемешайте и готовьте ещё немного — лапша должна стать мягкой, но не развариться.",
          "timerSeconds": 420,
          "photoUrl": ""
        },
        {
          "text": "Добавьте зелень, выключите мультиварку и дайте супу настояться под крышкой.",
          "timerSeconds": 300,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000003",
      "kcal": 313,
      "protein": 29,
      "fat": 7.2,
      "carbs": 32.4,
      "likes": 120,
      "dislikes": 4,
      "favoritesCount": 70,
      "created": "2026-09-30 13:00:00.000Z"
    },
    {
      "id": "seedrecipe00008",
      "title": "Греческий салат",
      "photoUrl": "https://avatars.mds.yandex.net/get-vertis-journal/4469561/7fb97807-83ec-4b4d-8135-a9fc59e80c66.jpg/1600x1600",
      "category": "Салаты",
      "equipment": [],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 15,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "tomato",
          "name": "Помидоры",
          "qty": 2,
          "unit": "pcs",
          "grams": 240,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "cucumber",
          "name": "Огурцы",
          "qty": 2,
          "unit": "pcs",
          "grams": 240,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "bell-pepper",
          "name": "Перец болгарский",
          "qty": 1,
          "unit": "pcs",
          "grams": 150,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "onion",
          "name": "Лук красный",
          "qty": 0.5,
          "unit": "pcs",
          "grams": 40,
          "amountText": "0,5 шт.",
          "scalable": true
        },
        {
          "productId": "feta",
          "name": "Фета",
          "qty": 150,
          "unit": "g",
          "grams": 150,
          "amountText": "150 г",
          "scalable": true
        },
        {
          "productId": "olives",
          "name": "Оливки или маслины",
          "qty": 60,
          "unit": "g",
          "grams": 60,
          "amountText": "60 г",
          "scalable": true
        },
        {
          "productId": "olive-oil",
          "name": "Оливковое масло",
          "qty": 3,
          "unit": "tbsp",
          "grams": 51,
          "amountText": "3 ст. л.",
          "scalable": true
        },
        {
          "productId": "oregano",
          "name": "Орегано сушёный",
          "qty": 1,
          "unit": "tsp",
          "grams": 1,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Помидоры нарежьте крупными дольками, огурцы — толстыми полукольцами, перец — полосками, лук — тонкими кольцами.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Сложите овощи в миску и добавьте оливки. Листья салата в классическом рецепте не нужны.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Сверху положите фету крупными кубиками или одним пластом.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Полейте маслом, посыпьте орегано и перцем. Солите в последнюю очередь и после пробы: фета и оливки сами солёные.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000004",
      "kcal": 548,
      "protein": 14.2,
      "fat": 46.8,
      "carbs": 19,
      "likes": 160,
      "dislikes": 12,
      "favoritesCount": 88,
      "created": "2026-10-05 11:00:00.000Z"
    },
    {
      "id": "seedrecipe00009",
      "title": "Котлеты домашние",
      "photoUrl": "https://img.povar.ru/main-micro/b3/47/d4/c7/kotleti_po_starinnomu_receptu-638128.JPG",
      "category": "Горячее",
      "equipment": [
        "Плита",
        "Блендер"
      ],
      "equipmentAny": [],
      "difficulty": "medium",
      "timeMinutes": 50,
      "servings": 4,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "minced-meat",
          "name": "Фарш (говядина и свинина)",
          "qty": 600,
          "unit": "g",
          "grams": 600,
          "amountText": "600 г",
          "scalable": true
        },
        {
          "productId": "onion",
          "name": "Лук репчатый",
          "qty": 1,
          "unit": "pcs",
          "grams": 80,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "bread",
          "name": "Белый хлеб, ломтики",
          "qty": 2,
          "unit": "pcs",
          "grams": 60,
          "amountText": "2 шт.",
          "scalable": true
        },
        {
          "productId": "milk",
          "name": "Молоко 2,5%",
          "qty": 100,
          "unit": "ml",
          "grams": 103,
          "amountText": "100 мл",
          "scalable": true
        },
        {
          "productId": "egg",
          "name": "Яйцо куриное",
          "qty": 1,
          "unit": "pcs",
          "grams": 55,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "garlic",
          "name": "Чеснок",
          "qty": 1,
          "unit": "clove",
          "grams": 5,
          "amountText": "1 зубчик",
          "scalable": true
        },
        {
          "productId": "sunflower-oil",
          "name": "Подсолнечное масло",
          "qty": 3,
          "unit": "tbsp",
          "grams": 51,
          "amountText": "3 ст. л.",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Срежьте с хлеба корки и залейте мякиш молоком.",
          "timerSeconds": 900,
          "photoUrl": ""
        },
        {
          "text": "Измельчите лук с чесноком блендером и обжарьте на ложке масла до прозрачности, затем остудите — с сырым луком котлеты внутри иногда розовеют.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Смешайте фарш, отжатый хлеб, лук, яйцо, соль и перец. Отбейте фарш о миску минуту-две — так котлеты лучше держат форму и остаются сочными.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Мокрыми руками сформуйте котлеты толщиной 2 см.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Обжарьте на разогретом масле на среднем огне до румяной корочки.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Переверните, убавьте огонь, накройте крышкой и доведите до готовности. Переворачивайте не больше одного-двух раз.",
          "timerSeconds": 420,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000001",
      "kcal": 580,
      "protein": 29.8,
      "fat": 45.4,
      "carbs": 11,
      "likes": 210,
      "dislikes": 15,
      "favoritesCount": 140,
      "created": "2026-09-20 17:00:00.000Z"
    },
    {
      "id": "seedrecipe00010",
      "title": "Смузи-боул с бананом",
      "photoUrl": "https://img.povar.ru/main-micro/5e/cc/65/a6/smuzi-boul_s_bananom_i_yagodami-766168.jpg",
      "category": "Завтраки",
      "equipment": [
        "Блендер"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 10,
      "servings": 1,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "banana",
          "name": "Банан замороженный",
          "qty": 1,
          "unit": "pcs",
          "grams": 120,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "berries",
          "name": "Ягоды замороженные",
          "qty": 150,
          "unit": "g",
          "grams": 150,
          "amountText": "150 г",
          "scalable": true
        },
        {
          "productId": "yogurt",
          "name": "Йогурт натуральный",
          "qty": 100,
          "unit": "g",
          "grams": 100,
          "amountText": "100 г",
          "scalable": true
        },
        {
          "productId": "milk",
          "name": "Молоко 2,5%",
          "qty": 50,
          "unit": "ml",
          "grams": 51.5,
          "amountText": "50 мл",
          "scalable": true
        },
        {
          "productId": "oats",
          "name": "Овсяные хлопья",
          "qty": 2,
          "unit": "tbsp",
          "grams": 24,
          "amountText": "2 ст. л.",
          "scalable": true
        },
        {
          "productId": "chia",
          "name": "Семена чиа",
          "qty": 1,
          "unit": "tsp",
          "grams": 4,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "honey",
          "name": "Мёд",
          "qty": 1,
          "unit": "tsp",
          "grams": 12,
          "amountText": "1 ч. л.",
          "scalable": true
        }
      ],
      "steps": [
        {
          "text": "Заранее нарежьте банан кружками и уберите в морозилку хотя бы на 2 часа — именно замороженный фрукт делает боул густым, как мороженое.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Взбейте блендером замороженный банан, ягоды (горсть оставьте для украшения), йогурт и молоко до гладкой густой массы. Если блендер не справляется, добавьте ложку молока.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Переложите в миску, сверху выложите оставшиеся ягоды, хлопья и чиа, полейте мёдом. Ешьте сразу, пока боул не подтаял.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000004",
      "kcal": 419,
      "protein": 13.2,
      "fat": 8,
      "carbs": 71.3,
      "likes": 90,
      "dislikes": 9,
      "favoritesCount": 60,
      "created": "2026-10-28 08:30:00.000Z"
    },
    {
      "id": "seedrecipe00011",
      "title": "Панакота с ягодным соусом",
      "photoUrl": "https://images.gastronom.ru/I_p85IL8dLsa9FoCNIe2-65CXAEl3f3U5gAXsk7E_9s/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzg2NmNmNTEwLWFmN2EtNDE0YS04MjQ3LTA1NWNiZmMzYjZkYy5qcGc.webp",
      "category": "Десерты",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "medium",
      "timeMinutes": 30,
      "servings": 4,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "cream-33",
          "name": "Сливки 33%",
          "qty": 500,
          "unit": "ml",
          "grams": 500,
          "amountText": "500 мл",
          "scalable": true
        },
        {
          "productId": "milk",
          "name": "Молоко 2,5%",
          "qty": 100,
          "unit": "ml",
          "grams": 103,
          "amountText": "100 мл",
          "scalable": true
        },
        {
          "productId": "sugar",
          "name": "Сахар",
          "qty": 60,
          "unit": "g",
          "grams": 60,
          "amountText": "60 г",
          "scalable": true
        },
        {
          "productId": "gelatin",
          "name": "Желатин",
          "qty": 10,
          "unit": "g",
          "grams": 10,
          "amountText": "10 г",
          "scalable": true
        },
        {
          "productId": null,
          "name": "Ванильный экстракт",
          "qty": 1,
          "unit": "tsp",
          "grams": 5,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "berries",
          "name": "Ягоды замороженные",
          "qty": 150,
          "unit": "g",
          "grams": 150,
          "amountText": "150 г",
          "scalable": true
        },
        {
          "productId": "sugar",
          "name": "Сахар для соуса",
          "qty": 2,
          "unit": "tbsp",
          "grams": 50,
          "amountText": "2 ст. л.",
          "scalable": true
        }
      ],
      "steps": [
        {
          "text": "Залейте желатин небольшим количеством холодной воды и оставьте набухать.",
          "timerSeconds": 600,
          "photoUrl": ""
        },
        {
          "text": "Сливки, молоко и сахар нагрейте, помешивая, почти до кипения — кипятить нельзя.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Снимите с огня, добавьте ваниль и набухший желатин и размешайте, пока он полностью не растворится.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Разлейте по формочкам или стаканам, остудите и уберите в холодильник до застывания.",
          "timerSeconds": 14400,
          "photoUrl": ""
        },
        {
          "text": "Для соуса прогрейте ягоды с сахаром до мягкости и разомните. Остудите и полейте панакоту перед подачей.",
          "timerSeconds": 300,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000002",
      "kcal": 0,
      "protein": 0,
      "fat": 0,
      "carbs": 0,
      "likes": 70,
      "dislikes": 2,
      "favoritesCount": 50,
      "created": "2026-10-15 19:00:00.000Z"
    },
    {
      "id": "seedrecipe00012",
      "title": "Паста с томатами и чесноком",
      "photoUrl": "https://avatars.mds.yandex.net/get-vertis-journal/3934100/32409fae-174e-4fb1-ab92-2a99728ff88b.png/1600x1600",
      "category": "Паста",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 30,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "spaghetti",
          "name": "Спагетти",
          "qty": 200,
          "unit": "g",
          "grams": 200,
          "amountText": "200 г",
          "scalable": true
        },
        {
          "productId": "canned-tomato",
          "name": "Томаты в собственном соку",
          "qty": 400,
          "unit": "g",
          "grams": 400,
          "amountText": "400 г",
          "scalable": true
        },
        {
          "productId": "garlic",
          "name": "Чеснок",
          "qty": 3,
          "unit": "clove",
          "grams": 15,
          "amountText": "3 зубчика",
          "scalable": true
        },
        {
          "productId": "olive-oil",
          "name": "Оливковое масло",
          "qty": 3,
          "unit": "tbsp",
          "grams": 51,
          "amountText": "3 ст. л.",
          "scalable": true
        },
        {
          "productId": "butter",
          "name": "Сливочное масло",
          "qty": 10,
          "unit": "g",
          "grams": 10,
          "amountText": "10 г",
          "scalable": true
        },
        {
          "productId": "basil",
          "name": "Базилик",
          "qty": 10,
          "unit": "g",
          "grams": 10,
          "amountText": "10 г",
          "scalable": true
        },
        {
          "productId": "parmesan",
          "name": "Пармезан",
          "qty": 30,
          "unit": "g",
          "grams": 30,
          "amountText": "30 г",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Нарежьте чеснок тонкими пластинками и прогрейте в масле на слабом огне до светло-золотистого цвета — подгоревший чеснок горчит.",
          "timerSeconds": 120,
          "photoUrl": ""
        },
        {
          "text": "Добавьте томаты, разомните их лопаткой, посолите и томите соус на среднем огне, пока он не загустеет.",
          "timerSeconds": 900,
          "photoUrl": ""
        },
        {
          "text": "Тем временем отварите спагетти в подсоленной воде до аль денте. Перед тем как слить, оставьте стакан воды от варки.",
          "timerSeconds": 540,
          "photoUrl": ""
        },
        {
          "text": "Переложите пасту в соус, добавьте сливочное масло и немного воды от варки и перемешивайте минуту на огне, чтобы соус обволок спагетти.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Снимите с огня, добавьте порванные руками листья базилика и посыпьте тёртым пармезаном.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000003",
      "kcal": 730,
      "protein": 18.6,
      "fat": 34.8,
      "carbs": 82,
      "likes": 130,
      "dislikes": 7,
      "favoritesCount": 75,
      "created": "2026-10-22 19:30:00.000Z"
    },
    {
      "id": "seedrecipe00013",
      "title": "Овсянка с яблоком в микроволновке",
      "photoUrl": "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDI0MTAxMS92eE53VjYuanBlZw.webp",
      "category": "Завтраки",
      "equipment": [
        "Микроволновка"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 7,
      "servings": 1,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "oats",
          "name": "Овсяные хлопья",
          "qty": 50,
          "unit": "g",
          "grams": 50,
          "amountText": "50 г",
          "scalable": true
        },
        {
          "productId": "milk",
          "name": "Молоко 2,5%",
          "qty": 150,
          "unit": "ml",
          "grams": 154.5,
          "amountText": "150 мл",
          "scalable": true
        },
        {
          "productId": "apple",
          "name": "Яблоки",
          "qty": 0.5,
          "unit": "pcs",
          "grams": 90,
          "amountText": "0,5 шт.",
          "scalable": true
        },
        {
          "productId": "honey",
          "name": "Мёд",
          "qty": 1,
          "unit": "tsp",
          "grams": 12,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "cinnamon",
          "name": "Корица",
          "qty": 1,
          "unit": "pinch",
          "grams": 0.5,
          "amountText": "1 щепотка",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль",
          "qty": 1,
          "unit": "pinch",
          "grams": 0.5,
          "amountText": "1 щепотка",
          "scalable": true
        }
      ],
      "steps": [
        {
          "text": "В глубокой миске смешайте хлопья, молоко и соль. Миска должна быть заполнена не больше чем наполовину — молоко при закипании поднимается.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Готовьте на мощности 750–800 Вт.",
          "timerSeconds": 120,
          "photoUrl": ""
        },
        {
          "text": "Перемешайте, добавьте нарезанное кубиками яблоко и прогрейте ещё раз.",
          "timerSeconds": 60,
          "photoUrl": ""
        },
        {
          "text": "Оставьте кашу в печи, чтобы она загустела, затем добавьте мёд и корицу.",
          "timerSeconds": 120,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000004",
      "kcal": 339,
      "protein": 11,
      "fat": 7.3,
      "carbs": 56,
      "likes": 60,
      "dislikes": 12,
      "favoritesCount": 30,
      "created": "2026-11-01 07:00:00.000Z"
    },
    {
      "id": "seedrecipe00014",
      "title": "Салат с курицей и овощами",
      "photoUrl": "https://img.povar.ru/uploads/af/38/b8/9a/salat_s_kuricei_ovoshami_i_sirom-777681.jpg",
      "category": "Салаты",
      "equipment": [
        "Плита"
      ],
      "equipmentAny": [],
      "difficulty": "easy",
      "timeMinutes": 30,
      "servings": 2,
      "yieldText": "",
      "ingredients": [
        {
          "productId": "chicken-breast",
          "name": "Куриное филе",
          "qty": 1,
          "unit": "pcs",
          "grams": 200,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "lettuce",
          "name": "Салат листовой",
          "qty": 100,
          "unit": "g",
          "grams": 100,
          "amountText": "100 г",
          "scalable": true
        },
        {
          "productId": "tomato",
          "name": "Помидоры",
          "qty": 1,
          "unit": "pcs",
          "grams": 120,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "cucumber",
          "name": "Огурцы",
          "qty": 1,
          "unit": "pcs",
          "grams": 120,
          "amountText": "1 шт.",
          "scalable": true
        },
        {
          "productId": "bell-pepper",
          "name": "Перец болгарский",
          "qty": 0.5,
          "unit": "pcs",
          "grams": 75,
          "amountText": "0,5 шт.",
          "scalable": true
        },
        {
          "productId": "yogurt",
          "name": "Йогурт натуральный",
          "qty": 4,
          "unit": "tbsp",
          "grams": 100,
          "amountText": "4 ст. л.",
          "scalable": true
        },
        {
          "productId": "lemon-juice",
          "name": "Сок лимона",
          "qty": 1,
          "unit": "tsp",
          "grams": 5,
          "amountText": "1 ч. л.",
          "scalable": true
        },
        {
          "productId": "olive-oil",
          "name": "Оливковое масло",
          "qty": 1,
          "unit": "tbsp",
          "grams": 17,
          "amountText": "1 ст. л.",
          "scalable": true
        },
        {
          "productId": "parmesan",
          "name": "Пармезан",
          "qty": 20,
          "unit": "g",
          "grams": 20,
          "amountText": "20 г",
          "scalable": true
        },
        {
          "productId": "salt",
          "name": "Соль, перец",
          "qty": 0,
          "unit": "taste",
          "grams": 0,
          "amountText": "по вкусу",
          "scalable": false
        }
      ],
      "steps": [
        {
          "text": "Разрежьте филе вдоль на две тонкие пластины, посолите и поперчите — так оно быстрее и равномернее прожарится.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Обжарьте на масле на среднем огне по 4–5 минут с каждой стороны.",
          "timerSeconds": 600,
          "photoUrl": ""
        },
        {
          "text": "Дайте курице отдохнуть на доске, чтобы сок не вытек при нарезке, затем нарежьте полосками.",
          "timerSeconds": 300,
          "photoUrl": ""
        },
        {
          "text": "Нарежьте помидор, огурец и перец, салат порвите руками.",
          "timerSeconds": 0,
          "photoUrl": ""
        },
        {
          "text": "Для заправки смешайте йогурт, лимонный сок, соль и перец. Соберите салат, полейте заправкой и посыпьте тёртым пармезаном.",
          "timerSeconds": 0,
          "photoUrl": ""
        }
      ],
      "author": "seeduser0000001",
      "kcal": 300,
      "protein": 31.7,
      "fat": 14.8,
      "carbs": 10,
      "likes": 75,
      "dislikes": 5,
      "favoritesCount": 40,
      "created": "2026-10-30 14:00:00.000Z"
    }
  ]
};

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users');
    for (const u of DATA.users) {
      try {
        app.findRecordById('users', u.id);
        continue; // уже есть
      } catch (_) {}
      const rec = new Record(users);
      rec.set('id', u.id);
      rec.set('email', u.email);
      rec.set('emailVisibility', false);
      rec.set('verified', true);
      rec.set('name', u.name);
      rec.set('bio', u.bio);
      rec.set('avatarUrl', u.avatarUrl);
      rec.setPassword($security.randomString(32));
      app.save(rec);
    }

    const recipes = app.findCollectionByNameOrId('recipes');
    for (const r of DATA.recipes) {
      try {
        app.findRecordById('recipes', r.id);
        continue;
      } catch (_) {}
      const rec = new Record(recipes);
      for (const key of Object.keys(r)) {
        if (key !== 'created') rec.set(key, r[key]);
      }
      app.save(rec);
      // autodate проставляет текущее время — возвращаем дату публикации для сортировки «Сначала новые»
      app.db().newQuery('UPDATE recipes SET created = {:created} WHERE id = {:id}').bind({ created: r.created, id: r.id }).execute();
    }
  },
  (app) => {
    for (const r of DATA.recipes) {
      try {
        app.delete(app.findRecordById('recipes', r.id));
      } catch (_) {}
    }
    for (const u of DATA.users) {
      try {
        app.delete(app.findRecordById('users', u.id));
      } catch (_) {}
    }
  },
);
