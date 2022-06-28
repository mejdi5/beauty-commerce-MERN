import React, { useEffect, useState } from 'react'
import "./FeaturedInfo.css";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import axios from 'axios'

const FeaturedInfo: React.FC = () => {
  
  const [income, setIncome] = useState<any>([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const res = await axios.get("/api/orders/income");
        console.log(res.data)
        setIncome(res.data);
        setPercentage(res.data.length > 1 ? (res.data[1].total * 100) / res.data[0].total - 100 : 0);
      } catch (error) {
        console.log(error.message)
      }
    };
    getIncome();
  }, []);



  return (
      <div className="featuredInfo">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${income?.length > 1 ? income[1]?.total : income[0]?.total}</span>
          <span className="featuredMoneyRate">
            {percentage < 0 ? (
              <ArrowDownwardIcon className="featuredIcon negative" />
            ) : (
              <ArrowUpwardIcon className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
  );
}

export default FeaturedInfo