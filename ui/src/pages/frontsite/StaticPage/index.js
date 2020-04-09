import { connect } from 'react-redux';
import { fetchStaticPageDetails } from './state/actions';
import StaticPageComponent from './StaticPage';

const mapDispatchToProps = dispatch => ({
  fetchStaticPageDetails: pageID => dispatch(fetchStaticPageDetails(pageID)),
});

const mapStateToProps = state => ({
  isLoading: state.staticPage.isLoading,
  data: state.staticPage.data,
  hasError: state.staticPage.hasError,
});

export const StaticPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticPageComponent);
