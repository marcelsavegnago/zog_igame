import React from 'react';
import './UserTag.css'
import Position from '../../common/Position';

/**
 *  根据用户数据 user 和 我的 位置数据 对位置安排进行旋转。
 */
const UserTags = ({ user, myseat, hcp=null }) => {
    const myPos = new Position('S');
    const lsto = myPos.lsto(myseat);
    const userN = user[new Position('N').lshift(lsto).sn];
    const userE = user[new Position('E').lshift(lsto).sn];
    const userS = user[new Position('S').lshift(lsto).sn];
    const userW = user[new Position('W').lshift(lsto).sn];

    const showhcp = hcp ? <div>高花点：{hcp}</div>: null;

    return (
        <React.Fragment>
            <div className='userTag'><div className='seat'>
                <UserTag position='E' user={userE} />
            </div></div>
            <div className='userTag'><div className='seat'>
                <div className='hcp'>{showhcp}</div>
                <UserTag position='S' user={userS} />
            </div></div>
            <div className='userTag'><div className='seat'>
                <UserTag position='W' user={userW} />
            </div></div>
            <div className='userTag'><div className='seat'>
                <UserTag position='N' user={userN} />
            </div></div>
        </React.Fragment>
    );
}


class UserTag extends React.Component {
    render() {
        const user = this.props.user;
        // const tableStore = this.props.tableStore;
        const position = this.props.position;
        let seName = '';
        if (position == 'N') seName = '同伴';
        else if (position == 'S') seName = '我';
        else seName = '对手';
        const login = <div>
            <div className='uname'>
                <b>{user.seat}</b>:{user.name}<sub>（{seName}）</sub></div>
            <div className='urank'>等级：{user.rank}</div>
        </div>
        const noLogin = <div><div className='uname'>未登录</div></div>

        return (
            <div className='UserTag'>
                <div className='face'>
                    <div className={position + 'clock' + ' clock'}></div>
                    <img src={user.face} />
                </div>
                {user.name ? login : noLogin}
            </div>
        );
    }
}

export default UserTags;