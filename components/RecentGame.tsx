import Card from './Card';
import { ordinal } from '../libs/util';

const RecentGame = ({ recentGame }: any) => {
  const { datetime, teams } = recentGame.gameData;
  const { boxscore, plays } = recentGame.liveData;
  const gameDate = Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
    dateStyle: 'short',
  }).format(Date.parse(datetime.dateTime));

  const goals = plays.scoringPlays.map((play: any) => {
    return plays.allPlays[play]
  });

  const periods = goals.reduce((acc: any, cur: any) => {
    if (acc[cur.about.period - 1]) {
      acc[cur.about.period - 1].push(cur)
    } else {
      acc[cur.about.period - 1] = [cur]
    }
    return acc
  }, []);

  console.log(periods)

  return (
    <Card>
      <div className="text-center justify-center">
        <div className="font-bold ext-lg">Most Recent Game</div>
        <p>
          {gameDate} - {teams.away.name} @{' '}
          {teams.home.name}
        </p>
        <h3 className="text-2xl text-center font-bold tracking-tight">
          {boxscore.teams.away.teamStats.teamSkaterStats.goals} - {boxscore.teams.home.teamStats.teamSkaterStats.goals}
        </h3>
        <p>
          ({boxscore.teams.away.teamStats.teamSkaterStats.shots} - {boxscore.teams.home.teamStats.teamSkaterStats.shots})
        </p>
        {periods.map((period: any, index: number) => (
          <>
            <p className="font-bold">{ordinal(index + 1)} Period</p>
            <ul>
              {period.map((play: any) => (
                <li key={play.about.eventidx}>
                  {play.about.periodTime} - {play.players[0].player.fullName} ({play.team.triCode})
                </li>
              ))}
            </ul>
          </>
        ))}
      </div>
    </Card>
  );
};

export default RecentGame;
