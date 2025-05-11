import { data, type ActionFunctionArgs } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJSON } from "lib/utils";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";

export async function createTripAction({ request }: ActionFunctionArgs) {
  const {
    userId,
    country,
    interest,
    groupType,
    budget,
    travelStyle,
    duration,
  } = await request.json();

  const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const unsplashAccessAPIKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interest}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${duration},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interest},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;

    const textResult = await googleGenAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    const trip = parseMarkdownToJSON(textResult.response.text());

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyle}&client_id=${unsplashAccessAPIKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular ?? null);

    const result = await database.createDocument(
      appwriteConfig.dbId,
      appwriteConfig.tripsCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      }
    );

    return data({ id: result.$id });
  } catch (err) {
    console.error("Error generating travel plan:", err);
  }
}
