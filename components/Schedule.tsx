import Card from './Card';

interface ScheduleDate {
  gameDate: string;
  teams: {
    away: string;
    home: string;
  }
}

interface ScheduleProps {
  schedule: {
    dates: ScheduleDate[]
  }
}

const Schedule = ({ schedule }: ScheduleProps) => {
  return (
    <Card>
      <div className="text-center justify-center">
        <div className="font-bold ext-lg">Next 5 Games</div>
        <ul>
          {schedule.dates.map((date: any) => {
            const gameDate = Intl.DateTimeFormat(undefined, {
              timeStyle: 'short',
              dateStyle: 'short',
            }).format(Date.parse(date.gameDate));
            return (
              <li key={date.gameDate}>
                {gameDate} - {date.teams.away} @{' '}
                {date.teams.home}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default Schedule;
export type { ScheduleProps, ScheduleDate };
