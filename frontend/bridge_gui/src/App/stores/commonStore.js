import { observable, action, computed } from 'mobx';
import agent from '../agent';


class CommonStore{
  @observable v1 = null;
  @observable v2 = null;

  @action.bound
  setV1(){
    this.v1 = '1111';
  }
  @action.bound
  setV2(){
    this.v1 = '2222';
  }


}

export default new CommonStore();