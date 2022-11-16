const ordinal = (input: number): string => {
  const ordinalRules = new Intl.PluralRules('en', {
    type: 'ordinal',
  });
  const suffixes = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
    zero: 'th',
    many: 'th',
  };
  const suffix = suffixes[ordinalRules.select(input)];
  return input + suffix;
};

function Standings({ standings }: any) {
  const lr = standings.leagueRecord;
  return (
    <div>
      <h3 className="text-2xl text-center font-bold tracking-tight text-gray-900">
        {lr.wins} - {lr.losses} - {lr.ot}
      </h3>
      <dl className="grid grid-cols-2">
        <dt className="text-center">
          <h3 className="text-2xl text-gray-900 font-bold">
            {ordinal(standings.divisionRank)}
          </h3>
          <p>in the Metro</p>
        </dt>
        <dt className="text-center">
          <h3 className="text-2xl text-gray-900 font-bold">
            {ordinal(standings.leagueRank)}
          </h3>
          <p>in the NHL</p>
        </dt>
      </dl>
    </div>
  );
}

export default Standings;
