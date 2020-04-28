import { loan as loanApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';
import { invenioConfig } from '@config';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

const selectQuery = (patronPid, page) => {
  return loanApi
    .query()
    .withPatronPid(patronPid)
    .withState(invenioConfig.circulation.loanCompletedStates)
    .withPage(page)
    .sortByNewest()
    .qs();
};

export const fetchPatronPastLoans = (patronPid, { page = 1 } = {}) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await loanApi.list(selectQuery(patronPid, page));

      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
