import Card from './Card';
import { ordinal } from '../libs/util';
import React from 'react';

interface RecentGamePlay {
  id: number
  time: string
  player: string
  team: string
  period: number
  periodType: string
}

interface RecentGamePeriod {
  plays: RecentGamePlay[] | null
  type: String
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
    periods: RecentGamePeriod[]
  }
}

const renderPeriodHeader = (period: RecentGamePeriod, index: number): string => {
  switch (period.type) {
    case 'SHOOTOUT': return "Shootout";
    case 'OVERTIME': return `${index - 2}OT`;
    default: return `${ordinal(index + 1)} Period`
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
        <>
          {periods.map((period: any, index: number) => {
            return period === null ? null : (
              <React.Fragment key={index}>
                <p className="font-bold">{renderPeriodHeader(period, index)}</p>
                <ul>
                  {period.plays.map((play: any) => (
                    <li key={play.id}>
                      {play.time} - {play.player} ({play.team})
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )
          }
          )}
        </>
      </div>
    </Card>
  );
};

export default RecentGame;
export type { RecentGameProps, RecentGamePlay, RecentGamePeriod };
