import React from 'react'
import { MouseEvent, useEffect, useState } from 'react'
import { Form, Modal, Col, Row, Input, Button, Select, } from 'antd';
import { DeliveryOrderModel } from "../../models/delivery_order_model"
import stringValidator from "../common/validation_helper"
import DeliveryOrderService from '../../services/delivery_order_service';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table'

import { DownOutlined } from '@ant-design/icons';
import numberValidator from '../common/number_validator';
import ItemService from '../../services/item_service';
import { ItemModel } from '../../models/item_model';
import StockOrderService from '../../services/stock_order_service';
import { StockOrderModel } from '../../models/stock_order_model';


interface Props {
  shouldOpen: boolean,
  handleOk: () => void,
  handleCancel: ((e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void),
  order?: StockOrderModel
}

const CreateStockModal = ({ shouldOpen, handleOk, handleCancel, order }: Props) => {
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [manufacturer, setManufacturer] = useState<string>("")
  const [orderQty, setOrderQty] = useState<number>(0)
  const [enableEditin, setEnableEditing] = useState<boolean>(false);
  const [enableDrop, setEnableDrop] = useState<boolean>(false);
  const [items, setItems] = useState<ItemModel[]>([])


  useEffect(() => {

    if (order) {
      setName(order.name)
      setPrice(order.price);
      setManufacturer(order.manufacturer);
      setOrderQty(order.orderqty);
      setEnableEditing(true)
      setEnableDrop(true);
    }
    console.log(name);

    ItemService.getDeliveryItems(0, 10)
      .then(res => {

        setItems([...res]);
      })
      .catch(err => console.log(`get items from db failed ${err}`))
  }, [manufacturer, name, order, orderQty, price])


  const createStockOrder = async () => {
    console.log(manufacturer)
    const o: StockOrderModel = {
      name: name,
      orderqty: orderQty,
      price: price,
      manufacturer: manufacturer,
      companyId: "1"
    }
    if (order) {
      if (order._id) {
        await StockOrderService.updateOrderQty(order._id, o);
      }

    } else {
      await StockOrderService.createStockQty(o)
    }
    handleOk();
  }


  return (
    <Modal
      open={shouldOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      width={1000}
      title={order ? "Edit Stock" : "Add Stock"}
      footer={null}

    >
      <Form
        layout='vertical'
        autoComplete="false"
        initialValues={{
          "item-name": name,
          "item-manufacturer": manufacturer,
          "item-price": price,
          "item-quantity": orderQty
        }}
      >
        <Row>
          <Col span={11}>
            <Form.Item
              label="Item name"
              name={"item-name"}

              rules={stringValidator("Please enter item name")}
            >
              <Select
                disabled={enableDrop}
                onChange={(val) => {
                  if (val) {
                    setName(val);
                    items.forEach(item => {
                      if (item.name === name) {
                        console.log(name)
                        setManufacturer(item.manufacturer);
                        setPrice(item.price);

                        return;
                      }
                    })
                    console.log("===> " + price);
                    setEnableEditing(true)
                  }
                }}>
                {
                  items.map(item => {
                    return <Select.Option
                      value={item.name}
                      key={item._id}>
                      {item.name}
                    </Select.Option>
                  })
                }
              </Select>
            </Form.Item>

          </Col>
          <Col span={2} />
          <Col span={11}>
            <Form.Item
              label="Manufafturer"
              name={"item-manufacturer"}
              initialValue={
                manufacturer
              }
            >
              <Input value={manufacturer} onChange={(val) => { setManufacturer(val.target.value) }}
                disabled={enableEditin} placeholder={manufacturer}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              label="Price"
              name={"item-price"}
              initialValue={
                price
              }
              rules={numberValidator("Please enter valid item price")}
            >
              <Input
                value={price}
                placeholder={`${price}`}
                onChange={(val) => { setPrice(parseFloat(val.target.value)) }}
                disabled={enableEditin}

              />
            </Form.Item>
          </Col>
          <Col span={2} />
          <Col span={11}>
            <Form.Item
              label="Quantity"
              name={"item-quantity"}
              rules={numberValidator("Please enter valid item quantity")}
            >
              <Input onChange={(val) => { setOrderQty(parseInt(val.target.value)) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} />
          <Col span={4}>
            <Button type='primary' style={{ width: "100%" }} htmlType='submit' onClick={() => { createStockOrder() }}>{order ? "Update Stock" : "Create Stock"}</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateStockModal