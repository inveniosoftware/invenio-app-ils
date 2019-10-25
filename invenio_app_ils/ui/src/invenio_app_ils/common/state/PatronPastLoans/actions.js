import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '../../config';
import { loan as loanApi } from '../../api';
import { sendErrorNotification } from '../../components/Notifications';

const selectQuery = (patronPid, page = 1) => {
  return loanApi
    .query()
    .withPatronPid(patronPid)
    .withState(invenioConfig.circulation.loanCompletedStates)
    .withPage(page)
    .sortByNewest()
    .qs();
};

export const fetchPatronPastLoans = (patronPid, page) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(selectQuery(patronPid, page))
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };

};
