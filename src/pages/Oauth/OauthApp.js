import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Avatar, Tooltip, Dropdown } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import { thisTypeAnnotation } from '@babel/types';

import styles from './OauthApp.less';

@connect(({ oauthApps, loading }) => ({
  oauthApps,
  loading: loading.models.oauthApps,
}))
class OauthApp extends PureComponent {
  render() {
    const { oauthApps, loading } = this.props

    const CardInfo = ({ activeUser, newUser }) => (
      <div className={styles.cardInfo}>
        <div>
          <span>授权用户</span>
          <span>{0}</span>
        </div>
      </div>
    );

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
                    <Tooltip title="下载">
                      <Icon type="download" />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <Icon type="edit" />
                    </Tooltip>,
                    <Tooltip title="分享">
                      <Icon type="share-alt" />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar icon="desktop" size="small" style={{ backgroundColor: '#1890FF' }} />}
                    title={item.additionalInformation.name}
                  />
                  <div className={styles.cardItemContent}>
                    <CardInfo
                      activeUser={item.activeUser}
                      newUser={item.newUser}
                    />
                  </div>
                </Card>
              </List.Item>
            ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 创建应用
                  </Button>
                </List.Item>
              )
          }
        />
      </div>
    </PageHeaderWrapper>)
  }
}

export default OauthApp