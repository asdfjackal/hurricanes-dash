import type { NextPage } from 'next';
import Schedule from '../components/Schedule';
import Standings from '../components/Standings';

const Home: NextPage = ({ standings, schedule }: any) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Carolina Hurricanes
          </h2>
        </div>
        <div className="mt-12 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:gap-x-8">
          <div className="relative">
            <div>
              <Standings standings={standings} />
            </div>
          </div>
          <div className="relative">
            <div>
              <Schedule schedule={schedule} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const statsRes = await fetch(
    'https://statsapi.web.nhl.com/api/v1/teams/12/stats'
  );
  const stats = await statsRes.json();

  const standingsRes = await fetch(
    'https://statsapi.web.nhl.com/api/v1/standings'
  );
  const standings = await standingsRes.json();

  const scheduleRes = await fetch(
    'https://statsapi.web.nhl.com/api/v1/schedule?teamId=12&season=20222023'
  );
  const schedule = await scheduleRes.json();

  const teamStandings = standings.records
    .filter((division: any) => division.division.id === 18)[0]
    .teamRecords.filter((team: any) => team.team.id === 12)[0];

  const today = new Date().toISOString().slice(0, 10);

  const filteredSchedule = schedule.dates.filter(
    (date: any) => date.date >= today
  );

  return {
    props: {
      standings: teamStandings,
      schedule: filteredSchedule,
    },
  };
}

export default Home;
