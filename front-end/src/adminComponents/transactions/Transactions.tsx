import React, { useEffect, useState } from "react";
import "./Transactions.css";
import {format} from "timeago.js"
import axios from 'axios'
import { OrderType } from "../../Redux/orderSlice";

const Transactions: React.FC = () => {

const [orders, setOrders] = useState<OrderType[]>([]);

useEffect(() => {
    const getOrders = async () => {
    try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
    } catch (error) {
        console.log(error.message)
    }
    };
    getOrders();
}, []);

console.log(orders)

return (
<div className="transactions">
    <h3 className="transactionsTitle">Latest transactions</h3>
    <table className="transactionsTable">
    <tbody>
        <tr className="transactionsTr">
            <th className="transactionsTh">Customer</th>
            <th className="transactionsTh">Date</th>
            <th className="transactionsTh">Amount</th>
            <th className="transactionsTh">Status</th>
        </tr>
        {orders.map((order) => (
        <tr className="transactionsTr" key={order._id}>
            <td className="transactionsUser">
                <span className="transactionsName">{order.userId}</span>
            </td>
            <td className="transactionsDate">{format(order.createdAt)}</td>
            <td className="transactionsAmount">${order.amount}</td>
            <td className="transactionsStatus">
                <button className={"transactionsButton " + order.status}>{order.status}</button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
</div>
)}

export default Transactions