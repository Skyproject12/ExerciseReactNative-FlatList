/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
} from 'native-base';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fullData: [],
      loading: false,
      error: null,
      query: '',
    };
  }

  _renderItem = ({item, index}) => {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{uri: item.thumbnailUrl}} />
        </Left>
        <Body>
          <Text>{item.title}</Text>
        </Body>
      </ListItem>
    );
  };

  componentDidMount() {
    this.requestApiPhoto();
  }

  requestApiPhoto = _.debounce(() => {
    this.setState({loading: true});
    const ApiUrl = 'https://jsonplaceholder.typicode.com/photos?_limit=30';
    fetch(ApiUrl)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          loading: false,
          data: resJson,
          fullData: resJson,
        });
      })
      .catch((error) => {
        this.setState({error, loading: false});
      });
  }, 250);

  renderFooter = () => {
    if (!this.state.loading) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animation size="large" />
      </View>
    );
  };

  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, (photo) => {
      if (photo.title.includes(formattedQuery)) {
        return true;
      }
      return false;
    });
    this.setState({data, query: text});
  };

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" onChangeText={this.handleSearch} />
          </Item>
        </Header>
        <List>
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
          />
        </List>
      </Container>
    );
  }
}

export default App;
