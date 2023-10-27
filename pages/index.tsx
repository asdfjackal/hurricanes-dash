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
  const standingsRes = await fetch(
    'https://statsapi.web.nhl.com/api/v1/standings'
  );
  const standings = await standingsRes.json();

  const scheduleRes = await fetch(
    'https://statsapi.web.nhl.com/api/v1/schedule?teamId=12&season=20232024'
  );
  const schedule = await scheduleRes.json();

  const teamStandings = standings.records
    .filter((division: any) => division.division.id === 18)[0]
    .teamRecords.filter((team: any) => team.team.id === 12)[0];

  const today = new Date().toISOString().slice(0, 10);

  const filteredSchedule = schedule.dates.filter(
    (date: any) => date.date >= today
  ).slice(0, 5);

  const mostRecentGameId = schedule.dates.filter(
    (date: any) => date.date < today
  ).slice(-1)[0].games[0].gamePk;

  const mostRecentGameRes = await fetch(
    `https://statsapi.web.nhl.com/api/v1/game/${mostRecentGameId}/feed/live`
  );

  const mostRecentGame = await mostRecentGameRes.json();

  const standingsProps: StandingsProps = {
    standings: {
      divisionRank: teamStandings.divisionRank,
      leagueRank: teamStandings.leagueRank,
      leagueRecord: {
        wins: teamStandings.leagueRecord.wins,
        losses: teamStandings.leagueRecord.losses,
        ot: teamStandings.leagueRecord.ot,
      },
    },
  };

  const scheduleProps: ScheduleProps = {
    schedule: {
      dates: filteredSchedule.map((date: any) => {
        return {
          gameDate: date.games[0].gameDate,
          teams: {
            away: date.games[0].teams.away.team.name,
            home: date.games[0].teams.home.team.name,
          },
        };
      })
    }
  };

  const mostRecentGameGoals: RecentGamePlay[] = mostRecentGame.liveData.plays.scoringPlays.map((play: any) => {
    const rawPlay = mostRecentGame.liveData.plays.allPlays[play]
    return {
      id: rawPlay.about.eventIdx,
      time: rawPlay.about.periodTime,
      player: rawPlay.players[0].player.fullName,
      team: rawPlay.team.triCode,
      period: rawPlay.about.period,
      periodType: rawPlay.about.periodType,
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
      datetime: mostRecentGame.gameData.datetime.dateTime,
      teams: {
        away: {
          name: mostRecentGame.gameData.teams.away.name,
          goals: mostRecentGame.liveData.boxscore.teams.away.teamStats.teamSkaterStats.goals,
          shots: mostRecentGame.liveData.boxscore.teams.away.teamStats.teamSkaterStats.shots,
        },
        home: {
          name: mostRecentGame.gameData.teams.home.name,
          goals: mostRecentGame.liveData.boxscore.teams.home.teamStats.teamSkaterStats.goals,
          shots: mostRecentGame.liveData.boxscore.teams.home.teamStats.teamSkaterStats.shots,
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
