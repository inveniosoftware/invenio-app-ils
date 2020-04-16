import { connect } from 'react-redux';
import DocumentCirculationComponent from './DocumentCirculation';
import { showTab } from '../state/actions';

const mapStateToProps = state => ({
  loanRequestIsLoading: state.loanRequestForm.isLoading,
});

const mapDispatchToProps = dispatch => ({
  showTab: activeIndex => dispatch(showTab(activeIndex)),
});

export const DocumentCirculation = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentCirculationComponent);
