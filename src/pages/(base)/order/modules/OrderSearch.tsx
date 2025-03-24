import { Button, Col, Form, Input, Row } from 'antd';

const OrderSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      initialValues={searchParams}
      labelCol={{
        md: 7,
        span: 5
      }}
    >
      <Row
        wrap
        gutter={[16, 16]}
      >
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('订单名称')}
            name="name"
          >
            <Input placeholder={t('请输入订单名称')} />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('客户名称')}
            name="customerInfo.name"
          >
            <Input placeholder={t('请输入客户名称')} />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('联系电话')}
            name="customerInfo.phone"
          >
            <Input placeholder={t('请输入联系电话')} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            className="m-0"
            style={{ marginTop: 16, textAlign: 'right' }}
          >
            <Button
              icon={<IconIcRoundRefresh />}
              style={{ marginRight: 12 }}
              onClick={reset}
            >
              {t('common.reset')}
            </Button>
            <Button
              ghost
              icon={<IconIcRoundSearch />}
              type="primary"
              onClick={search}
            >
              {t('common.search')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default OrderSearch;
