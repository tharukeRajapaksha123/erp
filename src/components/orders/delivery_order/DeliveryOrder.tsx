import Table, { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { DeliveryOrderModel } from '../../../models/delivery_order_model'
import DeliveryOrderService from '../../../services/delivery_order/delivery_order_service'
import CustomRow from '../../common/Row'
import { Typography } from 'antd';
import WrapperContainer from '../../common/WrapperContainer'
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space } from 'antd';
import CreateDeliveryOrderModal from './CreateDeliveryOrderModal'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteModal from '../../common/DeleteModal'

const { Title } = Typography;


const DeliveryOrder = () => {
  const [open, setOpen] = useState(false);

  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrderModel[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [deleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);



  const openCloseEditModal = async () => {
    await refresher();
    setIsEditModalOpen(!isEditModalOpen);
  }

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const columns: ColumnsType<DeliveryOrderModel> = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Placed Date",
      key: "placed-date",
      render: (_, record: DeliveryOrderModel) => {
        return <div>{record.date.toString().split("T")[0]}</div>
      }

    },
    {
      title: "Transaction Date",
      key: "transactionDate",
      render: (_, record: DeliveryOrderModel) => {
        return <div>{record.transactionDate.toString().split("T")[0]}</div>
      }

    },
    {
      title: "Customer Name",
      dataIndex: "coustomer",
      key: "customer",
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shipping-address",
    },
    {
      title: "Total Bill",
      dataIndex: "totalBill",
      key: "total-bill",
    },
    {
      title: "Order Status",
      key: "status",
      render: (_, record: DeliveryOrderModel) => {
        return <p>{record.status === 0 ? "Not Completed" : "Completed"}</p>
      }
    },
    {
      title: "Order Status",
      key: "status",
      render: (_, record: DeliveryOrderModel) => {
        return <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => {
            const d: DeliveryOrderModel = {
              _id: record._id,
              date: new Date(record.date),
              transactionDate: new Date(record.transactionDate),
              transactionType: record.transactionType,
              coustomer: record.coustomer,
              shippingAddress: record.shippingAddress,
              status: record.status,
              totalBill: record.totalBill,
              companyId: record.companyId,
            }
         
            setSelectedOrder(d)
          setIsEditModalOpen(true)
          }}></Button>
          <Button icon={<DeleteOutlined />} onClick={() => { /*setIsDeleteModalOpen(true)*/ }}></Button>
        </Space>
      }
    },
  ]


  const deleteDeliveryOrder = async () => {
    await DeliveryOrderService.deleteDeliveryItem(selectedOrder?._id!);
    refresher()
    setIsDeleteModalOpen(false)
  }

  const refresher = async () => {
    await DeliveryOrderService.getDeliveryItems(0, 10)
      .then((val) => {
        setDeliveryOrders([...val])
      });
  }


  useEffect(() => {
    DeliveryOrderService.getDeliveryItems(0, 10)
      .then((val) => {
        setDeliveryOrders([...val])
      });
  }, []);

  return (
    <WrapperContainer>
      <CustomRow>
        <Title level={3}>Delivery Order</Title>
        <Tooltip title="Add Delivery Order">
          <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={()=>{setOpen(true)}} />
        </Tooltip>
      </CustomRow>
      <Table columns={columns} className="table" dataSource={deliveryOrders} />
      <CreateDeliveryOrderModal
        shouldOpen={open}
        confirmLoading={confirmLoading}
        handleCancel={handleCancel}
        handleOk={handleOk}/>
      <CreateDeliveryOrderModal
        shouldOpen={isEditModalOpen}
        confirmLoading={false}
        handleCancel={openCloseEditModal}
        handleOk={openCloseEditModal}
        deliveryOrder={selectedOrder}
      />
      <DeleteModal isModalOpen={deleteModalOpen} handleOk={deleteDeliveryOrder} handleCancel={() => { console.log("cale"); setIsDeleteModalOpen(false) }} text={"Delete delivery order"} />
    </WrapperContainer>
  )
}

export default DeliveryOrder