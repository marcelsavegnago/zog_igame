import React from 'react'
import DealUser from './DealUser'
import { Form, Select, Button, Row, Col  } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class FormForSign extends React.Component{
    state={
        userList: new DealUser(),
        hasTeam:false,
        selectDisable:false,
        selectLink:false
    }

    componentDidMount(){
        console.log(this.state.userList.list[0].userInfo)
    }

    onSubmit=(e)=>{
        e.preventDefault();
        this.props.submitSignForm(this.props.form.getFieldsValue());
    }

    handlerTeamSelect=(e)=>{
        this.setState({
            hasTeam:true,
            selectDisable:true
        });
        console.log(this.props.form.getFieldsValue());
       this.props.form.setFieldsValue(
           {leaderId:124}
        );
    }

    render(){
        const {getFieldProps, getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const allUserList = this.state.userList.list[0].userInfo;

        return(
            <Form layout="vertical" onSubmit={this.onSubmit}>
                    <FormItem  style={{marginBottom:0}} >
                        <span>项目：</span>
                        <Select placeholder="选择参赛项目" style={{ width: 120 }} {...getFieldProps('eventName')}>
                            <Option value="团体公开赛">团体公开赛</Option>
                            <Option value="青年赛">青年赛</Option>
                            <Option value="中年赛">中年赛</Option>
                        </Select>
                    </FormItem>
                    <FormItem style={{marginBottom:0}} >
                        <span>赛队：</span>
                        <Select placeholder="选择队伍名称" style={{ width: 120 }} {...getFieldProps('teamName')} onSelect={this.handlerTeamSelect}>
                            {allUserList.teamList.map((item,index) =>
                                <Option key={index} value={item.teamName}>{item.teamName}</Option>
                            )}
                        </Select>
                    </FormItem>
                    <FormItem  style={{marginBottom:0}} >   
                        <Row>
                            <Col span={4}>
                                <span>领队</span>
                            </Col>
                            <Col span={5}>
                                <span>赛事证号</span>
                            </Col>
                            <Col span={5}>
                                <span>{allUserList.teamList[0].leaderName}</span>
                            </Col>
                            <Col span={5}>
                                <span>姓名</span>
                            </Col>
                            <Col span={5}>
                                <span>{allUserList.teamList[0].leaderName}</span>
                            </Col>
                        </Row>                        
                    </FormItem>
                    <FormItem label="教练"  style={{marginBottom:0}} >   
                       
                    </FormItem>
                    <FormItem label="队员"  style={{marginBottom:0}} >   
                       
                    </FormItem>
                    <FormItem style={{marginTop:20, marginBottom:0}} >
                        <p>联系人：{allUserList.name}</p>
                        <p>电话：{allUserList.tel}</p>
                        <p> Email：{allUserList.email}</p>   
                    </FormItem>
                    <FormItem>
                        <Button type="primary" style={{paddingLeft:10, paddingRight:10, marginRight:10}} htmlType="submit">提交</Button>
                        <Button type="danger" style={{paddingLeft:10, paddingRight:10}}>取消</Button>
                    </FormItem>
                </Form>      
        )
    }
}


const SignForm = Form.create()(FormForSign);

export default SignForm;