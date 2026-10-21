export const contents = {
  // for setting screen
  settings: {
    setterText: {
      language: 'Taal',
      weght: 'Gewicht',
      temperature: 'Warmte',
    },
    translationText: 'Automatisch vertalen',
    translationDescription:
      'Met deze functie wordt content zoals profielen, recepten, etc.automatisch vertaald naar jouw voorkeurstaal. Spreek jij bv. Nederlands en is een recept in het Duits? Dan kun je deze automatisch laten vertalen naar het Nederlands via Google Translate. * Typefouten / vertaalfouten voorbehouden.',
    notificationText: 'Push notificaties',
    pageLinks: {
      aboutus: 'over ons',
      shop: 'shop',
      contact: 'contact',
    },
  },
};

export const account = {
  extend: {
    text: 'Verlenging :',
    date: '08/01/2025',
  },
  status: {
    text2: 'ACTIEF',
    text1: 'Premium',
    value: true,
  },
  options: {
    option1: {
      name: 'profile',
      text: 'Profiel wijzigen',
    },
    option2: {
      name: 'subscription',
      text: 'Abonnement',
    },
    option3: {
      name: 'history',
      text: 'Geschiedenis',
    },
    option4: {
      name: 'logout',
      text: 'Uitloggen',
    },
  },
};

export const countries = [
  {
    country: 'Netherland',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country2',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country3',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country4',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country5',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country6',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country7',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country8',
    flag: require('../../assets/images/flag.png'),
  },
  {
    country: 'Country9',
    flag: require('../../assets/images/flag.png'),
  },
];

