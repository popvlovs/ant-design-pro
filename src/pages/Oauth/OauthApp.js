import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Avatar, Tooltip, Dropdown, Form, Modal, Input, message, Transfer } from 'antd';
import uuid from 'uuid';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import { thisTypeAnnotation } from '@babel/types';

import styles from './OauthApp.less';

const FormItem = Form.Item;

/**
 * 应用配置表单
 */
@Form.create()
class ApplicationForm extends PureComponent {
  constructor(props) {
    super(props)

    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
  }
  state = {};

  okHandle = () => {
    const { form, handleAppAdd, handleAppEdit, handleModalVisible, editMode, values } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleModalVisible(false, 'View', {})
      if (editMode == 'Add') {
        handleAppAdd(fieldsValue);
      } else if (editMode == 'Edit') {
        handleAppEdit(fieldsValue)
      }
    });
  }

  randomUUID = () => {
    return uuid.v4()
  }

  handleRollClientId = () => {
    const { form } = this.props
    form.setFieldsValue({
      clientId: this.randomUUID()
    })
  }

  handleRollClientSecret = () => {
    const { form } = this.props
    form.setFieldsValue({
      clientSecret: this.randomUUID()
    })
  }

  render() {
    const { values, modalVisible, form, handleModalVisible, editMode } = this.props
    values.clientId = values.clientId || this.randomUUID()
    values.clientSecret = values.clientSecret || this.randomUUID()
    return (
      <Modal
        destroyOnClose
        title="应用配置"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, 'View', {})}
        width={600}
      >
        <Form {...this.formItemLayout}>
          <FormItem label="应用名称">
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入应用名称！'
                },
              ],
              initialValue: values.name,
            })(
              <Input
                prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入应用名称"
                allowClear={true}
                disabled={editMode == 'View'}
              />
            )}
          </FormItem>
          <FormItem label={(<span>ID&nbsp;<Tooltip title="Client ID是应用的标识，需要和Client Secret配套使用，建议使用自动生成的32位UUID"><Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.75)' }} /></Tooltip></span>)}>
            {form.getFieldDecorator('clientId', {
              rules: [
                {
                  required: true,
                  message: '请输入应用ID！'
                },
              ],
              initialValue: values.clientId,
            })(
              <Input
                placeholder="请输入应用标识"
                disabled={editMode == 'View' || editMode == 'Edit'}
                addonAfter={editMode == 'Add' ? <Tooltip title="点击重新生成"><Icon type="sync" style={{ color: 'rgba(0,0,0,.75)', cursor: 'pointer' }} onClick={this.handleRollClientId} /></Tooltip> : null}
              />
            )}
          </FormItem>
          <FormItem label={(<span>密钥&nbsp;<Tooltip title="Client Secret是应用的密钥，需要和Client ID配套使用，建议使用自动生成的32位UUID"><Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.75)' }} /></Tooltip></span>)}>
            {form.getFieldDecorator('clientSecret', {
              rules: [
                {
                  required: true,
                  message: '请输入应用密钥！'
                },
              ],
              initialValue: values.clientSecret,
            })(
              <Input
                placeholder="请输入应用密钥"
                disabled={editMode == 'View'}
                addonAfter={<Tooltip title="点击重新生成"><Icon type="sync" style={{ color: 'rgba(0,0,0,.75)', cursor: 'pointer' }} onClick={this.handleRollClientSecret} /></Tooltip>}
              />
            )}
          </FormItem>
          <FormItem label="首页 URL">
            {form.getFieldDecorator('homepageUrl', {
              rules: [
                {
                  required: true,
                  message: '请输入应用首页Url！',
                  pattern: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/i,
                },
              ],
              initialValue: values.homepageUrl,
            })(
              <Input
                placeholder="请输入应用首页"
                allowClear={true}
                disabled={editMode == 'View'}
              />
            )}
          </FormItem>
          <FormItem label={(<span>Redirect URI&nbsp;<Tooltip title="Redirect URI被用于对客户端请求进行校验，从而防止恶意冒充；多条记录以逗号分隔"><Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.75)' }} /></Tooltip></span>)}>
            {form.getFieldDecorator('webServerRedirectUriStr', {
              rules: [
                {
                  required: true,
                  message: '请输入RedirectUrl！',
                },
              ],
              initialValue: values.webServerRedirectUriStr,
            })(
              <Input
                placeholder="请输入应用首页"
                allowClear={true}
                disabled={editMode == 'View'}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

/**
 * 授权用户列表
 */
@connect(({ oauthUsers, loading }) => ({
  oauthUsers,
  loading: loading.models.oauthUsers,
}))
class ApplicationUserTransfer extends PureComponent {

  constructor(props) {
    super(props);
  }

  state = {
    targetKeys: null
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'oauthUsers/fetchAll',
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ targetKeys: props.selectedKeys });
  }

  okHandle = () => {
    const { dispatch, clientId, handleUserAppModalVisible } = this.props
    const { targetKeys } = this.state

    if (targetKeys == null) {
      handleUserAppModalVisible(false)
      return
    }

    const onUpdateBinUserSuccess = () => {
      message.success('编辑授权用户成功');
      dispatch({
        type: 'oauthApps/fetch',
        payload: {},
      });
      handleUserAppModalVisible(false)
    };

    dispatch({
      type: 'oauthApps/updateBindUsers',
      payload: { clientId, users: targetKeys },
      callback: onUpdateBinUserSuccess,
    });
  }

  handleChange = (targetKeys) => {
    this.setState({ targetKeys })
  }

  render() {
    const { modalVisible, oauthUsers, handleUserAppModalVisible, selectedKeys } = this.props
    const { targetKeys } = this.state
    const dataSource = oauthUsers.listAll ? oauthUsers.listAll.map(user => {
      return {
        key: user.id,
        title: user.username,
      }
    }) : []

    return (
      <Modal
        destroyOnClose
        title="授权用户配置"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUserAppModalVisible(false)}
        width={700}
      >
        <Transfer
          dataSource={dataSource}
          listStyle={{
            width: 300,
            height: 300,
          }}
          targetKeys={targetKeys || selectedKeys}
          onChange={this.handleChange}
          render={item => `${item.title}`}
          showSearch
        />
      </Modal>
    )
  }
}

@connect(({ oauthApps, loading }) => ({
  oauthApps,
  loading: loading.models.oauthApps,
}))
@Form.create()
class OauthApp extends PureComponent {

  state = {
    modalVisible: false,
    modelEditMode: 'View',
    modalFormValues: {},
    deleteConfirmVisible: false,
    userAppModalVisible: false,
    userAppSelectedKeys: [],
    userAppClientId: ''
  }

  onSetAuthorizedUsers({ clientId }) {
    const { oauthApps } = this.props
    if (!!oauthApps.data) {
      const clientInfo = oauthApps.data.find(item => item.clientId == clientId)
      const selectedUsers = clientInfo.users.map(user => user.id)
      this.setState({
        userAppModalVisible: true,
        userAppSelectedKeys: selectedUsers,
        userAppClientId: clientId
      });
    }
  }

  handleAppAdd = fields => {
    const { dispatch, values } = this.props;

    const onAddSuccess = () => {
      message.success('新增应用成功');
      dispatch({
        type: 'oauthApps/fetch',
        payload: {},
      });
    };
    const additionalInfo = { name: fields.name, homepageUrl: fields.homepageUrl }
    fields['additionalInformationStr'] = JSON.stringify(additionalInfo)
    const formValues = { ...values, ...fields }
    dispatch({
      type: 'oauthApps/add',
      payload: formValues,
      callback: onAddSuccess,
    });
  }

  handleAppEdit = fields => {
    const { values, dispatch } = this.props;

    const onUpdateSuccess = () => {
      message.success('编辑应用成功');
      dispatch({
        type: 'oauthApps/fetch',
        payload: {},
      });
    };
    const additionalInfo = { name: fields.name, homepageUrl: fields.homepageUrl }
    fields['additionalInformationStr'] = JSON.stringify(additionalInfo)
    const formValues = { ...values, ...fields }
    dispatch({
      type: 'oauthApps/update',
      payload: fields,
      callback: onUpdateSuccess,
    });
  }

  handleAppDelete = () => {
    const { dispatch } = this.props;
    const { deleteItem } = this.state

    const onDeleteSuccess = () => {
      message.success('删除应用成功');
      this.setState({
        deleteConfirmVisible: false,
      });
      dispatch({
        type: 'oauthApps/fetch',
        payload: {},
      });
    };
    dispatch({
      type: 'oauthApps/delete',
      payload: [deleteItem.clientId],
      callback: onDeleteSuccess,
    });
  }

  onAppEdit({ clientId }) {
    const { oauthApps } = this.props
    if (!!oauthApps.data) {
      const clientInfo = oauthApps.data.find(item => item.clientId == clientId)
      const flatValues = { ...clientInfo, ...clientInfo.additionalInformation }
      this.handleModalVisible(true, 'Edit', flatValues)
    }
  }

  onAppAdd() {
    this.handleModalVisible(true, 'Add', {})
  }

  handleModalVisible = (flag, editMode, values) => {
    this.setState({
      modalVisible: !!flag,
      modelEditMode: editMode,
      modalFormValues: values
    });
  }

  handleUserAppModalVisible = (flag) => {
    this.setState({
      userAppModalVisible: !!flag,
    })
  }

  render() {
    const { oauthApps, loading } = this.props
    const { modalVisible, modelEditMode, modalFormValues, userAppModalVisible, userAppSelectedKeys, userAppClientId, deleteConfirmVisible, deleteItem, } = this.state

    const CardInfo = ({ item }) => (
      <div className={styles.cardInfo}>
        <div>
          <span>授权用户</span>
          <span onClick={() => this.onSetAuthorizedUsers(item)}>{item.userCount || 0}</span>
        </div>
      </div>
    );

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleAppAdd: this.handleAppAdd,
      handleAppEdit: this.handleAppEdit,
    }

    return (<PageHeaderWrapper title="注册应用列表">
      <div className={styles.oauthApp}>
        <List
          rowKey="id"
          loading={loading}
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          dataSource={['', ...oauthApps.data]}
          renderItem={item =>
            item ? (
              <List.Item key={item.clientId}>
                <Card
                  hoverable
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip title="用户授权">
                      <Icon type="usergroup-add" onClick={() => this.onSetAuthorizedUsers(item)} />
                    </Tooltip>,
                    <Tooltip title="设置">
                      <Icon type="setting" onClick={() => this.onAppEdit(item)} />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Icon type="delete" onClick={() => this.setState({ deleteConfirmVisible: true, deleteItem: item })} />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar icon="desktop" size="small" style={{ backgroundColor: '#1890FF' }} />}
                    title={<Tooltip title={item.additionalInformation.name}>{item.additionalInformation.name}</Tooltip>}
                  />
                  <div className={styles.cardItemContent}>
                    <CardInfo
                      item={item}
                    />
                  </div>
                </Card>
              </List.Item>
            ) : (
                <List.Item onClick={() => this.onAppAdd()}>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 创建应用
                  </Button>
                </List.Item>
              )
          }
        />
        <ApplicationUserTransfer handleUserAppModalVisible={this.handleUserAppModalVisible} modalVisible={userAppModalVisible} clientId={userAppClientId} selectedKeys={userAppSelectedKeys} />
        <ApplicationForm {...parentMethods} values={modalFormValues} modalVisible={modalVisible} editMode={modelEditMode} />
        <Modal
          title="请确认"
          visible={deleteConfirmVisible}
          onOk={() => this.handleAppDelete()}
          onCancel={() => this.setState({ deleteConfirmVisible: false })}
        >
          <p>{deleteItem ? `确认删除应用：${deleteItem.additionalInformation.name}？` : "确认删除应用？"}</p>
        </Modal>
      </div>
    </PageHeaderWrapper>)
  }
}

export default OauthApp