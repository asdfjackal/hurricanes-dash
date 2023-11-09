import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import RecentGame, { RecentGamePlay, RecentGamePeriod, RecentGameProps } from '../components/RecentGame';
import Schedule, { ScheduleProps } from '../components/Schedule';
import Standings, { StandingsProps } from '../components/Standings';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ standings, schedule, recentGame }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <div>
        <div className="flex flex-row justify-center py-8 text-black h-fit">
          <Image
            src="/header.png"
            alt="Carolina Hurricanes Logo"
            width={350}
            height={100}
            className="relative"
          />
        </div>
      </div>
      <div className="bg-gray-200 text-black h-full">
        <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:py-8 lg:px-8">
          <div className="space-y-8 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 sm:space-y-0 lg:gap-x-8">
            <div className="relative h-full">
              <Standings standings={standings.standings} />
            </div>
            <div className="relative h-full">
              <Schedule schedule={schedule.schedule} />
            </div>
            <div className="relative h-full">
              <RecentGame recentGame={recentGame.recentGame} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = (async () => {
  const teamInfoRes = await fetch(
    'https://api.nhle.com/stats/rest/en/team'
  );
  const teamInfo = await teamInfoRes.json();
  const teamMap = new Map();
  teamInfo.data.forEach((team: any) => {
    teamMap.set(team.triCode, team.fullName);
  });

  const standingsRes = await fetch(
    'https://api-web.nhle.com/v1/standings/now'
  );
  const standings = await standingsRes.json();
  const teamStandings = standings.standings.filter((team: any) => team.teamAbbrev.default === "CAR")[0];

  const scheduleRes = await fetch(
    'https://api-web.nhle.com/v1/club-schedule-season/CAR/20232024'
  );
  const schedule = await scheduleRes.json();

  const today = new Date().toISOString().slice(0, 10);

  const filteredSchedule = schedule.games.filter(
    (game: any) => game.gameDate >= today
  ).slice(0, 5);

  const mostRecentGameDate = schedule.games.filter(
    (game: any) => game.gameDate < today
  ).slice(-1)[0].gameDate;

  const mostRecentGamesRes = await fetch(
    `https://api-web.nhle.com/v1/score/${mostRecentGameDate}`
  );

  const mostRecentGames = await mostRecentGamesRes.json();
  const mostRecentGame = mostRecentGames.games.filter((game: any) => game.homeTeam.abbrev === "CAR" || game.awayTeam.abbrev === "CAR")[0];

  const standingsProps: StandingsProps = {
    standings: {
      divisionRank: teamStandings.divisionSequence,
      leagueRank: teamStandings.leagueSequence,
      leagueRecord: {
        wins: teamStandings.wins,
        losses: teamStandings.losses,
        ot: teamStandings.otLosses,
      },
    },
  };

  const scheduleProps: ScheduleProps = {
    schedule: {
      games: filteredSchedule.map((game: any) => {
        return {
          gameDate: game.startTimeUTC,
          teams: {
            away: teamMap.get(game.awayTeam.abbrev),
            home: teamMap.get(game.homeTeam.abbrev),
          },
        };
      })
    }
  };

  const mostRecentGameGoals: RecentGamePlay[] = mostRecentGame.goals.map((goal: any, index: number) => {
    return {
      id: index,
      time: goal.timeInPeriod,
      player: goal.name.default,
      team: goal.teamAbbrev,
      period: goal.period,
      periodType: goal.periodDescriptor.periodType,
    }
  });
  const mostRecentGamePeriods: RecentGamePeriod[] = mostRecentGameGoals.reduce((acc: any, cur: any) => {
    if (acc[cur.period - 1]) {
      acc[cur.period - 1].plays.push(cur)
    } else {
      acc[cur.period - 1] = {
        plays: [cur],
        type: cur.periodType,
      }
    }
    return acc
  }, []);

  const mostRecentGameProps: RecentGameProps = {
    recentGame: {
      datetime: mostRecentGame.startTimeUTC,
      teams: {
        away: {
          name: teamMap.get(mostRecentGame.awayTeam.abbrev),
          goals: mostRecentGame.awayTeam.score,
          shots: mostRecentGame.awayTeam.sog,
        },
        home: {
          name: teamMap.get(mostRecentGame.homeTeam.abbrev),
          goals: mostRecentGame.homeTeam.score,
          shots: mostRecentGame.homeTeam.sog,
        },
      },
      periods: mostRecentGamePeriods,
    }
  };


  return {
    props: {
      standings: standingsProps,
      schedule: scheduleProps,
      recentGame: mostRecentGameProps,
    },
    revalidate: 3600,
  };
});

export default Home;
