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

export { ordinal };
