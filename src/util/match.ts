export const MatchAny: boolean = true;

export const Match = (value_to_match: any, ...args: any): any => {
  for (const [value, action] of args) {
    if (value === value_to_match || value === MatchAny) {
      return typeof action === "function" ? action() : action;
    }
  }
};
