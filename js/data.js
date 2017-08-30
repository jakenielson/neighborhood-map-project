var dummyLocations = [
  {
    name: "Phoenix",
    geometry: {location: {lat: 33.4483771, lng: -112.07403729999999}}
  },
  {
    name: "Phoenix Marriott Mesa",
    geometry: {location: {lat: 33.41985999999999, lng: -111.828731}}
  },
  {
    name: "Mesa Mezona Hotel",
    geometry: {location: {lat: 33.41555, lng: -111.83842199999998}}
  },
  {
    name: "Courtyard by Marriott Phoenix Mesa",
    geometry: {location: {lat: 33.39198009999999, lng: -111.85228410000002}}
  },
  {
    name: "La Quinta Inn & Suites Phoenix Mesa West",
    geometry: {location: {lat: 33.3909063, lng: -111.85222920000001}}
  },
  {
    name: "Residence Inn by Marriott Phoenix Mesa",
    geometry: {location: {lat: 33.38987099999999, lng: -111.85188099999999}}
  },
  {
    name: "Hyatt Place Phoenix/Mesa",
    geometry: {location: {lat: 33.435929, lng: -111.86150499999997}}
  },
  {
    name: "Hilton Phoenix / Mesa",
    geometry: {location: {lat: 33.387461, lng: -111.85366039999997}}
  },
  {
    name: "Super 8 Tempe/ASU/Airport",
    geometry: {location: {lat: 33.415329, lng: -111.92352}}
  },
  {
    name: "Aloft Tempe",
    geometry: {location: {lat: 33.4346906, lng: -111.92447319999997}}
  },
  {
    name: "Best Western Inn of Tempe",
    geometry: {location: {lat: 33.4354704, lng: -111.9273392}}
  },
  {
    name: "3 Palms",
    geometry: {location: {lat: 33.4645916, lng: -111.91438199999999}}
  },
  {
    name: "Embassy Suites Phoenix - Tempe",
    geometry: {location: {lat: 33.38414339999999, lng: -111.92754120000001}}
  },
  {
    name: "Hospitality Suite Resort",
    geometry: {location: {lat: 33.45294, lng: -111.92593299999999}}
  },
  {
    name: "Tempe Mission Palms Hotel and Conference Center",
    geometry: {location: {lat: 33.42630399999999, lng: -111.93888720000001}}
  },
  {
    name: "Holiday Inn Express & Suites Scottsdale - Old Town",
    geometry: {location: {lat: 33.4844845, lng: -111.92497459999998}}
  },
  {
    name: "Courtyard by Marriott Scottsdale Old Town",
    geometry: {location: {lat: 33.4862269, lng: -111.9254664}}
  },
  {
    name: "DoubleTree by Hilton Phoenix Tempe",
    geometry: {location: {lat: 33.4064705, lng: -111.9626485}}
  },
  {
    name: "The Saguaro Scottsdale",
    geometry: {location: {lat: 33.4943283, lng: -111.92283570000001}}
  },
  {
    name: "Mesa",
    geometry: {location: {lat: 33.4151843, lng: -111.8314724}}
  },
  {
    name: "Hilton Garden Inn Scottsdale Old Town",
    geometry: {location: {lat: 33.495093, lng: -111.92281200000002}}
  },
  {
    name: "SpringHill Suites by Marriott Phoenix Tempe/Airport",
    geometry: {location: {lat: 33.42917, lng: -111.963614}}
  },
  {
    name: "Hyatt House Scottsdale/Old Town",
    geometry: {location: {lat: 33.4980314, lng: -111.9217157}}
  },
  {
    name: "Crowne Plaza Resort Phoenix - Chandler Golf Resort",
    geometry: {location: {lat: 33.3040947, lng: -111.8427294}}
  },
  {
    name: "Scottsdale Marriott Suites Old Town",
    geometry: {location: {lat: 33.49648200000001, lng: -111.92468100000002}}
  },
  {
    name: "Hyatt Place Scottsdale/Old Town",
    geometry: {location: {lat: 33.49748040000001, lng: -111.9234543}}
  },
  {
    name: "Candlewood Suites Phoenix/Tempe",
    geometry: {location: {lat: 33.3772232, lng: -111.9588938}}
  },
  {
    name: "Howard Johnson Scottsdale Old Town",
    geometry: {location: {lat: 33.495394, lng: -111.92805199999998}}
  },
  {
    name: "Hotel Valley Ho",
    geometry: {location: {lat: 33.4934997, lng: -111.93345299999999}}
  },
  {
    name: "Best Western Plus Sundial",
    geometry: {location: {lat: 33.502485, lng: -111.922439}}
  },
  {
    name: "Sheraton Phoenix Airport Hotel Tempe",
    geometry: {location: {lat: 33.4108812, lng: -111.97034960000002}}
  },
  {
    name: "W Scottsdale",
    geometry: {location: {lat: 33.5019692, lng: -111.92406370000003}}
  },
  {
    name: "Red Roof PLUS+ Tempe - Phoenix Airport",
    geometry: {location: {lat: 33.41145840000001, lng: -111.9715261}}
  },
  {
    name: "Phoenix Marriott Tempe at The Buttes",
    geometry: {location: {lat: 33.403532, lng: -111.97094500000003}}
  },
  {
    name: "Best Western Plus Tempe by the Mall",
    geometry: {location: {lat: 33.3765273, lng: -111.96389529999999}}
  },
  {
    name: "Hotel Tempe/Phoenix Airport InnSuites Hotel & Suites",
    geometry: {location: {lat: 33.3779055, lng: -111.96528280000001}}
  },
  {
    name: "Ramada Tempe",
    geometry: {location: {lat: 33.3771211, lng: -111.96642429999997}}
  },
  {
    name: "La Quinta Inn & Suites Mesa Superstition Springs",
    geometry: {location: {lat: 33.3858228, lng: -111.69239219999997}}
  },
  {
    name: "Hyatt Place Tempe/Phoenix Airport",
    geometry: {location: {lat: 33.4287259, lng: -111.96278050000001}}
  },
  {
    name: "La Quinta Inn Phoenix Sky Harbor Airport",
    geometry: {location: {lat: 33.4202355, lng: -111.97656710000001}}
  },
  {
    name: "SpringHill Suites by Marriott Phoenix Chandler/Fashion Center",
    geometry: {location: {lat: 33.306646, lng: -111.89745700000003}}
  },
  {
    name: "The Scott Resort & Spa (formerly FireSky Resort)",
    geometry: {location: {lat: 33.5087674, lng: -111.92577690000002}}
  },
  {
    name: "Holiday Inn Hotel & Suites Phoenix Airport",
    geometry: {location: {lat: 33.418305, lng: -111.97938199999999}}
  },
  {
    name: "Arizona Grand Resort & Spa",
    geometry: {location: {lat: 33.37426680000001, lng: -111.97172660000001}}
  },
  {
    name: "Hilton Phoenix Airport",
    geometry: {location: {lat: 33.424616, lng: -111.97978840000002}}
  },
  {
    name: "DoubleTree Resort by Hilton Hotel Paradise Valley - Scottsdale",
    geometry: {location: {lat: 33.5148944, lng: -111.9249203}}
  },
  {
    name: "Arizona Mills",
    geometry: {location: {lat: 33.3830454, lng: -111.96447219999999}}
  },
  {
    name: "Hilton Phoenix Chandler",
    geometry: {location: {lat: 33.2978428, lng: -111.8917687}}
  },
  {
    name: "Courtyard by Marriott Scottsdale Salt River",
    geometry: {location: {lat: 33.51385520000001, lng: -111.89013829999999}}
  },
  {
    name: "Talking Stick Resort",
    geometry: {location: {lat: 33.54011300000001, lng: -111.86984899999999}}
  },
  {
    name: "Days Inn & Suites Mesa",
    geometry: {location: {lat: 33.4156938, lng: -111.7929307}}
  },
  {
    name: "Motel 6",
    geometry: {location: {lat: 33.503045, lng: -111.93290200000001}}
  },
  {
    name: "Aloft Phoenix-Airport",
    geometry: {location: {lat: 33.44859410000001, lng: -111.98602270000004}}
  },
  {
    name: "The Phoenician, a Luxury Collection Resort, Scottsdale",
    geometry: {location: {lat: 33.5030951, lng: -111.95068359999999}}
  },
  {
    name: "Scottsdale Camelback Resort",
    geometry: {location: {lat: 33.502476, lng: -111.945608}}
  }
]
