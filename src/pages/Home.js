import React, {useState} from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import bg from "../images/frontpagebg3.jpg";
import logo  from "../images/airbnb.png";
import { ConnectButton, Select, DatePicker, Input, Icon, Button } from "web3uikit";
import User from "../components/User";
import { useMoralis } from "react-moralis";
const Home = () => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [destination, setDestination] = useState("New York");
  const [guests, setGuests] = useState(2);
  const { account } = useMoralis();

  return (
    <>
    <div className="container" style={{ backgroundImage: `url(${bg})`}}>
      <div className="containerGradinet"></div>
    </div>
    <div className="topBanner">
      <div>
        <img src={logo} className="logo" alt="logo"/>
      </div>
      <div className="tabs">
        <div className="selected">Place To Stay</div>
        <div>Experiences</div>
        <div>Online Experiences</div>
      </div>
      <div className="lrContainers" >
        <ConnectButton/>
      </div>
    </div>
    <div className="tabContent">
      <div className="searchFields">
        <div className="inputs">
          Location
          <Select
            defaultOptionIndex={0}
            onChange={(data) => setDestination(data.label)}
            options={[
              {
                id: 'ny',
                label: "New York"
              },
              {
                id: 'lon',
                label: "London"
              },
              {
                id: 'db',
                label: "Dubai"
              },
              {
                id: 'la',
                label: "Los Angeles"
              }
            ]}
          />
        </div>
        <div className="vl"/>
        <div className="inputs">
          Check In
          <DatePicker
            id="CheckIn"
            onChange={(event) => setCheckIn(event.date)}
          />
        </div>
        <div className="vl"/>
        <div className="inputs">
          Check Out
          <DatePicker
            id="CheckOut"
            onChange={(event) => setCheckOut(event.date)}
          />
        </div>
        <div className="vl"/>
        <div className="inputs">
          Guests          
          <Input 
            value={2}
            name="AddGuests"
            type="number"
            onChange={(event) => setGuests(Number(event.target.value))}
            />
        </div>
        <Link to={"/rentals"} state={{
          destination: destination,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: guests
        }}>
        <div className="searchButton">
          <Icon fill="#ffffff" svg="search"/>
        </div>
        </Link>
      </div>
    </div>
    <div className="randomLocation">
      <div className="title">Feel Adventurous</div>
      <div className="text">
        Let us decide and discover new places to stay, live, work or just relax.
      </div>
      <Button text="Explore A Location" onClick={() => console.log(checkOut)}/>

    </div>
    <footer style={{ position:"absolute", textAlign:"center", color:"#fff", bottom:0, left:0, right:0, backgroundImage: 'linear-gradient(rgb(0,0,0,0),rgb(0,0,0,0.75))', padding:"20px",  }}>Developed by {' '}<a style={{ cursor:"pointer", fontWeight:"bold", color:"#fff"}} target="_blank" href="https://twitter.com/himanshu_eth">Himanshu Purohit</a></footer>
    </>

  );
};

export default Home;
