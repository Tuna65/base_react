export enum ETime {
  ONE_MONTH = "ONE_MONTH",
  THREE_MONTH = "THREE_MONTH",
  SIX_MONTH = "SIX_MONTH",
  ONE_YEAR = "ONE_YEAR",
}

export const renderExpiredDate = (time: ETime) => {
  switch (time) {
    case ETime.ONE_MONTH: {
      const now = new Date();
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    case ETime.ONE_YEAR: {
      const now = new Date();
      const yearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      return yearLater;
    }
    case ETime.SIX_MONTH: {
      const now = new Date();
      return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    }
    case ETime.THREE_MONTH: {
      const now = new Date();
      return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    }
    default:
      return new Date();
  }
};
