import React, {useEffect, useMemo, useState} from 'react'
import Chart from "../../../adminComponents/chart/Chart";
import FeaturedInfo from "../../../adminComponents/featuredInfo/FeaturedInfo";
import "./AdminHome.css";
import { userData } from "../../../DummyData";
import Members from "../../../adminComponents/members/Members";
import Transactions from "../../../adminComponents/transactions/Transactions";
import axios from 'axios'
import { logoutUser, UserType } from '../../../Redux/userSlice';
import { useTypedSelector } from '../../../Redux/Hooks'
import Sidebar from '../../../adminComponents/sidebar/Sidebar';


export interface UserStatsType {
  _id: String,
  total: Number
}

const AdminHome : React.FC = () => {

    const [userStats, setUserStats] = useState<UserStatsType[]>([]);
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)

const MONTHS = useMemo(
    () => [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    ],[]
);


  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/api/users/stats");
        res.data.map((item: any) =>
          setUserStats((prev: any) => [
            ...prev, { name: MONTHS[item._id - 1], "Active User": item.total },
          ])
        );
      } 
      catch (error){
        console.log(error)
      }
    };
    getStats();
  }, [MONTHS]);

  //console.log(userStats)
  //console.log('user', user)


return (
<div className="admin-home">
  <Sidebar/>
  <div className="admin-home-container">
    <FeaturedInfo />
    <Chart
        data={userStats}
        grid
        dataKey="Active User"
    />
    <div className="admin-homeWidgets">
        <Members />
        <Transactions />
    </div>
  </div>
</div>
)}

export default  AdminHome