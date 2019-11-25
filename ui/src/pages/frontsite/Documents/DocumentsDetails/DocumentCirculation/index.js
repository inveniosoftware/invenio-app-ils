import { connect } from 'react-redux';
import DocumentCirculationComponent from './DocumentCirculation';
import { showTab } from '../state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetailsFront.data,
  isLoading: state.documentDetailsFront.isLoading,
});

const mapDispatchToProps = dispatch => ({
  showTab: activeIndex => dispatch(showTab(activeIndex)),
});

export const DocumentCirculation = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentCirculationComponent);
