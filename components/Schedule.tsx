import Card from './Card';

interface ScheduleGame {
  gameDate: string;
  teams: {
    away: string;
    home: string;
  }
}

interface ScheduleProps {
  schedule: {
    games: ScheduleGame[]
  }
}

const Schedule = ({ schedule }: ScheduleProps) => {
  return (
    <Card>
      <div className="text-center justify-center">
        <div className="font-bold ext-lg">Next 5 Games</div>
        <ul>
          {schedule.games.map((game: any) => {
            const gameDate = Intl.DateTimeFormat(undefined, {
              timeStyle: 'short',
              dateStyle: 'short',
            }).format(Date.parse(game.gameDate));
            return (
              <li key={game.gameDate}>
                {gameDate} - {game.teams.away} @{' '}
                {game.teams.home}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default Schedule;
export type { ScheduleProps, ScheduleGame as ScheduleDate };
