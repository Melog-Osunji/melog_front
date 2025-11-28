/**
 * custom header component for pull to refresh
 */

import * as React from 'react';
import {Animated, ViewStyle, TextStyle} from 'react-native';

import PullToRefresh, {
  PullToRefreshHeaderProps,
} from 'react-native-pull-to-refresh-custom';

import Loading from '@/components/common/Loading';

const {Component} = React;

const headerStyle = {
  con: {
    height: 80,
    justifyContent: 'center',
  } as ViewStyle,
  title: {
    fontSize: 22,
  } as TextStyle,
};

interface ClassHeaderState {
  pullDistance: number;
  percent: number;
}

export default class Header extends Component<
  PullToRefreshHeaderProps,
  ClassHeaderState
> {
  constructor(props: PullToRefreshHeaderProps) {
    super(props);
    this.state = {
      pullDistance: props.pullDistance,
      percent: props.percent,
    };
  }

  setProgress({
    pullDistance,
    percent,
  }: {
    pullDistance: number;
    percent: number;
  }) {
    this.setState({
      pullDistance,
      percent,
    });
  }

  componentWillReceiveProps(nextProps: Readonly<PullToRefreshHeaderProps>) {
    this.setState({
      pullDistance: nextProps.pullDistance,
      percent: nextProps.percent,
    });
  }

  render() {
    const {percentAnimatedValue} = this.props;

    return (
      <Animated.View style={[headerStyle.con, {opacity: percentAnimatedValue}]}>
        <Loading size={24} />
      </Animated.View>
    );
  }
}