export const FlourList = {
  data: [
    {
      id: 1,
      flourName: 'caputo 1924',
      flourImage: require('../../assets/images/flour_1.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 2,
      flourName: 'Molino Peila',
      flourImage: require('../../assets/images/flour_2.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 3,
      flourName: 'Farina',
      flourImage: require('../../assets/images/flour_1.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 4,
      flourName: 'Freee',
      flourImage: require('../../assets/images/flour_2.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 5,
      flourName: 'caputo 1924',
      flourImage: require('../../assets/images/flour_1.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 6,
      flourName: 'Molino Peila',
      flourImage: require('../../assets/images/flour_2.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
    {
      id: 7,
      flourName: 'Molino Peila',
      flourImage: require('../../assets/images/flour_2.png'),
      country: {
        name: 'Nederland',
        flag: require('../../assets/images/flag.png'),
      },
      review: '4.6',
      mill: 'Lonneker molen',
    },
  ],
  start: '0',
  limit: '5',
  total: 5,
  totalPages: 1,
};

export const ProfileEdit = {
  fields: {
    username: {
      label: 'Weergave naam:',
      placeholder: '0543 - 20 10 14',
    },
    mail: {
      label: 'E-mail',
      placeholder: 'Info@italieplein.nl',
    },
    country: {
      label: 'land:',
      placeholder: 'Zoek op land...',
      values: countries,
    },
    password: {
      label: 'Wachtwoord',
      placeholder: 'Wachtwoord',
    },
    Confirmpassword: {
      label: 'Wachtwoord bevestigen ',
      placeholder: 'Wachtwoord bevestigen',
    },
    status: {
      label: 'Profiel verbergen',
      value: true,
    },
  },
  button: {
    button1: 'Profiel wijzigen',
    button2: 'Profiel verwijderen',
    yesButton: 'yee',
    noButton: 'nee',
  },
  modalDelete: {
    title: 'Profiel verwijderen?',
    delAccount: 'Stop ook de verlenging van mijn abonnement.',
  },
};

export const notifyContent = {
  data: [
    {
      id: 1,
      image: require('../../assets/images/notify1.png'),
      title: 'Pizza timer: Deeg moet eruit!',
      date: '14-07-2024',
      time: '15:00',
    },
    {
      id: 2,
      image: require('../../assets/images/notify2.png'),
      title: 'Stefan heeft een recept geplaatst',
      date: '14-07-2024',
      time: '15:00',
    },
    {
      id: 3,
      image: require('../../assets/images/notify3.png'),
      title: '5 sterren voor jouw recept!',
      date: '14-07-2024',
      time: '15:00',
    },
    {
      id: 4,
      image: require('../../assets/images/notify1.png'),
      title: 'Pizza timer: Deeg maken!',
      date: '14-07-2024',
      time: '15:00',
    },
    {
      id: 5,
      image: require('../../assets/images/notify2.png'),
      title: 'Koen heeft een recept geplaatst!',
      date: '14-07-2024',
      time: '15:00',
    },
    {
      id: 6,
      image: require('../../assets/images/notify3.png'),
      title: '4 sterren voor jouw recept!',
      date: '14-07-2024',
      time: '15:00',
    },
  ],
  start: '0',
  limit: '5',
  total: 5,
  totalPages: 1,
};

export const PaywallContent = {
  sheetTitle: 'Koop een abonnement!',
  sliderImage: [
    require('../../assets/images/pizza1.png'),
    require('../../assets/images/pizza2.png'),
    require('../../assets/images/pizza3.png'),
  ],
  uspText: ['20+ functies', 'Premium member', 'Toegang tot 1000+ recepten'],
  planCost: {
    price: 9999,
    plan: 'Per jaar',
  },
  button: 'abonnement starten',
  disclaimer: {
    title: 'Disclaimer :',
    text: 'Nulla tortor risus, semper eget urna ut. Aenean placerat neque nec arcu blandit, quis egestas nulla posuere.',
  },
};

export const RenewContent = {
  sheetTitle: 'Jouw abonnement is actief!',
  expiry: {
    date: '08/07/2024',
    description: 'Tot de volgende afschrijving',
  },
  para1:
    'Aliquam viverra fringilla enim. Nam elementum erat ut tellus eu ismod tempus. Sus pendisse ut dignissim erat. Vivamus euismod dapibus diam, nec tincidunt lectus placerat sed. ',
  list: [
    'Sed tristique eros quis interdum semper. ',
    'Mauris condimentum sapien nec eros luctus efficitur.',
    'Donec dignissim ipsum nisi.',
    'Vitae mollis dolor scelerisque non. Mauris scelerisque sagi ttis lectus non fermentum. ',
  ],
  button: 'annuleer dit lidmaatschap',
};

export const WizardStep = {
  steps: {
    datas: ['Stap 1', 'Stap 2', 'Stap 3'],
    status: 1,
  },
  step1: {
    search: {
      label: 'Selecteer je bloem',
      placeholder: 'Zoek een bloem op naam',
      scan: 'Scan bloem',
    },
    inputs: {
      date: {
        label: 'Wanneer wil je pizza eten?',
        placeholder: 'Wanneer wil je pizza eten?',
      },
      time: {
        placeholder: 'time',
        timeValues: [
          '14:30 ',
          '15:30 ',
          '17:30 ',
          '14:30 ',
          '15:30 ',
          '17:30 ',
          '14:30 ',
          '15:30 ',
          '17:30 ',
        ],
      },
      person: {
        label: 'Met hoeveel personen ga je pizza eten?',
        placeholder: 'Aantal personen',
      },
      apetite: {
        label: 'Hoeveel honger heb je?',
        placeholder: 'Hoeveel honger heb je?',
        values: ['laag', 'medium', 'hoog'],
      },
      size: {
        label: 'Welke type bloem ga je gebruiken?',
        placeholder: 'Welke type bloem ga je gebruiken?',
        values: ['Medium', 'large', 'small'],
      },
    },
    button: 'Volgende stap',
  },
  step2: {
    title: 'Kies een recept',
    paragraph:
      'Praesent pulvinar porta mauris eget imperdiet. Praesent at nisi convallis orci vestibulum sagittis. Duis id sollicitudin urna, non tristique libero. In congue quis libero quis gravida.',
    showRecepie: {
      title: 'Toon enkel eigen recepten',
      yes: 'ja',
      no: 'Nee',
    },
    sorting: {
      title: 'Sorteer op',
      button1: 'Populariteit',
      button2: 'Nieuwste',
      button3: 'Sterren',
    },
    recipeButton: 'Gebruik dit recept',
    recipes: [
      {
        title: 'Meatlovers pizza',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza1.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 4.9,
          uses: 25,
        },
      },
      {
        title: 'Sicilian pizza',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza2.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 4,
          uses: 10,
        },
      },
      {
        title: 'Pepperoni pizza',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza3.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 4,
          uses: 60,
        },
      },
      {
        title: 'Pizza pollo',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza1.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 2.6,
          uses: 40,
        },
      },
      {
        title: 'Sicilian pizza',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza2.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 3.2,
          uses: 20,
        },
      },
      {
        title: 'Pepperoni pizza',
        description:
          'Pellentesque finibus vehicula nibh eu tempor. Donec ut risus bibendum, ornare tellus ac, scelerisque augue Morbi porttitor mauris ut semper faucibus.',
        pizza: require('../../assets/images/pizza3.png'),
        author: {
          name: 'Lisanne de Vries',
          image: require('../../assets/images/pizzaAuthor.png'),
          country: {
            flag: require('../../assets/images/flag.png'),
            countryName: 'Nederland',
          },
          rating: 4,
          uses: 5,
        },
      },
    ],
  },
  step3: {
    title: 'Pizza’s in de maak',
    sorting: {
      button1: 'Wachtrij',
      button2: 'Geschiedenis',
    },
    history: [
      {
        image: require('../../assets/images/pizza1.png'),
        title: 'Romeins',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 PIZZA ETEN',
        inProcess: 'Pizza in de oven',
      },
      {
        image: require('../../assets/images/pizza2.png'),
        title: 'Molino Peila',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 Opbollen',
      },
      {
        image: require('../../assets/images/pizza3.png'),
        title: 'Napolitaans',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 Deeg maken',
      },
      {
        image: require('../../assets/images/pizza1.png'),
        title: 'Freee',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 PIZZA ETEN',
      },
      {
        image: require('../../assets/images/pizza2.png'),
        title: 'Molino Peila',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 Opbollen',
      },
      {
        image: require('../../assets/images/pizza3.png'),
        title: 'Napolitaans',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 Deeg maken',
      },
      {
        image: require('../../assets/images/pizza1.png'),
        title: 'Freee',
        subtitle: 'Etenstijd:',
        time: '08/07/2024 17:59 PIZZA ETEN',
      },
    ],
    pizzaQue: {
      pizzaName: 'Zomer pizza',
      image: require('../../assets/images/pizza1.png'),
      steps: {
        head: 'Stappen : ',
        data: '4 stappen - gemiddeld 5 uur',
      },
      current: {
        head: 'Huidige stap : ',
        data: 'Plaats de deeg in de koeling',
      },
      processSteps: [
        {
          title: 'Maak de pizzadeeg',
          duration: '20 min',
          description:
            'Duis cursus sit amet turpis nec lobortis. Proin ut vestibulum urna, vitae semper lacus. Cras rutrum interdum nulla eget sagittis. Pellentesque cursus quam venenatis lorem cursus.',
        },
        {
          title: 'Plaats de deeg in de koeling',
          duration: '4 uur - 4˚C',
          description:
            'Duis cursus sit amet turpis nec lobortis. Proin ut vestibulum urna, vitae semper lacus.',
        },
        {
          title: 'Maak de deegbollen',
          duration: '30 min',
          description:
            'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam ultrices non odio vel imperdiet. Nam placerat egestas tortor, ac interdum sem volutpat semper. Mauris aliquam dui est, id venenatis quam ullamcorper ac. Praesent nibh orci, laoreet ut turpis et, pulvinar convallis ligula. ',
        },
        {
          title: 'Bak de pizza perfect',
          duration: '10 min - 400˚C',
          description:
            'Proin ut vestibulum urna, vitae semper lacus. Cras rutrum interdum nulla eget sagittis. Pellentesque cursus quam venenatis lorem cursus.',
        },
        {
          title: 'Maak de deegbollen',
          duration: '30 min',
          description:
            'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam ultrices non odio vel imperdiet. Nam placerat egestas tortor,',
        },
        {
          title: 'Bak de pizza perfect',
          duration: '10 min - 400˚C',
          description:
            'Proin ut vestibulum urna, vitae semper lacus. Cras rutrum interdum nulla eget sagittis. Pellentesque cursus quam venenatis lorem cursus.',
        },
        {
          title: 'Bak de pizza perfect',
          duration: '10 min - 400˚C',
          description:
            'Proin ut vestibulum urna, vitae semper lacus. Cras rutrum interdum nulla eget sagittis. Pellentesque cursus quam venenatis lorem cursus.',
        },
        {
          title: 'Maak de deegbollen',
          duration: '30 min',
          description:
            'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam ultrices non odio vel imperdiet. Nam placerat egestas tortor,',
        },
        {
          title: 'Bak de pizza perfect',
          duration: '10 min - 400˚C',
          description:
            'Proin ut vestibulum urna, vitae semper lacus. Cras rutrum interdum nulla eget sagittis. Pellentesque cursus quam venenatis lorem cursus.',
        },
      ],
      processStatus: 2,
    },
  },
};

export const community = {
  recipes: {
    button: {
      title: 'Community recepten',
      buttonText: 'Filter recepten',
    },
    bottomsheet: {
      title: 'Filter',
      button: 'Pizza recepten filteren',
      textInput: 'Zoek op naam of omschrijving',
      drop: {
        label: 'Sorteren',
        values: ['Op nieuwste', 'Op nieuwste', 'Op nieuwste'],
      },
    },
    datas: [
      {
        image: require('../../assets/images/pizza1.png'),
        pizza: 'Pizza Pollo',
        rating: 4.6,
        timing: {
          placeholder: 'Klaar in ',
          value: '+/- 5 uur',
        },
        toprated: 'TOP KEUZE',
        user: {
          image: require('../../assets/images/user1.png'),
          name: 'Koen de Vries',
          time: {
            placeholder: 'Toegevoegd op',
            value: '14-07-2024',
          },
        },
      },
      {
        image: require('../../assets/images/pizza2.png'),
        pizza: 'Sicilian pizza',
        rating: 4,
        timing: {
          placeholder: 'Klaar in ',
          value: '+/- 5 uur',
        },
        user: {
          image: require('../../assets/images/user2.png'),
          name: 'Pim de Leeuw',
          time: {
            placeholder: 'Toegevoegd op',
            value: '14-07-2024',
          },
        },
      },
      {
        image: require('../../assets/images/pizza3.png'),
        pizza: 'Pepperoni pizza',
        rating: 3.6,
        timing: {
          placeholder: 'Klaar in ',
          value: '+/- 5 uur',
        },
        user: {
          image: require('../../assets/images/user3.png'),
          name: 'Lisa de Groot',
          time: {
            placeholder: 'Toegevoegd op',
            value: '14-07-2024',
          },
        },
      },
    ],
  },
  user: {
    button: {
      title: 'Gebruikers',
      buttonText: 'Filter gebruikers',
    },
    bottomsheet: {
      title: 'Filter',
      button: 'Gebruikers filteren',
      textInput: 'Zoek op naam',
      drop: {
        label: 'Sorteren',
        values: ['Op nieuwste', 'Op nieuwste', 'Op nieuwste'],
      },
    },
    datas: [
      {
        image: require('../../assets/images/user1.png'),
        name: 'Lisa de Groot',
        rating: 4.5,
        country: 'Nederland',
        flag: require('../../assets/images/flag.png'),
        count: {
          placeholder: 'Aantal recepten:',
          value: 2,
        },
      },
      {
        image: require('../../assets/images/user2.png'),
        name: 'Peter228',
        rating: 4,
        country: 'Nederland',
        flag: require('../../assets/images/flag.png'),
        count: {
          placeholder: 'Aantal recepten:',
          value: 10,
        },
      },
      {
        image: require('../../assets/images/user3.png'),
        name: 'Rebel1',
        rating: 3.5,
        country: 'Nederland',
        flag: require('../../assets/images/flag.png'),
        count: {
          placeholder: 'Aantal recepten:',
          value: 8,
        },
      },
      {
        image: require('../../assets/images/user4.png'),
        name: 'Karlijn007',
        rating: 4,
        country: 'Nederland',
        flag: require('../../assets/images/flag.png'),
        count: {
          placeholder: 'Aantal recepten:',
          value: 4,
        },
      },
    ],
  },
};

export const userdetail = {
  sidehead: 'Stichter van Perfect Pizza Flours',
  paragraph1:
    'Praesent pulvinar porta mauris eget imperdiet. Praesent at nisi convallis orci vestibulum sagittis. Duis id sollicitudin urna, non tristique libero. In congue quis libero quis gravida.',
  paragraph2:
    'Aenean sapien diam, tincidunt in est, mollis egestas. Suspendisse ultrices malesuada convallis. Quisque ut faucibus orci.',
  reviews: [
    {
      name: 'Kip pizza',
      pizza: require('../../assets/images/pizza1.png'),
      date: '24/06/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 52,
      rating: 4,
    },
    {
      name: 'Sicilian pizza',
      pizza: require('../../assets/images/pizza2.png'),
      date: '10/05/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 2,
      rating: 5,
    },
    {
      name: 'Pepperoni pizza',
      pizza: require('../../assets/images/pizza3.png'),
      date: '08/04/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 60,
      rating: 3,
    },
    {
      name: 'Kip pizza',
      pizza: require('../../assets/images/pizza1.png'),
      date: '24/06/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 52,
      rating: 4,
    },
    {
      name: 'Sicilian pizza',
      pizza: require('../../assets/images/pizza2.png'),
      date: '10/05/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 2,
      rating: 5,
    },
    {
      name: 'Pepperoni pizza',
      pizza: require('../../assets/images/pizza3.png'),
      date: '08/04/2024',
      description:
        'Donec ornare dolor ut velit finibus, at euismod enim accumsan. Vestibulum eget efficitur ex, porta ornare metus. Phasellus sit amet erat dictum, consequat dui ac, egestas lectus.',
      username: 'Stefan de Vries',
      count: 60,
      rating: 3,
    },
  ],
};

export const recipeDetail = {
  images: [
    require('../../assets/images/landpizza1.png'),
    require('../../assets/images/landpizza2.jpg'),
    require('../../assets/images/landpizza1.png'),
    require('../../assets/images/landpizza2.jpg'),
    require('../../assets/images/landpizza1.png'),
  ],
  title: 'Deze pizza is gemaakt door',
  paragraph1:
    'Curabitur quis dictum ante. Aliquam erat volutpat. Aliquam viverra fringilla enim. Nam elementum erat ut tellus euismod tempus. Sus pendisse ut dignissim erat. Vivamus euismod dap ibus diam, nec tincidunt lectus placerat sed. Ut aliquet nibh non diam eleifend, vitae tempor lectus maximus.',
  paragraph2:
    'Vestibulum rhoncus pellentesque nibh, vel pellentesque massa tempus id. Integer faucibus tortor elit. Duis eget sagittis nulla. Nulla luctus sed diam eu dapibus. Etiam eu libero finibus felis tristique congue eget vel leo. Praesent diam velit, tincidunt vitae fermentum vitae, ornare vel massa. Aliquam rutrum turpis id felis sagittis tristique. Cras ut massa erat.',
  country: {
    flag: require('../../assets/images/flag.png'),
    countryName: 'Nederland',
  },
  recipe: {
    list1: {
      title: 'Gebruikte Pizzabloom',
      data: [
        {
          head: 'Bloem',
          value: '962 gram',
        },
      ],
    },
    list2: {
      title: 'Aanbevolen Rust-&Rijstijd',
      data: [
        {
          head: 'Met koeling ',
          value: '8 uur - 12 uur',
        },
        {
          head: 'Zonder koeling',
          value: '2 uur - 4 uur',
        },
      ],
    },
    list3: {
      title: 'Aantal Deegbollen',
      data: [
        {
          head: 'Aantal ',
          value: '6 stuks',
        },
        {
          head: 'Gewicht',
          value: '260 gram',
        },
      ],
    },
    list4: {
      title: 'Ingrediënten Pizzadeeg',
      data: [
        {
          head: 'Bloem',
          value: '962 gram',
        },
        {
          head: 'Totaal deeg ',
          value: '1560 gram',
        },
        {
          head: 'Water',
          value: '577 ml',
        },
        {
          head: 'Gist ',
          value: '1.90 gram ',
        },
        {
          head: 'Type gist',
          value: 'Droge gist',
        },
        {
          head: 'Zout ',
          value: '19 gram ',
        },
        {
          head: 'Olie',
          value: '0 gram',
        },
        {
          head: 'W-value ',
          value: 'Zwak',
        },
      ],
    },
  },
  reviews: {
    button: {
      title: 'Pizza reviews',
      buttonText: 'Schrijf een review',
    },
    datas: [
      {
        title: 'Geweldig recept!',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam libero arcu, aliquet vel sem eu, congue euismod risus. Curabitur quis dictum ante. ',
        date: '14-07-2024',
        count: '26 Likes',
        rating: 4,
      },
      {
        title: 'Wow !!',
        description:
          'In pellentesque ex sed eleifend luctus. Aenean finibus sem a augue ornare, vel tristique orci faucibus. ',
        date: '10-07-2024',
        count: '26 Likes',
        rating: 4,
      },
      {
        title: 'Geweldig recept!',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam libero arcu, aliquet vel sem eu, congue euismod risus. Curabitur quis dictum ante. ',
        date: '2-07-2024',
        count: '26 Likes',
        rating: 4,
      },
    ],
    bottomsheet: {
      title: 'Plaats een review',
      button: 'VERSTUREN',
      text1: {
        label: 'Titel',
        placeholder: 'Kies een pakkende titel voor jouw review...',
      },
      text2: {
        label: 'Vertel ons je verhaal',
        placeholder: 'Type hier jouw ervaring met dit recept...',
      },
      text3: {
        label: 'Jouw waardering',
      },
    },
  },
};
