import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const year = new Date().getFullYear();
const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'HanSight',
          title: 'HanSight瀚思科技',
          href: 'https://www.hansight.com',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" />
          {` ${year} 瀚思安信（北京）软件技术有限公司 版权所有`}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
