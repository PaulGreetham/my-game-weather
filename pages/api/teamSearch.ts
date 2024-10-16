// pages/api/teamSearch.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// Define the structure of a team as per the external API's response
interface Team {
  id: number;
  name: string;
  code: string | null;
  country: string;
  founded: number | null;
  national: boolean;
  logo: string;
}

interface Venue {
  id: number | null;
  name: string | null;
  address: string | null;
  city: string | null;
  capacity: number | null;
  surface: string | null;
  image: string | null;
}

interface ExternalResponse {
  team: Team;
  venue: Venue;
}

interface ExternalFootballAPIResponse {
  get: string;
  parameters: { search?: string; name?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
  results: number;
  paging: { current: number; total: number };
  response: ExternalResponse[];
}

interface StandardizedAPIResponse {
  results: number;
  teams: TeamWithVenue[];
}

interface TeamWithVenue extends Team {
  venue: Venue;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardizedAPIResponse | ErrorResponse>
) {
  const { search, name } = req.query;
  const apiKey = process.env.FOOTBALL_API_KEY; // Ensure this is set in .env.local

  console.log(`[API Handler] Received query params - search: ${search}, name: ${name}`);

  // Determine which parameter to use: search or name
  let endpoint = '';
  if (search && typeof search === 'string') {
    // Validate search parameter
    if (search.length < 3 || !/^[A-Za-z\s_]+$/.test(search)) {
      console.error(`[API Handler] Invalid search query: ${search}`);
      return res.status(400).json({ error: 'Search query must be at least 3 alphabetic characters.' });
    }
    // Format the search term: lowercase and replace spaces with underscores
    const formattedSearch = search.toLowerCase().replace(/ /g, '_');
    endpoint = `https://v3.football.api-sports.io/teams?search=${formattedSearch}`;
  } else if (name && typeof name === 'string') {
    // Validate name parameter
    if (name.length < 3 || !/^[A-Za-z\s_]+$/.test(name)) {
      console.error(`[API Handler] Invalid name query: ${name}`);
      return res.status(400).json({ error: 'Name query must be at least 3 alphabetic characters.' });
    }
    // Format the name term: lowercase and replace spaces with underscores
    const formattedName = name.toLowerCase().replace(/ /g, '_');
    endpoint = `https://v3.football.api-sports.io/teams?name=${formattedName}`;
  } else {
    console.error(`[API Handler] No valid query parameter provided.`);
    return res.status(400).json({ error: 'Please provide a valid search or name query parameter.' });
  }

  console.log(`[API Handler] Fetching data from external API: ${endpoint}`);

  try {
    const apiResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey as string,
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
      },
    });

    console.log(`[API Handler] External API response status: ${apiResponse.status}`);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error(`[API Handler] External API error: ${JSON.stringify(errorData)}`);
      return res.status(apiResponse.status).json({ error: errorData.message || 'Failed to fetch data from Football API' });
    }

    const externalData: ExternalFootballAPIResponse = await apiResponse.json();
    console.log(`[API Handler] External API data: ${JSON.stringify(externalData)}`);

    // Map the external response to a standardized structure
    const teams: TeamWithVenue[] = externalData.response.map((item) => ({
      id: item.team.id,
      name: item.team.name,
      code: item.team.code,
      country: item.team.country,
      founded: item.team.founded,
      national: item.team.national,
      logo: item.team.logo,
      venue: {
        id: item.venue?.id || null,
        name: item.venue?.name || null,
        address: item.venue?.address || null,
        city: item.venue?.city || null,
        capacity: item.venue?.capacity || null,
        surface: item.venue?.surface || null,
        image: item.venue?.image || null,
      },
    }));

    const standardizedData: StandardizedAPIResponse = {
      results: externalData.results,
      teams,
    };

    return res.status(200).json(standardizedData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error(`[API Handler] Fetch error: ${errorMessage}`);
    return res.status(500).json({ error: errorMessage });
  }
}
