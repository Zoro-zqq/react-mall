import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {safeAuth} from '../../../assets/js/utils/util.js';
import {Picker,Toast} from 'antd-mobile';
import {province} from '../../../assets/data/province.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/address/add.css';
class  AddressAdd extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            defaultProvince:"",
            sProvince:"",
            sCity:"",
            sArea:"",
            sName:"",
            sCellphone:'',
            sAddress:'',
            bChecked:false
        }
        this.bSubmit=true;
    }
    componentDidMount(){

    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    pushPage(url){
        this.props.history.push(config.path+url)
    }
    //提交数据到后台
    submitData() {
        if (this.state.sName.match(/^\s*$/)) {
            Toast.info("请输入收货人姓名", 2);
            return false;
        }
        if (this.state.sCellphone.match(/^\s*$/)) {
            Toast.info("请输入联系人手机号", 2);
            return false;
        }
        if (!this.state.sCellphone.match(/^1[0-9][0-9]{9}/)) {
            Toast.info("您输入的手机号格式不正确", 2);
            return false;
        }
        if (this.state.defaultProvince.match(/^\s*$/)) {
            Toast.info("请选择所在地区", 2);
            return false;
        }
        if (this.state.sAddress.match(/^\s*$/)) {
            Toast.info("请输入详细地址", 2);
            return false;
        }
        let url = config.baseUrl + "/api/user/address/add?token="+config.token;
        let data={
            uid:this.props.state.user.uid,
            name:this.state.sName,
            cellphone:this.state.sCellphone,
            province:this.state.sProvince,
            city:this.state.sCity,
            area:this.state.sArea,
            address:this.state.sAddress,
            isdefault:this.state.bChecked?"1":"0"
        };
        if (this.bSubmit){
            this.bSubmit=false;
            request(url, "post",data).then((res)=>{
                if (res.code===200){
                    if (this.state.bChecked){
                        localStorage['addressId']=res.data.aid;
                        sessionStorage.removeItem("addressId");
                    }
                    Toast.info("添加成功",2,()=>{
                        this.props.history.goBack();
                    });
                }else{
                    Toast.info(res.data, 2);
                }
            });
        }
    }

    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="添加收货地址"></SubHeaderComponent>
                <div className={Css['main']}>
                    <ul>
                        <li>收货人</li>
                        <li><input type="text" placeholder="收货人姓名" onChange={(e)=>{
                            this.setState({sName:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>联系方式</li>
                        <li><input type="text" placeholder="联系人手机号" onChange={(e)=>{
                            this.setState({sCellphone:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>所在地区</li>
                        <Picker data={province} title="选择地区" onOk={e =>{
                            this.setState({defaultProvince:e.join(" "),sProvince:e[0],sCity:e[1],sArea:e[2]!==undefined?e[2]:''});
                        }}
                        >
                        <li>
                            <input type="text" placeholder="请选择收货地址" className={Css['area']} readOnly value={this.state.defaultProvince} />
                        </li>
                        </Picker>
                    </ul>
                    <ul>
                        <li>详细地址</li>
                        <li><input type="text" placeholder="街道详细地址" onChange={(e)=>{
                            this.setState({sAddress:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>设置为默认地址</li>
                        <li><input type="checkbox" checked={this.state.bChecked} onChange={(e)=>{
                            this.setState({bChecked:!this.state.bChecked})
                        }} /></li>
                    </ul>
                    <button type="button" className={Css['submit-save']} onClick={this.submitData.bind(this)}>保存</button>
                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(AddressAdd)