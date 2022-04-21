import React, { useState, useEffect } from "react";
import "./Rentals.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/airbnbRed.png";
import { Button, ConnectButton, Icon, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";

const Rentals = () => {
  const {state: searchFilters} = useLocation();
  const [highLight, setHighLight] = useState();
  const [rentalsList, setRentalsList] = useState([]);
  const [coOrdinates,  setCoOrdinates] = useState([]);
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction()
  const dispatch = useNotification();
  // const cords = [];
  // rentalsList.forEach((e) => {
  //   cords.push({ lat: e.attributes.lat, long: e.attributes.long });
  // });
  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.destination}!!`,
      title: "Booking Successful",
      position: "topL",
    });
  }

  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: `${msg}`,
      title: "Booking Failed",
      position: "topL",
    });
  }

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to book a rental`,
      title: "Not Connected",
      position: "topL",
    });
  }

  useEffect(() => {

    async function fetchRentalsList(){
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);
      const results = await query.find();

      console.log("result", results)
      
      const cords = [];
      results.forEach((e) => {
        cords.push({ lat: e.attributes.lat, long: e.attributes.long });
      });
      setCoOrdinates(cords);
      setRentalsList(results);
    }
    fetchRentalsList();

  },[searchFilters]);

  const bookRental = async (start, end, id, dayPrice) => {
    for(var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)){
      arr.push(new Date(dt).toISOString().slice(0, 10)); // yyyy-mm-dd
    }

    let options = {
      contractAddress: "0xe5B7694396F890FBAF6b7172895A9D3c07966202",
      functionName: "addDatesBooked",
      abi: [{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "newBookings",
            "type": "string[]"
          }
        ],
        "name": "addDatesBooked",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }],
      params: {
        id: id,
        newBookings: arr
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error.data.message)
      }
    })
  }

  return (
    <>
     <div className="topBanner">
      <div>
        <img src={logo} className="logo" alt="logo"/>
      </div>
      <div className="searchReminder">
        <div className="filter">
          {searchFilters.destination}
        </div>
        <div className="vl"/>
        <div className="filter">
          {`
            ${searchFilters.checkIn.toLocaleString("default", {month: "short",})}
            ${searchFilters.checkIn.toLocaleString("default", {day: "2-digit",})}
            -
            ${searchFilters.checkOut.toLocaleString("default", {month: "short",})}
            ${searchFilters.checkOut.toLocaleString("default", {day: "2-digit",})}
          `}
        </div>
        <div className="vl"/>
        <div className="filter">
          {searchFilters.guests} Guests
        </div>
        <div className="searchButton">
          <Icon fill="#ffffff" svg="search"/>
        </div>
      </div>
      <div className="lrContainers">
        {
          account &&
          <User account={account}/>
        }
        <ConnectButton/>
      </div>
    </div>
    <div className="line"/>
    <div className="rentalsContent">
      <div className="rentalsContentL">
        Stays Available For Your Destination
        {
          rentalsList.map((e,i) => {
            return (
              <>
              <hr className="line2"/>
              <div className={highLight == i ? "rentalDivH" : "rentalDiv"}>
                <img src={e.attributes.imgUrl} alt="rentalImage" className="rentalImg"></img>
                <div className="rentalInfo">
                  <div className="rentalTitle">{e.attributes.name}</div>
                <div className="rentalDesc">{e.attributes.unoDescription}</div>
                <div className="rentalDesc">{e.attributes.dosDescription}</div>
                <div className="bottomButton">
                  <Button 
                    onClick={() => {
                      if(account){
                        bookRental(searchFilters.checkIn, searchFilters.checkOut, e.attributes.uid_decimal.value.$numberDecimal, Number(e.attributes.pricePerDay_decimal.value.$numberDecimal))
                      } else {
                        handleNoAccount()
                      }
                    }}
                    text="Stay Here" />
                  <div className="price">
                    <Icon fill="#808080" size={10} svg="matic"/> {e.attributes.pricePerDay} / Day
                  </div>
                </div>
                </div>
              </div>
              </>
            )
          })
        }
        <footer style={{ textAlign:"center", bottom:0, left:0, right:0, padding:"20px",  }}>Developed by {' '}<a style={{ cursor:"pointer", fontWeight:"bold"}} target="_blank" href="https://twitter.com/himanshu_eth">Himanshu Purohit</a></footer>
      </div>
      <div className="rentalsContentR">
        <RentalsMap locations={coOrdinates} setHighLight={setHighLight}/>
      </div>
    </div>
   
    </>
  );
};

export default Rentals;
