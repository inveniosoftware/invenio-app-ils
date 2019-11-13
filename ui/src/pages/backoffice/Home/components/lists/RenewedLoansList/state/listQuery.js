import { loan as loanApi } from '../../../../../../../common/api';
import { toShortDate } from '../../../../../../../common/api/date';
import { DateTime } from 'luxon';

export const listQuery = loanApi
  .query()
  .withUpdated({
    from: toShortDate(DateTime.local().minus({ days: 7 })),
  })
  .withRenewedCount('>=3')
  .qs();
