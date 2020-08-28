import React from 'react';
import ReactDOM from 'react-dom';
import tableStore from '../../stores/tableStore';
import { observer } from 'mobx-react';
import {basename} from '../../../config'

@observer
class ResultPanel extends React.Component {
  /**
    * 隐藏比赛结果
    */
  hideResult = () => {
    ReactDOM.unmountComponentAtNode(document.querySelector('#result'));
    tableStore.nextGame()
  }
  render() {
    const height = tableStore.height;
    const result = tableStore.result;
    return (
      <div className='resultmask'>
        <div className='result'>
          <img src={`${basename}cards/medal.svg`} width="20%" />
          <div style={{ lineHeight: height * 0.12 + 'px', }}>{result}</div>
          <button onClick={this.hideResult}>下一副</button>
        </div>
      </div>
    );
  }
}

export default ResultPanel;