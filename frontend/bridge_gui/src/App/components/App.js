//import Header from './Header'; 可以进一步 设计一个应用的框架。然后其他的都放入
// 找一个现成的组件解决。比如 pannel
// 但还要考虑 手机界面 路由的问题。不能所有的组件都包进去。应该先判断手机界面
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
//import PrivateRoute from './PrivateRoute'; 

// 子组件列表
import Test from './Test';

@inject('testStore', 'commonStore')
@withRouter
@observer
export default class App extends React.Component {
  componentWillMount() {
    console.log('...componentWillMount');
  }

  componentDidMount() {
    console.log('...componentDidMount');
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route path="/" render={() => <h1>Home</h1>} />
          <Route path="/test" component={Test} />
        </Switch>
      </div>
    );
  }
}