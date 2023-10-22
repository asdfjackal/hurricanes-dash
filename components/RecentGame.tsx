import Card from './Card';
import { ordinal } from '../libs/util';
import React from 'react';

interface RecentGamePlay {
  id: number
  time: string
  player: string
  team: string
  period: number
}

interface RecentGameProps {
  recentGame: {
    datetime: string
    teams: {
      away: {
        name: string
        goals: number
        shots: number
      }
      home: {
        name: string
        goals: number
        shots: number
      }
    }
    periods: (RecentGamePlay[] | undefined)[]
  }
}

const RecentGame = ({ recentGame }: RecentGameProps) => {
  const { teams, periods } = recentGame;
  const gameDate = Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
    dateStyle: 'short',
  }).format(Date.parse(recentGame.datetime));

  return (
    <Card>
      <div className="text-center justify-center">
        <div className="font-bold ext-lg">Most Recent Game</div>
        <p>
          {gameDate} - {teams.away.name} @{' '}
          {teams.home.name}
        </p>
        <h3 className="text-2xl text-center font-bold tracking-tight">
          {teams.away.goals} - {teams.home.goals}
        </h3>
        <p>
          ({teams.away.shots} - {teams.home.shots})
        </p>
        {periods.map((period: any, index: number) => (
          <React.Fragment key={index}>
            <p className="font-bold">{ordinal(index + 1)} Period</p>
            <ul>
              {period.map((play: any) => (
                <li key={play.id}>
                  {play.time} - {play.player} ({play.team})
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default RecentGame;
export type { RecentGameProps, RecentGamePlay };
