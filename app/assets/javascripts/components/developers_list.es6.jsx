/* global document window $ */

import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'underscore';
import RaisedButton from 'material-ui/RaisedButton';
import queryString from 'query-string';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import { List } from 'material-ui/List';
import Developer from './developer.es6';
import Pagination from './pagination.es6';
import Search from './search.es6';
import EmptyList from './empty_list.es6';
import LoadingList from './loading_list.es6';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ActionCable from 'actioncable';
const cable = ActionCable.createConsumer();

// Card for signup
import FlatButton from 'material-ui/FlatButton';
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardText
} from 'material-ui/Card';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#6986BD',
    accent1Color: '#6986BD',
  },
});

class DevelopersList extends Component {
  constructor(props) {
    super(props);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
    this.queryObject = _.omit(queryString.parse(document.location.search), 'action');
    this.channel = cable.subscriptions.create('CacheChannel');
    this.channel.perform('set', queryString.parse(document.location.search));
    this.state = { open: false, loaded: false };
  }

  componentDidMount() {
    this.props.relay.setVariables(this.queryObject, (readyState) => {
      if (readyState.done) {
        this.setState({ loaded: true }, () => {
        const { pageInfo } = this.props.root.developers;
        if (pageInfo != null && pageInfo.hasNextPage) {
            this.channel.perform(
              'set',
              Object.assign(
                queryString.parse(document.location.search),
                { page: parseInt(this.props.relay.variables.page, 0) + 1 },
              )
            );
          }
          });
        }
    });
  }

  loadNext(event) {
    event.preventDefault();
    const newPage = _.pick(Object.assign(
      this.queryObject,
      { page: parseInt(this.props.relay.variables.page, 0) + 1 },
    ), _.identity);
    Turbolinks.visit(`/developers?${queryString.stringify(newPage)}`);
  }

  loadPrevious(event) {
    event.preventDefault();
    const previousPage = parseInt(this.props.relay.variables.page, 0) - 1;
    const newPage = _.pick(Object.assign(
      this.queryObject,
      { page: previousPage === 1 ? null : previousPage },
    ), _.identity);
    Turbolinks.visit(`/developers?${queryString.stringify(newPage)}`);
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const containerStyle = {
      paddingTop: '0px',
      paddingBottom: '0px',
      borderRight: '1px solid #f2f2f2',
      boxShadow: '0 0 16px 0 rgba(63,67,69,0.3)',
      margin: '40px 0px',
    };

    const { root, relay } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="developers-list wrapper">
          <div className="container">
            <div className="developers-list developers--small sm-pull-reset col-md-5">
              <Card style={{ marginBottom: '20px'}}>
                <CardTitle
                  title="Developer"
                  subtitle="Signup to setup a premium profile"
                  titleColor='rgba(0, 0, 0, 0.54118)'
                />

                <CardText style={{ padding: '8px 16px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </CardText>

                <CardActions style={{ padding: '8px 16px' }}>
                  <RaisedButton label="Signup" primary />
                </CardActions>
              </Card>

              <Card style={{ marginBottom: '20px'}}>
                <CardTitle
                  titleColor='rgba(0, 0, 0, 0.54118)'
                  title="Recruiter"
                  subtitle="Signup to search premium developers"
                />

                <CardText style={{ padding: '8px 16px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </CardText>

                <CardActions style={{ padding: '8px 16px' }}>
                  <RaisedButton label="Signup" primary />
                </CardActions>
              </Card>
              <Search action={'/developers'} relay={relay} />
            </div>
            {this.state.loaded ?
              (root.developers.edges && root.developers.edges.length > 0 ?
                <List className="col-md-7 pull-right" style={containerStyle}>
                  {root.developers.edges.map(({ node }) => (
                    <Developer
                      developer={node}
                      key={node.id}
                    />
                  ))}

                {root.developers.pageInfo != null &&
                  (root.developers.pageInfo.hasNextPage ||
                    this.queryObject.page >= 2
                  ) ?
                  <Pagination
                    loadNext={this.loadNext}
                    queryObject={this.queryObject}
                    pageInfo={root.developers.pageInfo}
                    loadPrevious={this.loadPrevious}
                  /> : ''
                }
                </List> : <EmptyList />) : <LoadingList />
              }
            <Snackbar
              open={this.state.open}
              ref="snackbar_404"
              message="Ohh no! Request failed! Make sure you are using right parameters"
              action="error"
              onRequestClose={this.handleRequestClose}
              autoHideDuration={5000}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

DevelopersList.propTypes = {
  root: React.PropTypes.object,
  relay: React.PropTypes.object,
};

const DevelopersListContainer = Relay.createContainer(DevelopersList, {
  initialVariables: {
    first: 20,
    fullname: null,
    location: null,
    language: null,
    hireable: null,
    order: '-id',
    page: '1',
  },

  fragments: {
    root: () => Relay.QL`
      fragment on Viewer {
        id,
        developers(
          first: $first,
          fullname: $fullname,
          location: $location,
          language: $language,
          hireable: $hireable,
          order: $order,
          page: $page,
        ) {
          edges {
            node {
              id,
              premium,
              ${Developer.getFragment('developer')}
            }
          }

          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `,
  },
});

export default DevelopersListContainer;
