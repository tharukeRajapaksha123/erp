import Table, { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'

import StockOrderService from '../../services/stock_order_service'
import CustomRow from '../common/Row'
import { Typography } from 'antd';
import WrapperContainer from '../common/WrapperContainer'
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteModal from '../common/DeleteModal'
import CreateStockModal from './CreateStockModel'
import { StockOrderModel } from '../../models/stock_order_model'
const { Title } = Typography;


const StockOrder = () => {
  const [open, setOpen] = useState(false);

  const [stockOrders, setStockOrders] = useState<StockOrderModel[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [deleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);



  const openCloseEditModal = async () => {
    await refresher();
    setIsEditModalOpen(!isEditModalOpen);
  }

  const handleOk = async () => {
    await refresher();
    setOpen(false)
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const columns: ColumnsType<StockOrderModel> = [
    {
      title: "Item ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price"

    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "Instock Quantity",
      dataIndex: "orderqty",
      key: "qty",
    },
    {
      title: "Actions",
      key: "status",
      render: (_, record: StockOrderModel) => {
        return <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => {
            const d: StockOrderModel = {
              _id: record._id,
              name: record.name,
              price: record.price,
              manufacturer: record.manufacturer,
              orderqty: record.orderqty,
              companyId: record.companyId,
            }
            setSelectedOrder(d)
            setIsEditModalOpen(true)
          }}></Button>
          <Button icon={<DeleteOutlined />} onClick={() => {
            const d: StockOrderModel = {
              _id: record._id,
              name: record.name,
              price: record.price,
              manufacturer: record.manufacturer,
              orderqty: record.orderqty,
              companyId: record.companyId,
            }
            setSelectedOrder(d)
            setIsDeleteModalOpen(true)
          }}></Button>
        </Space>
      }
    },
  ]


  const deleteDeliveryOrder = async () => {
    await StockOrderService.deleteOrderQty(selectedOrder?._id!);
    await refresher()
    setIsDeleteModalOpen(false)
  }

  const refresher = async () => {
    await StockOrderService.getOrderQty(0, 10)
      .then((val) => {
        setStockOrders([...val])
      });
  }


  useEffect(() => {
    StockOrderService.getOrderQty(0, 10)
      .then((val) => {
        setStockOrders([...val])
      });
  }, []);




  return (
    <WrapperContainer>
      <CustomRow style={{padding : "16px 0"}}>
        <Title level={3}>Stock Orders</Title>
        <Tooltip title="Add Delivery Order">
          <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={() => { setOpen(true) }} />
        </Tooltip>
      </CustomRow>
      <Table columns={columns} className="table" dataSource={stockOrders} />
      <CreateStockModal
        shouldOpen={open}
        handleCancel={handleCancel}
        handleOk={handleOk} />
      <CreateStockModal
        shouldOpen={isEditModalOpen}
        handleCancel={openCloseEditModal}
        handleOk={openCloseEditModal}
        order={selectedOrder}
      />
      <DeleteModal isModalOpen={deleteModalOpen} handleOk={deleteDeliveryOrder} handleCancel={() => { console.log("cale"); setIsDeleteModalOpen(false) }} text={"Delete stock order"} />
    </WrapperContainer>
  )
}

export default StockOrder