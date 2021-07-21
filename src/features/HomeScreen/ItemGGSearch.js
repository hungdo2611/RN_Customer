import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { View, Text } from 'react-native';
import { withTheme, Text, Icon } from 'react-native-elements';
import { View, TouchableOpacity } from 'react-native';
import Placeholder from 'rn-placeholder';
import Assets from './Asset';

class ItemGGSearch extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      });
    }, 500);
  }

  render() {
    const { Name, des, onPress } = this.props;
    const { isReady } = this.state;

    return (
      <View style={{ justifyContent: 'center' }}>
        <Placeholder.ImageContent
          position="right"
          size={40}
          animate="fade"
          color={Assets.colors.secondary}
          firstLineWidth="70%"
          width="80%"
          lastLineWidth="30%"
          textSize={10}
          lineNumber={5}
          lineSpacing={10}
          onReady={isReady}
        >
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
            <Icon
              type="material"
              name="location-on"
              size={20}
              color="white"
              containerStyle={{
                marginLeft: 5,
                backgroundColor: Assets.colors.orange,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
              }}
            />
            <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
              <Text>{Name}</Text>
              <Text>{des}</Text>
            </View>
          </TouchableOpacity>
        </Placeholder.ImageContent>
      </View>
    );
  }
}

export default ItemGGSearch;
