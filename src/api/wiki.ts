// Wikipedia API for fun facts
export interface WikipediaSummary {
  type: string;
  title: string;
  displaytitle: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface FunFact {
  text: string;
  image?: string;
  source: string;
}

// Fallback fun facts for when Wikipedia fails
const fallbackFacts: FunFact[] = [
  {
    text: "Weather patterns are influenced by the Coriolis effect, which is caused by Earth's rotation and affects wind direction globally.",
    source: "Science Fact",
  },
  {
    text: "The highest temperature ever recorded on Earth was 134°F (56.7°C) in Death Valley, California in 1913.",
    source: "Weather Record",
  },
  {
    text: "Lightning strikes the Earth about 100 times per second, creating approximately 8.6 million lightning strikes per day.",
    source: "Weather Science",
  },
  {
    text: "Raindrops are not tear-shaped but are actually round when small and flatten as they get larger due to air resistance.",
    source: "Physics Fact",
  },
  {
    text: "The fastest wind speed ever recorded was 302 mph (486 km/h) during a tornado in Oklahoma in 1999.",
    source: "Weather Record",
  },
  {
    text: "Snow appears white because it reflects all colors of visible light equally, but it's actually transparent.",
    source: "Science Fact",
  },
  {
    text: "A single thunderstorm can contain more energy than multiple atomic bombs.",
    source: "Weather Science",
  },
  {
    text: "The coldest temperature ever recorded was -128.6°F (-89.2°C) at Antarctica's Vostok Station in 1983.",
    source: "Weather Record",
  },
  {
    text: "Hurricanes in the Northern Hemisphere spin counterclockwise, while those in the Southern Hemisphere spin clockwise.",
    source: "Weather Science",
  },
  {
    text: "Weather satellites can detect temperature differences as small as 0.1°C from space.",
    source: "Technology Fact",
  },
];

export async function fetchCityFunFact(cityName: string, countryCode?: string): Promise<FunFact> {
  try {
    // Try city + country first, then just city name
    const searchTerms = countryCode 
      ? [`${cityName}, ${countryCode}`, cityName]
      : [cityName];
    
    for (const searchTerm of searchTerms) {
      try {
        const encodedTerm = encodeURIComponent(searchTerm);
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTerm}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data: WikipediaSummary = await response.json();
          
          // Check if we got a valid article (not a disambiguation or redirect)
          if (data.extract && data.extract.length > 100) {
            return {
              text: data.extract,
              image: data.thumbnail?.source || data.originalimage?.source,
              source: `Wikipedia - ${data.title}`,
            };
          }
        }
      } catch (error) {
        console.log(`Failed to fetch Wikipedia summary for ${searchTerm}:`, error);
        continue;
      }
    }
    
    // If all Wikipedia attempts fail, return a random fallback fact
    throw new Error('Wikipedia lookup failed');
  } catch (error) {
    console.log('Using fallback fun fact');
    const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
    return randomFact;
  }
}

export function getRandomFallbackFact(): FunFact {
  return fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
}
