'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define the type for a team (should match what comes from your API)
interface Team {
  id: number;
  name: string;
  code: string | null;
  country: string;
  founded: number | null;
  national: boolean;
  logo: string;
  venue: Venue;
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

interface APIResponse {
  results: number;
  teams: Team[];
}

interface ErrorResponse {
  error: string;
}

export function TeamSearchInput() {
  const [teamName, setTeamName] = useState<string>(''); // Stores the search input
  const [teamData, setTeamData] = useState<Team[]>([]); // Strictly typed team data
  const [isLoading, setIsLoading] = useState<boolean>(false); // Handles the loading state
  const [error, setError] = useState<string | null>(null); // Handles errors

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  // Handle the search button click
  const handleSearch = async () => {
    // Input Validation: At least 3 alphabetic characters, spaces allowed
    if (teamName.length < 3 || !/^[A-Za-z\s_]+$/.test(teamName)) {
      setError('Please enter at least 3 alphabetic characters.');
      setTeamData([]);
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    console.log(`[Client] Searching for team: ${teamName}`);

    try {
      // Decide whether to use 'search' or 'name' parameter
      // For simplicity, we'll use 'search' here
      const response = await fetch(`/api/teamSearch?search=${encodeURIComponent(teamName)}`);

      console.log(`[Client] Received response status: ${response.status}`);

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        console.error(`[Client] API error: ${errorData.error}`);
        throw new Error(errorData.error || 'Error fetching team data');
      }

      const data: APIResponse = await response.json();
      console.log(`[Client] API response data: ${JSON.stringify(data)}`);

      if (data.teams && Array.isArray(data.teams) && data.teams.length > 0) {
        setTeamData(data.teams);
        console.log(`[Client] Found ${data.teams.length} team(s).`);
      } else {
        setTeamData([]);
        setError('No teams found.');
        console.warn(`[Client] No teams found in the response.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error(`[Client] Search error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Input field for the team name */}
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter football team name"
          value={teamName}
          onChange={handleInputChange}
          className="w-full"
        />
        <Button type="button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Display an error message if an error occurs */}
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* Display team data if available */}
      {teamData.length > 0 && (
        <div className="mt-4 w-full max-w-md p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Team Data:</h2>
          <ul>
            {teamData.map((team) => (
              <li key={team.id} className="mb-4 flex items-center">
                <Image
                  src={team.logo}
                  alt={`${team.name} Logo`}
                  width={48}
                  height={48}
                  className="mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{team.name} ({team.code || 'N/A'})</h3>
                  <p>{team.country} | Founded: {team.founded || 'N/A'}</p>
                  {team.venue.name && (
                    <p>
                      Venue: {team.venue.name}, {team.venue.city || 'N/A'} 
                      {team.venue.capacity && ` | Capacity: ${team.venue.capacity}`}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
