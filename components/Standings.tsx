import Card from './Card';
import { ordinal } from '../libs/util';


function Standings({ standings }: any) {
  const lr = standings.leagueRecord;
  return (
    <Card>
      <div className="flex flex-col justify-center h-full">
        <div>
          <h3 className="text-2xl text-center font-bold tracking-tight">
            {lr.wins} - {lr.losses} - {lr.ot}
          </h3>
          <dl className="grid grid-cols-2">
            <dt className="text-center">
              <h3 className="text-2xl font-bold">
                {ordinal(standings.divisionRank)}
              </h3>
              <p>in the Metro</p>
            </dt>
            <dt className="text-center">
              <h3 className="text-2xl font-bold">
                {ordinal(standings.leagueRank)}
              </h3>
              <p>in the NHL</p>
            </dt>
          </dl>
        </div>
      </div>
    </Card>
  );
}

export default Standings;
