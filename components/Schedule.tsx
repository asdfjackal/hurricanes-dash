import Card from './Card';

const Schedule = ({ schedule }: any) => {
  return (
    <Card>
      <div className="text-center justify-center">
        <div className="font-bold ext-lg">Next 5 Games</div>
        <ul>
          {schedule.slice(0, 5).map((date: any) => {
            const gameDate = Intl.DateTimeFormat(undefined, {
              timeStyle: 'short',
              dateStyle: 'short',
            }).format(Date.parse(date.games[0].gameDate));
            return (
              <li key={date.date}>
                {gameDate} - {date.games[0].teams.away.team.name} @{' '}
                {date.games[0].teams.home.team.name}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default Schedule;
